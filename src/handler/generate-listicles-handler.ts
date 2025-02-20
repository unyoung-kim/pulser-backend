import { Result } from "true-myth";
import { z } from "zod";
import { generateListicles } from "../lib/articles/listicles/listicle.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { tRPC } from "../lib/trpc.js";

export function generateListiclesHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/generate-listicles",
        summary: "Generate listicles",
        description: "Generate listicles",
        tags: ["Listicles"],
      },
    })
    .input(
      z.object({
        projectId: z.string(),
        inputTopics: z.array(z.string()),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> = await generateListicles({
          projectId: input.projectId,
          inputTopics: input.inputTopics,
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
