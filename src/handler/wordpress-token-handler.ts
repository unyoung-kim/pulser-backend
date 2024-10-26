import { z } from "zod";
import { err, ok, Result } from 'true-myth/result';
import { tRPC } from "../lib/trpc.js";
import { callWordpressAccessToken } from "../lib/call-wordpress-access-token.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";

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
          const accessToken: Result<string, string> = await callWordpressAccessToken(code);

          if(accessToken.isErr){
            return {
              success: false,
              data: accessToken.error,
            };
          }
          else{
            return {
              success: true,
              data: accessToken.value,
            };
          }
        } catch (error) {
          console.error(error);
          return {
            success: false,
            error: 'Authentication failed',
          };
        }
      });
  }
