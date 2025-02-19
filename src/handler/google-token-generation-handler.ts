import { z } from "zod";
import { Result } from "true-myth/result";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { generateGoogleAccessToken } from "../lib/google/generate-google-access-token.js";

// handle the callback from google to get the access token
export function googleTokenGenerationHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/google/callback",
        summary: "Handle the callback from Google and get access token",
        description:
          "Processes the callback from Google OAuth and retrieves the access token",
        tags: ["Google"],
      },
    })
    .input(
      z.object({
        projectId: z
          .string()
          .describe("Project id for which the tokens needs to be generated"),
        code: z.string().describe("Code to be used for generating tokens"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const accessToken: Result<string, string> =
          await generateGoogleAccessToken(input.projectId, input.code);

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
          error: "Authentication token generation failed",
        };
      }
    });
}
