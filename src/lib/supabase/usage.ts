import { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";

const NORMAL_CONTENT_CREDIT = 3;
const GLOSSARY_CONTENT_CREDIT = 1;
const LISTICLE_CONTENT_CREDIT = 3;
/**
 * Update the usage credit for an organization
 * @param supabase
 * @param orgId
 * @returns
 */
export async function incrementUsageCredit(
  supabase: SupabaseClient,
  orgId: string,
  postType: "NORMAL" | "GLOSSARY" | "LISTICLE"
): Promise<Result<string, string>> {
  // Get active_usage_id from Organization
  const { data: org, error: orgError } = await supabase
    .from("Organization")
    .select("current_usage_id")
    .eq("org_id", orgId)
    .single();

  if (orgError) {
    return err(`Error fetching org details: ${orgError.message}`);
  }

  // Determine credit amount based on post type
  const creditAmount =
    postType === "NORMAL"
      ? NORMAL_CONTENT_CREDIT
      : postType === "GLOSSARY"
      ? GLOSSARY_CONTENT_CREDIT
      : LISTICLE_CONTENT_CREDIT;

  // First, get the current usage data
  const { data: currentUsage, error: usageError } = await supabase
    .from("Usage")
    .select("*")
    .eq("id", org.current_usage_id)
    .single();

  if (usageError) {
    return err(`Error fetching usage data: ${usageError.message}`);
  }

  console.log("Current Usage: ", currentUsage);

  const { data: usage, error } = await supabase
    .from("Usage")
    .update({
      credits_used: currentUsage.credits_used + creditAmount,
    })
    .eq("id", org.current_usage_id)
    .select();

  if (error) {
    return err(`Error updating usage: ${error.message}`);
  }

  return ok("Usage updated successfully");
}
