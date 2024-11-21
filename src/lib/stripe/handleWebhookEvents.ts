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

  if (!event || !event.id || !event.type || !event.data.object) {
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
    console.error(`Error inserting event ID: ${eventIdInsertingError.message}`);
    return err("Failed to track event.");
  }

  // Dispatch event to specific handler
  try {
    switch (event.type) {
      case "invoice.payment_succeeded":
        return handleInvoicePaid(
          event.data.object as Stripe.Invoice,
          supabase,
          stripe as Stripe
        );
      default:
        return logInformationalEvent(event);
    }
  } catch (error) {
    console.error(`Error handling event type ${event.type}:`, error);
    return err(`Failed to handle event type: ${event.type}`);
  }
};

export const handleInvoicePaid = async (
  invoice: Stripe.Invoice,
  supabase: SupabaseClient,
  stripe: Stripe
): Promise<Result<string, string>> => {
  const customer = invoice.customer as string | null;

  if (customer == null) {
    return err("Customer id not found in invoice");
  }

  const sessions: Stripe.Checkout.Session[] = (
    await stripe.checkout.sessions.list({
      customer: customer,
    })
  ).data;

  const sessionList = sessions.filter((s) => s.invoice === invoice.id);

  if (sessionList.length !== 1) {
    return err("Error geting unique session");
  }

  const session = sessionList.at(0);

  if (!session || !session.metadata) {
    return err("Error getting metadata from session");
  }

  const orgId = session.metadata.orgId;
  const creditsCharged = parseInt(String(session.metadata.credits ?? "0"), 10);
  const start = parseInt(
    String(invoice.lines.data.at(0)?.period.start ?? "0"),
    10
  );
  const end = parseInt(String(invoice.lines.data.at(0)?.period.end ?? "0"), 10);
  const startDate = new Date(start * 1000);
  const endDate = new Date(end * 1000);

  // Check if it's a subscription payment (subscription ID exists)
  const subscriptionId = invoice.subscription as string | null;

  // Handle subscription renewal or one-time payment based on subscriptionId
  if (subscriptionId) {
    // Handle subscription payment (renewal)

    if (!startDate || !endDate || creditsCharged <= 0) {
      return err("startDate, endDate, or creditsCharged are invalid/missing.");
    }

    // Insert into the Usage table for subscription renewals
    const { error } = await supabase.from("Usage").insert({
      stripe_subscription_id: subscriptionId,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      credits_charged: creditsCharged,
    });

    return error
      ? err(error.message)
      : ok("Invoice payment processed successfully for subscription.");
  } else {
    // Handle one-time payment

    if (!orgId || creditsCharged <= 0) {
      return err("Invalid metadata: orgId or credits are missing/invalid.");
    }

    const { data: customerId, error: stripeCustomerIdFetchError } =
      await supabase
        .from("Organization")
        .select("stripe_customer_id")
        .eq("org_id", orgId)
        .single();

    if (stripeCustomerIdFetchError) {
      return err("Error in fetching stripe cutomer id from database");
    }

    if (!customerId.stripe_customer_id) {
      return err("Stripe customer id not found in database");
    }

    const subscription = await stripe.subscriptions.list({
      customer: customerId.stripe_customer_id,
      status: "active",
    });

    if (!subscription?.data || subscription.data.length === 0) {
      return err("Error in fetching subscription id");
    }

    const subscriptionData = subscription.data.at(0);
    if (!subscriptionData) {
      return err("No active subscription found.");
    }

    const subscriptionId = subscriptionData.id;

    // Fetch the current billing cycle entry in `Usage`
    const { data, error: usageError } = await supabase
      .from("Usage")
      .select("*")
      .eq("stripe_subscription_id", subscriptionId)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .single();

    if (usageError || !data) {
      return err("Failed to fetch current billing cycle for orgId.");
    }

    // Update the `additionalCreditsCharged` field
    const { error: updateError } = await supabase
      .from("Usage")
      .update({
        additional_credits_charged:
          data.additional_credits_charged + creditsCharged,
      })
      .eq("id", data.id);

    return updateError
      ? err(updateError.message)
      : ok("One-time payment processed successfully.");
  }
};

export const logInformationalEvent = async (
  event: Stripe.Event
): Promise<Result<string, string>> => {
  console.log(`Informational event received:`);
  console.log(`Event ID: ${event.id}`);
  console.log(`Event Type: ${event.type}`);

  // Log the object that triggered the event
  if (event.data && event.data.object) {
    console.log(`Event Object:`, event.data.object);
  } else {
    console.log(`Event Object: Not Available`);
  }

  // Log additional metadata if available
  if ("metadata" in event.data.object) {
    console.log(`Metadata:`, event.data.object.metadata);
  } else {
    console.log(`Metadata: Not Available`);
  }

  // Log timestamp of the event for better tracking
  const eventTimestamp = new Date(event.created * 1000).toISOString();
  console.log(`Event Timestamp: ${eventTimestamp}`);

  return ok("Event logged successfully with details.");
};
