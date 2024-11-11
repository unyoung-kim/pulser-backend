import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { serpImageSearch } from "../lib/tools/researcher/image-search-tool.js";

export function imageSearchHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/image-search",
        summary: "Image search API endpoint",
        description: "Retrieves image search results",
        tags: ["Image search"],
      },
    })
    .input(
      z.object({
        query: z
          .string()
          .describe("Query for which related images need to be searched"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await serpImageSearch(input.query);
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
