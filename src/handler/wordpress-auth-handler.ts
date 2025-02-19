import { z } from "zod";
import { Result } from "true-myth/result";
import { tRPC } from "../lib/trpc.js";
import { getWordpressAuthUrl } from "../lib/get-wordpress-auth-url.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";

// redirect to wordpress for authentication
export function wordpressAuthHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/wordpress-auth-url",
        summary: "Get WordPress authentication URL",
        description: "Generates and returns a URL for WordPress authentication",
        tags: ["WordPress"],
      },
    })
    .input(z.void())
    .output(ApiResponseSchema)
    .query(() => {
      try {
        const redirectUrl: Result<string, string> = getWordpressAuthUrl();
        if (redirectUrl.isErr) {
          return {
            success: false,
            data: redirectUrl.error,
          };
        }
        return {
          success: true,
          data: redirectUrl.value,
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: "Failed to generate wordpress authentication URL",
        };
      }
    });
}
