import { ok, Result } from "true-myth/result";
import { SupabaseClient } from "@supabase/supabase-js";
import { err } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";

export const immediateProcessScheduledPost = async (
  scheduledContentId: string
): Promise<Result<string, string>> => {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { error: scheduledContentError } = await supabase.rpc(
    "immediate_process_scheduled_post",
    {
      content_id: scheduledContentId,
    }
  );

  if (scheduledContentError) {
    return err(scheduledContentError.message);
  }

  return ok("Scheduled post generated successfully");
};
