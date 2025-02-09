import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth/result";
import { immediateProcessScheduledPost } from "../lib/articles/immediate-process-scheduled-post.js";

export function immediateProcessScheduledPostHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/immediate-process-scheduled-post",
        summary: "Immediate process scheduled post endpoint",
        description: "Processes the scheduled post immediately",
        tags: ["Post"],
      },
    })
    .input(
      z.object({
        scheduledContentId: z.string().describe("Scheduled content id"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> =
          await immediateProcessScheduledPost(input.scheduledContentId);
        if (result.isErr) {
          return {
            success: false,
            error: result.error,
          };
        }
        return {
          success: true,
          data: result.value,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    });
}
