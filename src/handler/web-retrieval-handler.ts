import { z } from "zod";
import { Result } from "true-myth/result";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { workflow } from "../lib/workflow.js";

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
          projectId: z.string().describe('Id of the project or which blog post needs to be generated'),
          inputTopic: z.string().optional().describe('The blog topic'),
          keyword: z.string().optional().describe('Keyword to be used to generate the blog post topic'),
        })
      )
      .output(ApiResponseSchema)
      .mutation(async ({ input }) => {
        try {
          const result: Result<string,string> = await workflow(input);
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
