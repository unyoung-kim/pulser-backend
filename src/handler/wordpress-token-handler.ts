import { z } from "zod";
import { tRPC } from "../lib/trpc";
import { callWordpressAccessToken } from "../lib/call-wordpress-access-token";
import { ApiResponseSchema } from "../lib/api-response-schema";

// handle the callback from wordpress to get the access token
export function wordpressTokenHandler(t: tRPC, path: string) {
    return t.procedure
      .meta({
        openapi: {
          method: "GET",
          path: "/auth/wordpress/callback",
          summary: "Handle the callback from WordPress and get access token",
          description: "Processes the callback from WordPress OAuth and retrieves the access token",
          tags: ['WordPress'],
        },
      })
      .input(z.void())
      .output(ApiResponseSchema)
      .query(async ({ ctx }) => {
        const code = ctx.req.query.code as string;
  
        if (typeof code !== 'string') {
          return {
            success: false,
            error: "Missing or invalid parameter: code",
          };
        }
  
        try {
          const accessToken = await callWordpressAccessToken(code);
          return {
            success: true,
            data: { accessToken },
          };
        } catch (error) {
          console.error(error);
          return {
            success: false,
            error: 'Authentication failed',
          };
        }
      });
  }
