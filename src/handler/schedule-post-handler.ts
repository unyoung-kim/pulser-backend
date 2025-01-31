import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth/result";
import { PostSchema } from "../lib/schema/post-schema.js";
import { schedulePost } from "../lib/articles/schedule-post.js";

export function schedulePostHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/schedule-post",
        summary: "Schedule post endpoint",
        description:
          "Schedules a post for the given keyword and company background",
        tags: ["Post"],
      },
    })
    .input(
      z.object({
        orgId: z.string().describe("Organization id"),
        scheduledTime: z.string().describe("Scheduled time for the post"),
        ...PostSchema.shape,
        emailId: z.string().describe("Email id"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const parsedScheduledTime = new Date(input.scheduledTime);
        const result: Result<string, string> = await schedulePost({
          ...input,
          scheduledTime: parsedScheduledTime,
        });
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
