import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { createGoogleDoc } from "../lib/google/create-google-doc.js";

export function googleDocCreationHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/create-google-doc",
        summary: "Google doc creation endpoint",
        description: "Generates google doc with the provided content",
        tags: ["Google"],
      },
    })
    .input(
      z.object({
        filename: z.string().describe("Name of the file to be created"),
        content: z.string().describe("Content of the file"),
        projectId: z
          .string()
          .describe("Projet id for which the google doc needs to be generated"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await createGoogleDoc(
          input.filename,
          input.content,
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
