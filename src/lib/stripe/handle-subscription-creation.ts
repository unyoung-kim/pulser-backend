import { ok } from "true-myth/result";
import Stripe from "stripe";
import { StripeProduct } from "./product-list.js";
import { err } from "true-myth/result";
import { STRIPE_PRODUCT_LIST } from "./product-list.js";
import { COUPON_CODE_LIST } from "./coupon-code-list.js";
import { SupabaseClient } from "@supabase/supabase-js";

export const handleSubscriptionCreation = async (
  customer: string,
  subscriptionId: string,
  sessionList: Stripe.Checkout.Session[],
  startDate: Date,
  endDate: Date,
  supabase: SupabaseClient
) => {
  const { data: orgData, error: orgIdError } = await supabase
    .from("Organization")
    .select("org_id,current_usage_id")
    .eq("stripe_customer_id", customer)
    .single();

  if (orgIdError || !orgData?.org_id) {
    return err("Error fetching org id for the stripe customer id");
  }

  const orgId = orgData?.org_id;
  const current_usage_id = orgData?.current_usage_id;
  if (sessionList.length !== 1) {
    return err("Error getting unique session");
  }

  const session = sessionList.at(0);

  if (!session || !session.metadata) {
    return err("Error getting metadata from session");
  }

  const productId = session.metadata.productId;
  const couponCode = session.metadata.couponCode;

  if (productId == null) {
    return err("productId metadata is missing");
  }

  const stripeProduct = STRIPE_PRODUCT_LIST.find(
    (product: StripeProduct) => product.stripeProductId === productId
  );

  if (!stripeProduct) {
    return err("Product not found for productId: " + productId);
  }

  const credits =
    stripeProduct.credits +
    (couponCode && COUPON_CODE_LIST.includes(couponCode)
      ? stripeProduct.credits * 0.2
      : 0);

  // Search for the usage record for Free Credits with end date null
  const { data: freeCreditUsageData, error: freeCreditUsageError } =
    await supabase
      .from("Usage")
      .select("id")
      .eq("id", current_usage_id)
      .eq("plan", "FREE_CREDIT")
      .is("end_date", null);

  if (freeCreditUsageError || !freeCreditUsageData) {
    return err("Error fetching current usage id");
  }

  // If there is a free credits usage record, update its end date to today
  if (freeCreditUsageData.length !== 0) {
    const { error: usageEndDateUpdateError } = await supabase
      .from("Usage")
      .update({ end_date: new Date().toISOString().split("T")[0] })
      .eq("id", current_usage_id);

    if (usageEndDateUpdateError) {
      return err("Error updating existing subscription usage date");
    }
  }

  // Fetch the remaining credits for the cancelled subscription, if applicable
  const { data: currentUsageData, error: currentUsageError } = await supabase
    .from("Usage")
    .select(
      "is_cancelled,credits_used,credits_charged,additional_credits_charged"
    )
    .eq("id", current_usage_id)
    .gt("end_date", new Date().toISOString().split("T")[0]);

  if (currentUsageError || !currentUsageData) {
    return err("Error fetching current usage details");
  }

  const creditsLeft =
    currentUsageData.length === 1 && currentUsageData.at(0)?.is_cancelled
      ? parseInt(currentUsageData.at(0)?.credits_charged, 10) +
        parseInt(currentUsageData.at(0)?.additional_credits_charged, 10) -
        parseInt(currentUsageData.at(0)?.credits_used, 10)
      : 0;

  // Insert into the Usage table for subscription creation
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
          couponCode && COUPON_CODE_LIST.includes(couponCode)
            ? couponCode
            : null,
      })
      .select("id")
      .single();

  if (newUsageInsertError) {
    return err("Error inserting new usage record");
  }

  const { error: usageIdUpdateError } = await supabase
    .from("Organization")
    .update({ current_usage_id: newUsageInsertData?.id })
    .eq("org_id", orgId);

  if (usageIdUpdateError) {
    return err("Error updating new usage id in Organization table");
  }

  return ok("Invoice payment processed successfully for subscription.");
};
