import { SupabaseClient } from "@supabase/supabase-js";
import Result, { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { getStripeClient } from "./get-stripe-client.js";
import Stripe from "stripe";
import { handleInvoicePaid } from "./handle-invoice-paid.js";
import { logInformationalEvent } from "./log-informational-event.js";

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
      // case "invoice.payment_failed":
      //   return handleInvoicePaymentFailed(
      //     event.data.object as Stripe.Invoice,
      //     stripe as Stripe
      //   );
      default:
        return logInformationalEvent(event);
    }
  } catch (error) {
    console.error(`Error handling event type ${event.type}:`, error);
    return err(`Failed to handle event type: ${event.type}`);
  }
};

// export const handleInvoicePaymentFailed = async (
//   invoice: Stripe.Invoice,
//   stripe: Stripe
// ) => {
//   const subscriptionId = invoice.subscription as string | null;
//   if (subscriptionId) {
//     const subscription = await stripe.subscriptions.retrieve(subscriptionId);

//     const forUpdate = subscription.metadata.forUpdate;
//     const subscriptionItemId = subscription.metadata.subscriptionItemId;
//     const oldSubscriptionPriceId = subscription.metadata.oldSubscriptionPriceId;
//     const oldBillingCycleAnchor = subscription.metadata.oldBillingCycleAnchor;

//     if (forUpdate) {
//       if (
//         !subscriptionItemId ||
//         !oldSubscriptionPriceId ||
//         !oldBillingCycleAnchor
//       ) {
//         return err("Error in getting old data from metadata");
//       }
//       await stripe.subscriptions.update(subscriptionId, {
//         metadata: {},
//         items: [
//           {
//             id: subscriptionItemId,
//             price: oldSubscriptionPriceId,
//           },
//         ],
//         proration_behavior: "none",
//         billing_cycle_anchor: ,
//       });
//     }
//   }

//   return ok("Stripe subscription updated");
// };
