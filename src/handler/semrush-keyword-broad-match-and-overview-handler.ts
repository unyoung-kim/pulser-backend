import { Result } from "true-myth";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { semrushKeywordBroadMatchAndOverview } from "../lib/semrush/semrush-keyword-broad-match-and-overview.js";

export function semrushKeywordBroadMatchAndOverviewHandler(
  t: tRPC,
  endpoint: string
) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/semrush-keyword-broad-match-and-overview",
        summary: "Semrush Keyword Broad Match and Overview API endpoint",
        description:
          "Retrieves the semrush broad match keyword and overview for a given phrase",
        tags: ["Semrush", "Keyword"],
      },
    })
    .input(
      z.object({
        phrase: z
          .string()
          .describe(
            "The phrase for which the semrush keyword overview is being retrieved"
          ),
        database: z.string().describe("The database to use"),
        displayOffset: z.number().describe("The offset to use"),
        kdFilter: z.number().describe("The kd filter to use"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<
          {
            inputKeywordOverview: string;
            broadMatches: Record<string, string>[];
          },
          string
        > = await semrushKeywordBroadMatchAndOverview(
          input.phrase,
          input.database,
          input.displayOffset,
          input.kdFilter
        );
        if (result.isErr) {
          return {
            success: false,
            data: result.error,
          };
        }
        return {
          success: true,
          data: result.value,
        };
      } catch (error) {
        console.error(
          "Error in semrush keyword broad match and overview API:",
          error
        );
        return {
          success: false,
          error: "Internal server error",
        };
      }
    });
}
