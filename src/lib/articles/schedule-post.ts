import { Result } from "true-myth";
import { z } from "zod";
import { PostSchema } from "../schema/post-schema.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";

export const schedulePost = async (
  input: z.infer<typeof PostSchema> & {
    orgId: string;
    scheduledTime: Date;
    emailId: string;
  }
): Promise<Result<string, string>> => {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const { data: orgData, error: orgError } = await supabase
    .from("ScheduledContent")
    .insert({
      org_id: input.orgId,
      scheduled_time: input.scheduledTime,
      project_id: input.projectId,
      input_topic: input.inputTopic,
      keyword_id: input.keywordId,
      type: input.type,
      length: input.length,
      secondary_keywords: input.secondaryKeywords,
      instruction: input.instruction,
      email_id: input.emailId,
    });

  if (orgError) {
    return err(
      `Error inserting new scheduled content record: ${orgError.message}`
    );
  }

  return ok("Scheduled content record inserted successfully");
};
