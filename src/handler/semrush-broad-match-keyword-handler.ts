import { Result } from "true-myth";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { semrushBroadMatchKeyword } from "../lib/semrush/semrush-broad-match-keyword.js";

export function semrushBroadMatchKeywordHandler(t: tRPC, endpoint: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/semrush-broad-match-keyword",
        summary: "Semrush Broad Match Keyword API endpoint",
        description:
          "Retrieves the semrush broad match keyword for a given phrase",
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
        intentFilter: z
          .enum([
            "Commercial",
            "Informational",
            "Navigational",
            "Transactional",
          ])
          .describe("The intent filter to use"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<Record<string, string>[], string> =
          await semrushBroadMatchKeyword(
            input.phrase,
            input.database,
            input.displayOffset,
            input.kdFilter,
            input.intentFilter
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
        console.error("Error in semrush broad match keyword API:", error);
        return {
          success: false,
          error: "Internal server error",
        };
      }
    });
}
