import { SupabaseClient } from "@supabase/supabase-js";
import Result, { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { getStripeClient } from "./get-stripe-client.js";
import { STRIPE_PRODUCT_LIST, StripeProduct } from "./product-list.js";

export const updateSubscription = async (
  orgId: string,
  plan: "BASIC" | "PRO" | "AGENCY",
  term: "MONTHLY" | "YEARLY",
  couponCode?: string
): Promise<Result<string, string>> => {
  // Find the stripe product for the given plan and term
  const stripeProduct: StripeProduct | undefined = STRIPE_PRODUCT_LIST.find(
    (product: StripeProduct) => product.plan === plan && product.term === term
  );

  if (!stripeProduct) {
    return err("Couldn't find the plan or term");
  }

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const { data: orgData, error: orgError } = await supabase
    .from("Organization")
    .select("current_usage_id")
    .eq("org_id", orgId)
    .single();

  if (orgError || !orgData) {
    return err("Error fetching current usage id");
  }

  const current_usage_id = orgData.current_usage_id;

  const { data: stripeSubscriptionIdData, error: stripeSubscriptionIdError } =
    await supabase
      .from("Usage")
      .select("stripe_subscription_id")
      .eq("id", current_usage_id)
      .single();

  if (stripeSubscriptionIdError || !stripeSubscriptionIdData) {
    return err("Error fetching current stripe subscription id");
  }

  const stripeSubscriptionId = stripeSubscriptionIdData.stripe_subscription_id;

  const stripeClientResult = getStripeClient();
  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }
  const stripe = stripeClientResult.value;

  const subscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId
  );

  const subscriptionItemId = subscription.items.data[0].id;

  await stripe.subscriptions.update(stripeSubscriptionId, {
    metadata: {
      productId: stripeProduct.stripeProductId,
      forUpdate: "true",
      couponCode: couponCode ?? null,
    },
  });

  await stripe.subscriptions.update(stripeSubscriptionId, {
    items: [
      {
        id: subscriptionItemId,
        price: stripeProduct.stripePriceId,
      },
    ],
    billing_cycle_anchor: "now",
    proration_behavior: "none",
    payment_behavior: "pending_if_incomplete",
  });

  return ok("Subscription updated successfully");
};
