import { tool } from "ai";
import { multiSearchSchema, searchSchema } from "../../schema/search.js";

export const multiImageSearchTool = () =>
  tool({
    description: "Search for images for multiple queries on google",
    parameters: multiSearchSchema,
    execute: async ({ queries }: { queries: string[] }) => {
      await Promise.all(
        queries.map(async (query) => {
          const response = await serperImageSearch(query);
          return response;
        })
      );
    },
  });

export const imageSearchTool = () =>
  tool({
    description: "Search for images on google",
    parameters: searchSchema,
    execute: async ({ query }: { query: string }) => serperImageSearch(query),
  });

// Standalone function to perform an image search
export const serperImageSearch = async (query: string) => {
  try {
    const response = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Image Search API error:", error);
  }
};
