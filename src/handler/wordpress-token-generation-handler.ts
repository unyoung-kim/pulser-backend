import { z } from "zod";
import { Result } from "true-myth/result";
import { tRPC } from "../lib/trpc.js";
import { callWordpressAccessTokenGenerationURL } from "../lib/call-wordpress-access-token-generation-url.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";

// handle the callback from wordpress to get the access token
export function wordpressTokenGenerationHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/generate-wordpress-token",
        summary: "Generate WordPress access token",
        description:
          "Generates a WordPress access token using the provided code",
        tags: ["WordPress"],
      },
    })
    .input(
      z.object({
        code: z.string().describe("Code to be used for generating tokens"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      const code = input.code;

      if (typeof code !== "string") {
        return {
          success: false,
          error: "Missing or invalid parameter: code",
        };
      }

      try {
        const accessToken: Result<string, string> =
          await callWordpressAccessTokenGenerationURL(code);

        if (accessToken.isErr) {
          return {
            success: false,
            data: accessToken.error,
          };
        } else {
          return {
            success: true,
            data: accessToken.value,
          };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: "Authentication failed",
        };
      }
    });
}
