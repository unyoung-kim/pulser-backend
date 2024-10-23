import { tool } from "ai";
import { z } from "zod";
import { serperImageSearch } from "./image-search.js";
import { serperVideoSearch } from "./video-search.js";

export const multiMediaSearchSchema = z.object({
  imageQueries: z.array(z.string()).describe("Queries to search for images"),
  videoQueries: z.array(z.string()).describe("Queries to search for videos"),
});

export const multiMediaSearchTool = () =>
  tool({
    description:
      "Search for multiple videos on youtube and multiple images on google for each query",
    parameters: multiMediaSearchSchema,
    execute: async ({
      imageQueries,
      videoQueries,
    }: {
      imageQueries: string[];
      videoQueries: string[];
    }) => {
      const images = await Promise.all(
        imageQueries.map(async (query) => {
          const response = await serperImageSearch(query);
          return response;
        })
      );

      const videos = await Promise.all(
        videoQueries.map(async (query) => {
          const response = await serperVideoSearch(query);
          return response;
        })
      );

      return {
        images,
        videos,
      };
    },
  });
