import { z } from "zod";
import { tool } from "ai";
import { getJson } from "serpapi";

export const imageSearchTool = () =>
  tool({
    description: "Search for images on google",
    parameters: z.object({
      query: z
        .string()
        .describe("The query for which the related images need to be searched"),
    }),
    execute: async ({ query }: { query: string }) => {
      const apikey = process.env.SERP_API_KEY;
      if (!apikey) {
        throw new Error("Serp API key is not set in the environment variables");
      }
      const result = await getJson({
        engine: "google_images",
        q: query,
        tbs: "sur:cl",
        api_key: apikey,
      });
      if (!result || !result["images_results"]) {
        throw new Error("Serp API didn't return images");
      }
      console.log(result["images_results"]);
      return result["images_results"];
    },
  });
