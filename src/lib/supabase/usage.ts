import { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";

const NORMAL_CONTENT_CREDIT = 3;
const GLOSSARY_CONTENT_CREDIT = 1;

/**
 * Update the usage credit for an organization
 * @param supabase
 * @param orgId
 * @returns
 */
export async function incrementUsageCredit(
  supabase: SupabaseClient,
  orgId: string,
  postType: "NORMAL" | "GLOSSARY"
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
    postType === "NORMAL" ? NORMAL_CONTENT_CREDIT : GLOSSARY_CONTENT_CREDIT;

  // Update the Usage record with specific increment amount
  const { data: usage, error } = await supabase
    .from("Usage")
    .update({
      credits_used: supabase.rpc("increment", {
        increment_amount: creditAmount,
      }),
    })
    .eq("id", org.current_usage_id)
    .select();

  console.log("Usage: ", usage);

  if (error) {
    return err(`Error updating usage: ${error.message}`);
  }

  return ok("Usage updated successfully");
}
