import { Result } from "true-myth";
import { z } from "zod";
import { PostSchema } from "../schema/post-schema.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";

export const schedulePost = async (
  projectId: string,
  scheduledTime: Date,
  keywordId: string,
  topic: string,
  instruction: string
): Promise<Result<string, string>> => {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const { error: orgError } = await supabase.from("ScheduledContent").insert({
    project_id: projectId,
    scheduled_time: scheduledTime,
    keyword_id: keywordId,
    topic: topic,
    instruction: instruction,
  });

  if (orgError) {
    return err(
      `Error inserting new scheduled content record: ${orgError.message}`
    );
  }

  return ok("Scheduled content record inserted successfully");
};
