import Result, { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";

export async function getSubscriptionStatusFromStripe(
  subscriptionId: string
): Promise<Result<string, string>> {
  const stripeClientResult = getStripeClient();
  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }

  const stripe = stripeClientResult.value;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return ok(subscription.status); // e.g., 'active', 'past_due', 'canceled'
  } catch (error) {
    return err(`Error fetching subscription: ${error}`);
  }
}
