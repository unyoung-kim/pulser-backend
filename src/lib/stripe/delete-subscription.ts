import { SupabaseClient } from "@supabase/supabase-js";
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

  const { data: currentUsageIdData, error: currentUsageIdIdError } =
    await supabase
      .from("Organization")
      .select("current_usage_id")
      .eq("org_id", orgId)
      .single();

  if (currentUsageIdIdError) {
    return err("Error in fetching stripe customer id");
  }

  if (!currentUsageIdData?.current_usage_id) {
    return err("Current usage id not found");
  }

  const { data: stripeSubscriptionIdData, error: stripeSubscriptionIdError } =
    await supabase
      .from("Usage")
      .select("stripe_subscription_id")
      .eq("id", currentUsageIdData.current_usage_id)
      .single();

  const subscriptionId = stripeSubscriptionIdData?.stripe_subscription_id;

  if (stripeSubscriptionIdError || !subscriptionId) {
    return err("Error retrieving active subscription");
  }

  const stripeClientResult = getStripeClient();
  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }
  const stripe = stripeClientResult.value;

  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true, // Mark subscription for cancellation at the end of the period
  });

  const { error: updateUsageError } = await supabase
    .from("Usage")
    .update({ is_cancelled: true, updated_at: new Date().toISOString() })
    .eq("id", currentUsageIdData.current_usage_id);

  if (updateUsageError) {
    return err("Error marking current usage as cancelled");
  }

  return ok("Subscription successfully deleted");
};
