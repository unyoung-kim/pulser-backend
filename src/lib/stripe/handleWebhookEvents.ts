import { SupabaseClient } from "@supabase/supabase-js";
import Result, { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { getStripeClient } from "./get-stripe-client.js";
import Stripe from "stripe";

export const handleWebhookEvents = async (
  signature: string,
  body: string
): Promise<Result<string, string>> => {
  const stripeWebhookSecret: string | null =
    process.env.STRIPE_WEBHOOK_SECRET ?? null;

  if (stripeWebhookSecret == null) {
    return err("Stripe webhook secret not found");
  }

  const stripeClientResult = getStripeClient();
  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }
  const stripe = stripeClientResult.value;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    );
  } catch (error) {
    return err(`Webhook signature verification failed. ${error}`);
  }

  if (!event || !event.id || !event.type) {
    return err("Event is not fetched properly");
  }

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  // Prevent duplicate events
  const { data: existingEvent, error: existingEventError } = await supabase
    .from("Event")
    .select("stripe_event_id")
    .eq("stripe_event_id", event.id)
    .eq("event_type", event.type)
    .single();

  if (!existingEventError && existingEvent) {
    return ok("Duplicate event");
  }

  const { error: eventIdInsertingError } = await supabase
    .from("Event")
    .insert({ stripe_event_id: event.id, event_type: event.type });

  if (eventIdInsertingError) {
    console.error(`Error inserting event ID: ${eventIdInsertingError}`);
    return err("Failed to track event.");
  }

  // Dispatch event to specific handler
  try {
    switch (event.type) {
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
      case "customer.subscription.created":
        return handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
          supabase
        );
      case "invoice.payment_succeeded":
        return handleInvoicePaid(event.data.object as Stripe.Invoice, supabase);
      case "payment_intent.succeeded":
        return handleOneTimePayment(
          event.data.object as Stripe.PaymentIntent,
          supabase
        );
      case "payment_intent.payment_failed":
        return handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      case "customer.subscription.deleted":
        return handleSubscriptionCancelled(
          event.data.object as Stripe.Subscription
        );
      case "invoice.marked_uncollectible":
        return handleInvoiceUncollectible(event.data.object as Stripe.Invoice);
      default:
        return logInformationalEvent(event);
    }
  } catch (error) {
    console.error(`Error handling event type ${event.type}:`, error);
    return err(`Failed to handle event type: ${event.type}`);
  }
};

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
): Promise<Result<string, string>> => {
  const { mode } = session;

  if (mode === "payment") {
    // One-time payments are handled in `payment_intent.succeeded`.
    return ok("Handled by payment_intent.succeeded.");
  }

  if (mode === "subscription") {
    // Subscriptions are handled by `customer.subscription.created`.
    return ok("Handled by customer.subscription.created.");
  }

  return err("Unexpected session mode.");
};

export const handleSubscriptionCreated = async (
  subscription: Stripe.Subscription,
  supabase: SupabaseClient
): Promise<Result<string, string>> => {
  const startDate = new Date(subscription.current_period_start * 1000);
  const endDate = new Date(subscription.current_period_end * 1000);

  if (!startDate || !endDate) {
    return err("startDate/endDate invalid/not provided.");
  }

  const { error } = await supabase.from("Usage").insert({
    stripeSubscriptionId: subscription.id,
    startdate: startDate.toISOString(),
    enddate: endDate.toISOString(),
    credits_charged: subscription.metadata?.credits ?? 0,
  });

  return error ? err(error.message) : ok("Subscription created successfully.");
};

export const handleInvoicePaid = async (
  invoice: Stripe.Invoice,
  supabase: SupabaseClient
): Promise<Result<string, string>> => {
  // Check if it's a subscription payment (subscription ID exists)
  const subscriptionId = invoice.subscription as string | null;

  if (!subscriptionId) {
    // If no subscription ID, it's not a subscription renewal, so do nothing here.
    return ok("Not a subscription renewal, skipping invoice payment handling.");
  }

  const startDate = new Date(invoice.period_start * 1000);
  const endDate = new Date(invoice.period_end * 1000);

  // Retrieve the credits charged from metadata (this could apply to both subscriptions and one-time payments)
  const creditsCharged = parseInt(invoice.metadata?.credits ?? "0", 10);

  if (!startDate || !endDate || creditsCharged <= 0) {
    return err("startDate, endDate, or creditsCharged are invalid/missing.");
  }

  // Insert into the Usage table for subscription renewals
  const { error } = await supabase.from("Usage").insert({
    stripeSubscriptionId: subscriptionId,
    startdate: startDate.toISOString(),
    enddate: endDate.toISOString(),
    credits_charged: creditsCharged,
  });

  return error
    ? err(error.message)
    : ok("Invoice payment processed successfully for subscription.");
};

export const handleOneTimePayment = async (
  paymentIntent: Stripe.PaymentIntent,
  supabase: SupabaseClient
): Promise<Result<string, string>> => {
  // Retrieve relevant metadata
  const orgId = paymentIntent.metadata?.orgId;
  const credits = parseInt(paymentIntent.metadata?.credits ?? "0", 10);

  // Check for missing or invalid credits
  if (!orgId || credits <= 0) {
    return err("Invalid metadata: orgId or credits are missing/invalid.");
  }

  // Fetch the current billing cycle entry in `Usage`
  const { data, error: usageError } = await supabase
    .from("Usage")
    .select("*")
    .eq("orgId", orgId)
    .lte("startdate", new Date().toISOString())
    .gte("enddate", new Date().toISOString())
    .single();

  if (usageError || !data) {
    return err("Failed to fetch current billing cycle for orgId.");
  }

  // Update the `additionalCreditsCharged` field
  const { error: updateError } = await supabase
    .from("Usage")
    .update({
      additionalCreditsCharged: data.additionalCreditsCharged + credits,
    })
    .eq("id", data.id);

  return updateError
    ? err(updateError.message)
    : ok("One-time payment processed successfully.");
};

export const handlePaymentFailed = async (
  paymentIntent: Stripe.PaymentIntent
): Promise<Result<string, string>> => {
  console.log("Payment failed for PaymentIntent:", paymentIntent.id);
  return ok("Payment failure logged.");
};

export const handleSubscriptionCancelled = async (
  subscription: Stripe.Subscription
): Promise<Result<string, string>> => {
  console.log("Subscription cancelled for ID:", subscription.id);
  return ok("Subscription cancellation logged.");
};

export const handleInvoiceUncollectible = async (
  invoice: Stripe.Invoice
): Promise<Result<string, string>> => {
  console.log("Invoice marked uncollectible for ID:", invoice.id);
  return ok("Invoice uncollectible logged.");
};

export const logInformationalEvent = async (
  event: Stripe.Event
): Promise<Result<string, string>> => {
  console.log(`Informational event received: ${event.type}`);
  return ok("Event logged successfully.");
};
