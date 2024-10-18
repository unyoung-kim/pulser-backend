import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { getWordpressAuthUrl } from "../lib/get-wordpress-auth-url.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";

// redirect to wordpress for authentication
export function wordpressAuthHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/wordpress/authorize",
        summary: "Get WordPress authentication URL",
        description: "Generates and returns a URL for WordPress authentication",
        tags: ['WordPress'],
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

