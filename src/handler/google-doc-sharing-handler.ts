import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { shareGoogleDoc } from "../lib/google/share-google-document.js";

export function googleDocSharingHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/share-google-doc",
        summary: "Google doc sharing endpoint",
        description: "Share google doc to the provided email id",
        tags: ["Google"],
      },
    })
    .input(
      z.object({
        documentId: z
          .string()
          .describe("Document id of the google doc to be shared"),
        email: z.string().describe("Email id to receive the google doc"),
        projectId: z
          .string()
          .describe("Projet id of which the google doc needs to be shared"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await shareGoogleDoc(
          input.documentId,
          input.email,
          input.projectId
        );
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
