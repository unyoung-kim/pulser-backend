import { Result } from "true-myth/result";
import { z } from "zod";
import { glossaryWorkflow } from "../lib/articles/glossary.js";
import { workflow } from "../lib/articles/workflow.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { tRPC } from "../lib/trpc.js";

export function webRetrievalHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/web-retrieval",
        summary: "Web Retrieval API endpoint",
        description: "Processes web retrieval messages and returns a response",
        tags: ["Web Retrieval"],
      },
    })
    .input(
      z.object({
        projectId: z
          .string()
          .describe(
            "Id of the project or which blog post needs to be generated"
          ),
        inputTopic: z.string().describe("The blog topic"),
        keywordId: z
          .string()
          .describe("Keyword to be used to generate the blog post topic"),
        type: z
          .enum(["NORMAL", "GLOSSARY"])
          .describe("Type of the content to be generated"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> =
          input.type === "NORMAL"
            ? await workflow({
                projectId: input.projectId,
                inputTopic: input.inputTopic,
                keywordId: input.keywordId,
              })
            : await glossaryWorkflow({
                projectId: input.projectId,
                inputTopic: input.inputTopic,
                keywordId: input.keywordId,
              });

        if (result.isErr) {
          return {
            success: false,
            data: result.error,
          };
        }
        return {
          success: true,
          data: result.value,
        };
      } catch (error) {
        console.error("Error in web retrieval API:", error);
        return {
          success: false,
          error: "Internal server error",
        };
      }
    });
}
