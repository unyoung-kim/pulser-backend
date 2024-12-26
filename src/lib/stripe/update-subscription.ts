import { SupabaseClient } from "@supabase/supabase-js";
import Result, { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { getStripeClient } from "./get-stripe-client.js";
import { STRIPE_PRODUCT_LIST } from "./product-list.js";
import { StripeProduct } from "./product-list.js";

export const updateSubscription = async (
  orgId: string,
  productId: string
): Promise<Result<string, string>> => {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const { data: stripeSubscriptionIdData, error: stripeSubscriptionIdError } =
    await supabase
      .from("Usage")
      .select("stripe_subscription_id")
      .eq("org_id", orgId)
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
      productId: productId,
      forUpdate: "true",
    },
  });

  const stripeProduct = STRIPE_PRODUCT_LIST.find(
    (product: StripeProduct) => product.stripeProductId === productId
  );

  if (!stripeProduct) {
    return err("Product not found for productId: " + productId);
  }

  await stripe.subscriptions.update(stripeSubscriptionId, {
    items: [
      {
        id: subscriptionItemId,
        price: stripeProduct.stripePriceId,
      },
    ],
    proration_behavior: "none",
    payment_behavior: "pending_if_incomplete",
  });

  return ok("Subscription updated successfully");
};
