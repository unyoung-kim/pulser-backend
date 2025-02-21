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
      // Start the generation process in the background
      generateListicles({
        projectId: input.projectId,
        inputTopics: input.inputTopics,
      })
        .then((result) => {
          // Handle the result in the background
          console.log(
            "Listicle generation completed:",
            result.isOk ? "success" : "error"
          );
        })
        .catch((error) => {
          console.error("Listicle generation failed:", error);
        });

      // Return immediately to the client
      return {
        success: true,
        data: "Generation started",
      };
    });
}
