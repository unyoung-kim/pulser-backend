import Result, { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";
import { getSupabaseClient } from "../get-supabase-client.js";
import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function getSubscriptionStatusFromStripe(
  orgId: string
): Promise<Result<string, string>> {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const { data: currentUsageIdData, error: currentUsageIdFetchError } =
    await supabase
      .from("Organization")
      .select("current_usage_id")
      .eq("org_id", orgId)
      .single();

  if (currentUsageIdFetchError || !currentUsageIdData?.current_usage_id) {
    return err("Error in fetching stripe customer id");
  }

  const { data: currentUsageData, error: currentUsageFetchError } =
    await supabase
      .from("Usage")
      .select("*")
      .eq("id", currentUsageIdData.current_usage_id)
      .single();

  if (currentUsageFetchError || !currentUsageData) {
    return err("Error in fetching current usage record");
  }

  if (!currentUsageData.stripe_subscription_id) {
    return ok(`
      "subscribed": "false",
      "credits_used": ${currentUsageData.credits_used},
      "credits_charged": ${currentUsageData.credits_charged},
      "additional_credits": ${currentUsageData.additional_credits_charged}`);
  } else {
    const stripeClientResult = getStripeClient();
    if (stripeClientResult.isErr) {
      return err(stripeClientResult.error);
    }
    const stripe = stripeClientResult.value;

    const subscription: Stripe.Subscription =
      await stripe.subscriptions.retrieve(
        currentUsageData.stripe_subscription_id
      );

    const productId = subscription.items.data.at(0)?.plan.product;

    if (!productId || typeof productId !== "string") {
      return err("Error fetching product plan");
    }

    const product: Stripe.Product = await stripe.products.retrieve(
      productId as string
    );

    return ok(`
      "subscribed": "true",
      "subscription_name": ${product.name},
      "credits_used": ${currentUsageData.credits_used},
      "credits_charged": ${currentUsageData.credits_charged},
      "additional_credits": ${currentUsageData.additional_credits_charged}`);
  }
}
