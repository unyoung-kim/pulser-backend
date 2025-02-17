import { filesToArticlesWorkflow } from "../lib/articles/files-to-articles-workflow.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { tRPC } from "../lib/trpc.js";
import { z } from "zod";

export function filesToArticlesHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/files-to-articles",
        summary: "Files to Articles API endpoint",
        description:
          "Processes files to articles messages and returns a response",
        tags: ["Post"],
      },
    })
    .input(
      z.object({
        projectId: z
          .string()
          .describe("Project id for which the article needs to be generated"),
        texts: z
          .array(z.string())
          .optional()
          .describe("Texts to be included in the blog post"),
        inputTopics: z
          .array(z.string())
          .optional()
          .describe("Input topics for the article"),
        instructions: z
          .array(z.string())
          .optional()
          .describe("Instructions for the article"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input, ctx }) => {
      const files: any = ctx.req?.files;
      try {
        filesToArticlesWorkflow(
          input.projectId,
          files,
          input.texts,
          input.inputTopics,
          input.instructions
        );
        return {
          success: true,
          data: "Files to articles generation started",
        };
      } catch (error) {
        console.error("Error in files to articles API:", error);
        return {
          success: false,
          error: "Internal server error",
        };
      }
    });
}
