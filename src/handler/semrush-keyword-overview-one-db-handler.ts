import { Result } from "true-myth";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { semrushKeywordOverviewOneDb } from "../lib/semrush/semrush-keyword-overview-one-db.js";

export function semrushKeywordOverviewOneDbHandler(t: tRPC, endpoint: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/semrush-keyword-overview-one-db",
        summary: "Semrush Keyword Overview One DB API endpoint",
        description:
          "Retrieves the semrush keyword overview for a given phrase",
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
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<
          Record<string, string>,
          string
        > = await semrushKeywordOverviewOneDb(input.phrase, input.database);
        if (result.isErr) {
          return {
            success: false,
            data: result.error,
          };
        }
        console.log(result.value);
        return {
          success: true,
          data: result.value,
        };
      } catch (error) {
        console.error("Error in semrush keyword overview one db API:", error);
        return {
          success: false,
          error: "Internal server error",
        };
      }
    });
}
