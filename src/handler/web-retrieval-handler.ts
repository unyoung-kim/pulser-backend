import { Result } from "true-myth/result";
import { glossaryWorkflow } from "../lib/articles/glossary.js";
import { workflowV3 } from "../lib/articles/workflowV3/workflowV3.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { WebRetrievalSchema } from "../lib/schema/web-retrieval-schema.js";
import { tRPC } from "../lib/trpc.js";

export function webRetrievalHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/web-retrieval",
        summary: "Web Retrieval API endpoint",
        description: "Processes web retrieval messages and returns a response",
        tags: ["Post"],
      },
    })
    .input(WebRetrievalSchema)
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        console.log("TYPE: ", input.type);
        const result: Result<string, string> =
          input.type === "NORMAL"
            ? await workflowV3({
                projectId: input.projectId,
                inputTopic: input.inputTopic,
                keywordId: input.keywordId,
                secondaryKeywords: input.secondaryKeywords,
                instruction: input.instruction,
                length: input.length,
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
