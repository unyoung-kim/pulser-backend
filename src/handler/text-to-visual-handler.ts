import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import pRetry from "p-retry";
import { convertTextToVisual } from "../lib/text-to-visual/convert-text-to-visual.js";

const retryOptions = {
  retries: 3, // Number of retries
  factor: 2, // Exponential backoff factor
  minTimeout: 1000, // Minimum timeout between retries
  maxTimeout: 5000, // Maximum timeout between retries
};

export function textToVisualHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/text-to-visual",
        summary: "Text to image converter endpoint",
        description: "Converts text to images",
        tags: ["Image"],
      },
    })
    .input(
      z.object({
        text: z.string().describe("Text for which image needs to be generated"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: string[] = await pRetry(async () => {
          const res: Result<string[], string> = await convertTextToVisual(
            input.text
          );
          if (res.isErr) {
            throw new Error(res.error);
          }
          return res.value;
        }, retryOptions);

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
