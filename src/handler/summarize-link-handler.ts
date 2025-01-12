import { z } from "zod";
import { Result } from "true-myth/result";
import { tRPC } from "../lib/trpc.js";
import { throttledSummarizeLink } from "../lib/internal-link/summarize-link.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { EnrichedURL } from "../lib/internal-link/enrich-internal-links.js";

export function summarizeLinkHandler(t: tRPC, endpoint: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/summarize-link",
        summary: "Link Summary Retrieval API endpoint",
        description: "Summarize the web content of the link",
        tags: ["Internal Links"],
      },
    })
    .input(
      z.object({
        projectId: z
          .string()
          .describe(
            "The project id for which the link needs to be summarized and saved"
          ),
        url: z.string().describe("The url to summarize"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<EnrichedURL, string> =
          await throttledSummarizeLink(input.projectId, input.url);
        if (result.isErr) {
          console.error(`Error in summarize link: ${result.error}`);
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
        console.error("Error in summarize link API:", error);
        return {
          success: false,
          error: "Internal server error",
        };
      }
    });
}
