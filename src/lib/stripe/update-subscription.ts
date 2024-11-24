import Result, { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { getStripeClient } from "./get-stripe-client.js";
import Stripe from "stripe";

export const updateSubscription = async (
  orgId: string,
  priceId: string,
  credits: string
): Promise<Result<string, string>> => {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const {
    data: stripeCustomerIdFetchResponse,
    error: stripeCustomerIdFetchError,
  } = await supabase
    .from("Organization")
    .select("stripe_customer_id")
    .eq("org_id", orgId)
    .single();

  const stripeCustomerId = stripeCustomerIdFetchResponse?.stripe_customer_id;

  if (stripeCustomerIdFetchError || !stripeCustomerId) {
    return err("Unable to fetch stripe customer id for the org id");
  }

  const stripeClientResult = getStripeClient();
  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }
  const stripe = stripeClientResult.value;

  const subscriptions: Stripe.Subscription[] = (
    await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
    })
  ).data;

  const activeSubscription = subscriptions.at(0);

  const subscriptionId = activeSubscription?.id;
  const subscriptionItemId = activeSubscription?.items.data[0].id;

  if (subscriptions.length != 1 || !subscriptionId || !subscriptionItemId) {
    return err("Error fetching active subscription details");
  }

  await stripe.subscriptions.update(subscriptionId, {
    metadata: {
      //   subscriptionItemId,
      //   oldSubscriptionPriceId: subscriptionPriceId,
      //   oldBillingCycleAnchor,
      newCredits: credits,
      forUpdate: "true",
    },

    items: [
      {
        id: subscriptionItemId,
        price: priceId,
      },
    ],
    proration_behavior: "none",
    payment_behavior: "pending_if_incomplete",
  });

  return ok("Subscription updated successfully");
};
