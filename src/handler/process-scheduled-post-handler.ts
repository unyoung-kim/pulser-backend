import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { processScheduledPost } from "../lib/articles/process-scheduled-post.js";

export function processScheduledPostHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/process-scheduled-post",
        summary: "Process scheduled post endpoint",
        description: "Processes the scheduled post",
        tags: ["Post"],
      },
    })
    .input(
      z.object({
        scheduledContentId: z.string().describe("Scheduled content id"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(({ input }) => {
      try {
        processScheduledPost(input.scheduledContentId);
        return {
          success: true,
          data: "Scheduled post processing started",
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    });
}
