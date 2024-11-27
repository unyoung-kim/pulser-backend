import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { topicGenerator } from "../lib/agents/topic-generator.js";
import { Result } from "true-myth/result";

export function topicGenerationHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/generate-topic",
        summary: "Topic generation endpoint",
        description:
          "Generates 5 topic for the given keyword and compay background",
        tags: ["Topic Generation"],
      },
    })
    .input(
      z.object({
        keyword: z
          .string()
          .describe("Keyword for which topics needs to be generated"),
        projectId: z
          .string()
          .describe("Project id to fetch the company background"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> = await topicGenerator(
          input.keyword,
          input.projectId
        );
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
