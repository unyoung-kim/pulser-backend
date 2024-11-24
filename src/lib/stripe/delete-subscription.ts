import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { Result } from "true-myth";
import { getSupabaseClient } from "../get-supabase-client.js";
import { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";

export const deleteSubscription = async (
  orgId: string
): Promise<Result<string, string>> => {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const { data: stripeCustomerIdData, error: stripeCustomerIdFetchError } =
    await supabase
      .from("Organization")
      .select("stripe_customer_id")
      .eq("org_id", orgId)
      .single();

  if (stripeCustomerIdFetchError) {
    return err("Error in fetching stripe customer id");
  }

  if (stripeCustomerIdData?.stripe_customer_id) {
    return err("Stripe customer id not found");
  }

  const stripeClientResult = getStripeClient();
  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }
  const stripe = stripeClientResult.value;

  const subscriptions: Stripe.Subscription[] = (
    await stripe.subscriptions.list({
      customer: stripeCustomerIdData.stripe_customer_id,
      status: "active",
    })
  ).data;

  const subscriptionId = subscriptions.at(0)?.id;

  if (subscriptions.length != 1 || !subscriptionId) {
    return err("Error retrieving active subscription");
  }

  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true, // Mark subscription for cancellation at the end of the period
  });

  return ok("Subscription successfully deleted");
};
