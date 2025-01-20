import { ok, err } from "true-myth/result";
import { SupabaseClient } from "@supabase/supabase-js";
import { STRIPE_PRODUCT_LIST } from "./product-list.js";
import { StripeProduct } from "./product-list.js";
import { COUPON_CODE_LIST } from "./coupon-code-list.js";
import Stripe from "stripe";

export const handleSubscriptionChange = async (
  current_usage_id: string,
  subscriptionId: string,
  subscription: Stripe.Subscription,
  startDate: Date,
  endDate: Date,
  orgId: string,
  supabase: SupabaseClient,
  stripe: Stripe
) => {
  if (!current_usage_id) {
    return err("Error fetching current usage id");
  }

  const { data: usageData, error: usageError } = await supabase
    .from("Usage")
    .select(
      "credits_charged,additional_credits_charged,credits_used,coupon_code"
    )
    .eq("id", current_usage_id)
    .single();

  if (usageError || !usageData) {
    return err("Error fetching current credits details");
  }

  const creditsLeft =
    parseInt(usageData.credits_charged, 10) +
    parseInt(usageData.additional_credits_charged, 10) -
    parseInt(usageData.credits_used, 10);

  const productId = subscription.metadata.productId;
  const newCouponCode = subscription.metadata.couponCode;
  const oldCouponCode = usageData.coupon_code;

  const stripeProduct = STRIPE_PRODUCT_LIST.find(
    (product: StripeProduct) => product.stripeProductId === productId
  );

  if (!stripeProduct) {
    return err("Product not found for productId: " + productId);
  }

  const credits =
    stripeProduct.credits +
    ((newCouponCode && COUPON_CODE_LIST.includes(newCouponCode)) ||
    oldCouponCode
      ? stripeProduct.credits * 0.2
      : 0);

  const { error: existingUsageEndDateUpdateError } = await supabase
    .from("Usage")
    .update({ end_date: new Date().toISOString() })
    .eq("id", current_usage_id);

  if (existingUsageEndDateUpdateError) {
    return err("Error updating existing subscription usage date");
  }
  const { data: newUsageInsertData, error: newUsageInsertError } =
    await supabase
      .from("Usage")
      .insert({
        stripe_subscription_id: subscriptionId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        credits_charged: credits,
        additional_credits_charged: creditsLeft,
        org_id: orgId,
        plan: stripeProduct.plan,
        term: stripeProduct.term,
        coupon_code:
          newCouponCode && COUPON_CODE_LIST.includes(newCouponCode)
            ? newCouponCode
            : oldCouponCode,
      })
      .select("id")
      .single();

  if (newUsageInsertError) {
    return err(
      `Error inserting new usage record: ${newUsageInsertError.message}`
    );
  }

  const { error: usageIdUpdateError } = await supabase
    .from("Organization")
    .update({ current_usage_id: newUsageInsertData?.id })
    .eq("org_id", orgId);

  if (usageIdUpdateError) {
    return err("Error updating new usage id in Organization table");
  }

  // Reset the metadata as the update is done
  await stripe.subscriptions.update(subscriptionId, {
    metadata: "",
  });

  return ok("Invoice payment processed successfully for subscription update.");
};
