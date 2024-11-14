import { SupabaseClient } from "@supabase/supabase-js";
import Result, { err, ok } from "true-myth/result";
import { getSupabaseClient } from "./get-supabase-client.js";
import { getStripeClient } from "./get-stripe-client.js";

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

  if (!event.data.object || !("id" in event.data.object)) {
    return err("Event object does not have an id");
  }

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const { data: existingEvent, error: existingEventError } = await supabase
    .from("Event")
    .select("id")
    .eq("id", event.data.object.id)
    .eq("event_type", event.type);

  if (!existingEventError && existingEvent && existingEvent.length > 0) {
    return ok("Duplicate event");
  }

  const { error: eventIdInsertingError } = await supabase
    .from("Event")
    .insert([{ id: event.data.object.id, event_type: event.type }]);

  if (eventIdInsertingError) {
    console.log(`Error in inserting event id: ${eventIdInsertingError}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const projectId = session.customer;
    const subscriptionId = session.subscription;

    await supabase
      .from("Subscription")
      .upsert({ projectId, subscriptionId, status: "SUBSCRIPTION_ACTIVE" });
  } else if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    const projectId = invoice.customer;
    const subscriptionId = invoice.subscription;

    await supabase
      .from("Subscription")
      .upsert({ projectId, subscriptionId, status: "SUBSCRIPTION_FAILED" });
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const subscriptionId = subscription.id;

    await supabase
      .from("Subscription")
      .delete()
      .eq("subscription_id", subscriptionId);
  } else if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    const projectId = subscription.customer;
    const subscriptionId = subscription.id;
    const status =
      subscription.status === "active"
        ? "SUBSCRIPTION_ACTIVE"
        : "SUBSCRIPTION_PAUSED";

    await supabase
      .from("Subscription")
      .upsert({ projectId, subscriptionId, status });
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const projectId = session.customer;
    const subscriptionId = session.subscription;

    await supabase
      .from("Subscription")
      .upsert({ projectId, subscriptionId, status: "SUBSCRIPTION_FAILED" });
  } else if (event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    const projectId = subscription.customer;
    const subscriptionId = subscription.id;

    await supabase
      .from("Subscription")
      .upsert({ projectId, subscriptionId, status: "SUBSCRIPTION_ACTIVE" });
  } else if (event.type === "customer.subscription.resumed") {
    const subscription = event.data.object;
    const projectId = subscription.customer;
    const subscriptionId = subscription.id;

    await supabase
      .from("Subscription")
      .upsert({ projectId, subscriptionId, status: "SUBSCRIPTION_ACTIVE" });
  } else if (event.type === "customer.subscription.paused") {
    const subscription = event.data.object;
    const projectId = subscription.customer;
    const subscriptionId = subscription.id;

    await supabase
      .from("Subscription")
      .upsert({ projectId, subscriptionId, status: "SUBSCRIPTION_PAUSED" });
  }

  return ok("Webhook event received");
};
