import Result, { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { SupabaseClient } from "@supabase/supabase-js";

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
    return err("Error in fetching current usage id");
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
  return ok(`
      "plan": ${currentUsageData.plan},
      "term": ${currentUsageData.term},
      "credits_used": ${currentUsageData.credits_used},
      "credits_charged": ${currentUsageData.credits_charged},
      "additional_credits": ${currentUsageData.additional_credits_charged},
      "start_date": ${currentUsageData.start_date},
      "end_date": ${currentUsageData.end_date}`);
}
