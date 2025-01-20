import { ok, err } from "true-myth/result";
import Stripe from "stripe";
import { SupabaseClient } from "@supabase/supabase-js";
import { STRIPE_PRODUCT_LIST } from "./product-list.js";
import { StripeProduct } from "./product-list.js";

export const handleOneTimePayment = async (
  sessionList: Stripe.Checkout.Session[],
  orgId: string,
  supabase: SupabaseClient
) => {
  if (sessionList.length !== 1) {
    return err("Error getting unique session");
  }

  const session = sessionList.at(0);

  if (!session || !session.metadata) {
    return err("Error getting metadata from session");
  }

  const stripeProduct = STRIPE_PRODUCT_LIST.find(
    (product: StripeProduct) =>
      product.stripeProductId === session.metadata?.productId
  );

  if (!stripeProduct) {
    return err(
      "Product not found for productId: " + session.metadata?.productId
    );
  }

  const { data: currentUsageIdData, error: currentUsageIdError } =
    await supabase
      .from("Organization")
      .select("current_usage_id")
      .eq("org_id", orgId)
      .single();

  if (currentUsageIdError || !currentUsageIdData?.current_usage_id) {
    return err("Error fetching current usage id");
  }

  // Update the Usage record
  const { error } = await supabase.rpc("increment_additional_credits_charged", {
    usage_id: currentUsageIdData.current_usage_id,
    increment_value: stripeProduct.credits,
  });

  if (error) {
    return err(`Error updating additional credits: ${error.message}`);
  }

  return error ? err(error) : ok("One-time payment processed successfully.");
};
