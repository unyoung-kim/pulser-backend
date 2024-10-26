import { z } from "zod";
import { Result } from "true-myth/result";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { workflow, WorkflowResult } from "../lib/workflow.js";

export function webRetrievalHandler(t: tRPC, path: string) {
  return (
    t.procedure
      .meta({
        openapi: {
          method: "POST",
          path: "/web-retrieval",
          summary: "Web Retrieval API endpoint",
          description: "Processes web retrieval messages and returns a response",
          tags: ['Web Retrieval'],
        },
      })
      .input(
        z.object({
          query: z.string().describe('The query to search for')
        })
      )
      .output(ApiResponseSchema)
      .mutation(async ({ input }) => {
        try {
          const result: Result<WorkflowResult,string> = await workflow(input.query);
          if(result.isErr){
            return {
              success: false,
              data: result.error
            };
          }
          return {
            success: true,
            data: result.value
          };
        } catch (error) {
          console.error('Error in web retrieval API:', error);
          return {
            success: false,
            error: 'Internal server error'
          };
        }
      })
  );
}
