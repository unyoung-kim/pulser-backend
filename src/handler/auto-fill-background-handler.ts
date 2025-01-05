import { Result } from "true-myth";
import { z } from "zod";
import { autoFillBackground } from "../lib/background/autofill-background.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { tRPC } from "../lib/trpc.js";

export function autoFillBackgroundHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/autofill-background",
        summary: "Autofill knowledgebase from a domain",
        description: "",
        // tags: ["Knowledgebase"],
      },
    })
    .input(
      z.object({
        projectId: z.string(),
        companyUrl: z.string().url(),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> = await autoFillBackground(
          input.projectId,
          input.companyUrl
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
