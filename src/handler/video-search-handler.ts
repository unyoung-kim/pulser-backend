import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { serperVideoSearch } from "../lib/tools/outline-enricher/video-search.js";
import { serpVideoSearch } from "../lib/serpVideoSearch.js";

export function videoSearchHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/video-search",
        summary: "Video search API endpoint",
        description: "Retrieves video search results ",
        tags: ["Video search"],
      },
    })
    .input(
      z.object({
        query: z
          .string()
          .describe("Query for which related videos need to be searched"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        // const result = await serperVideoSearch(input.query);
        const result = await serpVideoSearch(input.query);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    });
}
