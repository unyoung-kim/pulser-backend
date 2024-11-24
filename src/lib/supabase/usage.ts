import { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";

/**
 * Update the usage credit for an organization
 * @param supabase
 * @param orgId
 * @returns
 */
export async function incrementUsageCredit(
  supabase: SupabaseClient,
  orgId: string
): Promise<Result<string, string>> {
  // Get active_usage_id from Organization
  const { data: org, error: orgError } = await supabase
    .from("Organization")
    .select("current_usage_id")
    .eq("id", orgId)
    .single();

  if (orgError) {
    return err(`Error fetching org details: ${orgError.message}`);
  }

  // Update the Usage record
  const { error } = await supabase
    .from("Usage")
    .update({ credits_used: supabase.rpc("increment") })
    .eq("id", org.current_usage_id)
    .select();

  if (error) {
    return err(`Error updating usage: ${error.message}`);
  }

  return ok("Usage updated successfully");
}
