import { z } from "zod";
import { Result } from "true-myth/result";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { getGoogleAuthUrl } from "../lib/google/get-google-auth-url.js";

// redirect to google for authentication
export function googleAuthHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/google/authorize",
        summary: "Get Google authentication URL",
        description: "Generates and returns a URL for Google authentication",
        tags: ["Google"],
      },
    })
    .input(z.void())
    .output(ApiResponseSchema)
    .query(() => {
      try {
        const redirectUrl: Result<string, string> = getGoogleAuthUrl();
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
          error: "Failed to generate google authentication URL",
        };
      }
    });
}
