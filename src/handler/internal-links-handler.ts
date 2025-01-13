import { z } from "zod";
import { Result } from "true-myth/result";
import { tRPC } from "../lib/trpc.js";
import {
  EnrichedURL,
  throttledEnrichInternalLinks,
} from "../lib/internal-link/enrich-internal-links.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";

export function internalLinksHandler(t: tRPC, endpoint: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/internal-links-handler",
        summary: "Internal Links Description Retrieval API endpoint",
        description:
          "Crawl the domain of the project and get relevant internal links description",
        tags: ["Internal Links"],
      },
    })
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<EnrichedURL[], string> =
          await throttledEnrichInternalLinks(input.projectId);
        if (result.isErr) {
          console.error(`Error in enrich internal URLs: ${result.error}`);
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
        console.error("Error in internal links handler API:", error);
        return {
          success: false,
          error: "Internal server error",
        };
      }
    });
}
