import { z } from "zod";
import { tRPC } from "../lib/trpc";
import { getWordpressAuthUrl } from "../lib/get-wordpress-auth-url";
import { ApiResponseSchema } from "../lib/api-response-schema";

// redirect to wordpress for authentication
export function wordpressAuthHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/wordpress/authorize",
        summary: "Get WordPress authentication URL",
      },
    })
    .input(z.void())
    .output(ApiResponseSchema)
    .query(async () => {
      try {
        const redirectUrl = await getWordpressAuthUrl();
        return {
          success: true,
          data: { redirectUrl },
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: 'Failed to generate authentication URL',
        };
      }
    });
}
