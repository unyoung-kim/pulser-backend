import { ok, Result } from "true-myth/result";
import { SupabaseClient } from "@supabase/supabase-js";
import { err } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { sendEmail } from "../utility/send-email.js";
import { workflowV3 } from "./workflowV3/workflowV3.js";
import { topicGenerator } from "../agents/topic-generator.js";

export const processScheduledPost = async (
  scheduledContentId: string
): Promise<Result<string, string>> => {
  console.log("Processing scheduled post for content_id: ", scheduledContentId);

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    throw new Error(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { data: scheduledContent, error: scheduledContentError } =
    await supabase
      .from("ScheduledContent")
      .select("*")
      .eq("id", scheduledContentId)
      .single();

  try {
    if (scheduledContentError) {
      throw new Error(scheduledContentError.message);
    }

    const { data: organization, error: organizationError } = await supabase
      .from("Organization")
      .select("current_usage_id")
      .eq("org_id", scheduledContent.org_id)
      .single();

    if (organizationError) {
      throw new Error(organizationError.message);
    }

    const { data: currentUsage, error: currentUsageError } = await supabase
      .from("Usage")
      .select("credits_charged,additional_credits_charged,credits_used")
      .eq("id", organization.current_usage_id)
      .single();

    if (currentUsageError) {
      throw new Error(currentUsageError.message);
    }

    const remainingCredits =
      currentUsage.credits_charged -
      currentUsage.additional_credits_charged -
      currentUsage.credits_used;

    if (remainingCredits < 3) {
      console.log("Insufficient credits for content_id: ", scheduledContentId);

      const { error } = await supabase
        .from("ScheduledContent")
        .update({
          status: "FAILED_USAGE_LIMITED",
        })
        .eq("id", scheduledContentId);

      if (error) {
        throw new Error(error.message);
      }

      await sendEmail(
        scheduledContent.email_id,
        "Insufficient credits for Scheduled Post: " + scheduledContent.topic,
        "You have insufficient credits to generate a post. Please upgrade your plan."
      );

      return ok(`Insufficient credits for content_id: ${scheduledContentId}`);
    } else {
      let topic = scheduledContent.topic;

      if (!topic) {
        const { data: keyword, error: keywordError } = await supabase
          .from("Keyword")
          .select("name")
          .eq("id", scheduledContent.keyword_id)
          .single();

        if (keywordError) {
          throw new Error(keywordError.message);
        }

        const topicResult = await topicGenerator(
          keyword.name,
          scheduledContent.project_id
        );

        if (topicResult.isErr) {
          throw new Error(topicResult.error);
        }

        topic = topicResult.value;
      }

      const result = await workflowV3({
        projectId: scheduledContent.project_id,
        inputTopic: topic,
        keywordId: scheduledContent.keyword_id,
        instruction: scheduledContent.instruction,
      });

      if (result.isErr) {
        throw new Error(result.error);
      }

      console.log(
        `workflowV3 successful for scheduled post content_id : ${scheduledContentId}`
      );

      const { error } = await supabase
        .from("ScheduledContent")
        .update({
          status: "COMPLETED",
          content_id: result.value.contentId,
          topic: topic,
        })
        .eq("id", scheduledContentId);

      if (error) {
        throw new Error(error.message);
      }

      await sendEmail(
        scheduledContent.email_id,
        "Scheduled Post Generated Successfully: " + scheduledContent.topic,
        "Your scheduled post has been generated successfully."
      );
    }
  } catch (error) {
    console.error(
      `Error generating scheduled post for content_id: ${scheduledContentId}`,
      error
    );

    await sendEmail(
      scheduledContent.email_id,
      "Scheduled Post Generation Failed: " + scheduledContent.topic,
      "Your scheduled post generation failed. Please try again."
    );

    const { error: updateError } = await supabase
      .from("ScheduledContent")
      .update({
        status: "FAILED_ERROR",
      })
      .eq("id", scheduledContentId);

    if (updateError) {
      return err(
        `Scheduled post generation failed, error updating scheduled content status: ${updateError.message}`
      );
    }

    return err(`Scheduled post generation failed, error: ${String(error)}`);
  }
  return ok(
    `Scheduled post generated successfully for content_id: ${scheduledContentId}`
  );
};
