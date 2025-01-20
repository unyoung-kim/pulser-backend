import { ok, err } from "true-myth/result";
import { SupabaseClient } from "@supabase/supabase-js";

export const handleSubscriptionRenewal = async (
  current_usage_id: string,
  subscriptionId: string,
  startDate: Date,
  endDate: Date,
  orgId: string,
  supabase: SupabaseClient
) => {
  if (!current_usage_id) {
    return err("Error fetching current usage id");
  }

  const { data: currentSubscriptionData, error: currentSubscriptionError } =
    await supabase
      .from("Usage")
      .select("credits_charged,plan,term,coupon_code")
      .eq("id", current_usage_id)
      .single();

  if (currentSubscriptionError || !currentSubscriptionData) {
    return err("Error fetching current credits charged");
  }

  const { data: newUsageInsertData, error: newUsageInsertError } =
    await supabase
      .from("Usage")
      .insert({
        stripe_subscription_id: subscriptionId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        credits_charged: currentSubscriptionData.credits_charged,
        org_id: orgId,
        plan: currentSubscriptionData.plan,
        term: currentSubscriptionData.term,
        coupon_code: currentSubscriptionData.coupon_code,
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
