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
        // Fire and forget the listicle generation
        generateListicles({
          projectId: input.projectId,
          inputTopics: input.inputTopics,
        }).catch((error) => {
          console.error("Background listicle generation failed:", error);
        });

        return {
          success: true,
          data: "Listicle generation started",
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    });
}
