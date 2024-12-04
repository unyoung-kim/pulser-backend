import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import { convertTextToImage } from "../lib/text-to-image/convert-text-to-image.js";

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
        const result: Result<string, string> = await convertTextToImage(
          input.text
        );
        if (result.isErr) {
          return {
            success: false,
            error: result.error,
          };
        }
        return {
          success: true,
          data: result.value,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    });
}
