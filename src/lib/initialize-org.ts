import { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "true-myth";
import { getSupabaseClient } from "./get-supabase-client.js";

export const initializeOrg = async (orgId: string) => {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    console.log("Error in getting supabase client", supabaseClient.error);
    return;
  }

  const supabase = supabaseClient.value;

  // Add organization to Supabase
  const { data: organization, error: orgError } = await supabase
    .from("Organization")
    .upsert({
      org_id: orgId,
      created_at: new Date().toISOString(),
    })
    .select();

  if (orgError) {
    console.log(`Failed to create organization: ${orgError.message}`);
    return;
  }

  // Create a new usage row
  const { data: usage, error: usageError } = await supabase
    .from("Usage")
    .insert({
      org_id: orgId,
      start_date: new Date().toISOString().split("T")[0],
      credits_used: 0,
      credits_charged: 10, // 10 credits for free trial
      additional_credits_charged: 0,
      plan: "FREE_CREDIT",
    })
    .select()
    .single();

  if (usageError) {
    console.log(`Failed to create usage: ${usageError.message}`);
    return;
  }

  // Update organization with the new usage ID
  const { error: updateError } = await supabase
    .from("Organization")
    .update({ current_usage_id: usage.id })
    .eq("org_id", orgId);

  if (updateError) {
    console.log(
      `Failed to update organization with usage: ${updateError.message}`
    );
    return;
  }

  console.log("Organization initialized successfully");
};
