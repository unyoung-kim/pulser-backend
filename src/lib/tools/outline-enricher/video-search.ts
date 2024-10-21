import { tool } from "ai";
import { multiSearchSchema, searchSchema } from "../../schema/search.js";

export const multiVideoSearchTool = () =>
  tool({
    description: "Search videos for multiple queries on youtube",
    parameters: multiSearchSchema,
    execute: async ({ queries }: { queries: string[] }) => {
      await Promise.all(
        queries.map(async (query) => {
          const response = await serperVideoSearch(query);
          return response;
        })
      );
    },
  });
export const videoSearchTool = () =>
  tool({
    description: "Search for videos from YouTube",
    parameters: searchSchema,
    execute: async ({ query }: { query: string }) => serperVideoSearch(query),
  });

// Standalone function to perform an video search
export const serperVideoSearch = async (query: string) => {
  try {
    const response = await fetch("https://google.serper.dev/videos", {
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
    console.error("Video Search API error:", error);
  }
};
