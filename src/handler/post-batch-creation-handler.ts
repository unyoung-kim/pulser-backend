import { glossaryWorkflow } from "../lib/articles/glossary.js";
import { workflowV3 } from "../lib/articles/workflowV3/workflowV3.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { tRPC } from "../lib/trpc.js";
import { z } from "zod";
import { sendEmail } from "../lib/utility/send-email.js";

export function postBatchCreationHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/post-batch-creation",
        summary: "Post Batch Creation API endpoint",
        description:
          "Processes post batch creation messages and returns a response",
        tags: ["Post"],
      },
    })
    .input(
      z.object({
        projectId: z.string(),
        type: z.enum(["NORMAL", "GLOSSARY"]),
        arguments: z.object({
          inputTopics: z.array(z.string()),
          keywordIds: z.array(z.string()),
          lengths: z.array(z.enum(["LONG", "SHORT"])),
          secondaryKeywords: z.array(z.array(z.string())).optional(),
          instructions: z.array(z.string()).optional(),
        }),
        email: z.string(),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        (async () => {
          console.log("TYPE: ", input.type);
          input.type === "NORMAL"
            ? await Promise.all(
                input.arguments.inputTopics.map(async (inputTopic, index) => {
                  return await workflowV3({
                    projectId: input.projectId,
                    inputTopic: inputTopic,
                    keywordId: input.arguments.keywordIds[index],
                    instruction: input.arguments.instructions?.[index],
                    secondaryKeywords:
                      input.arguments.secondaryKeywords?.[index],
                    length: input.arguments.lengths[index],
                  });
                })
              )
            : await Promise.all(
                input.arguments.inputTopics.map(async (inputTopic, index) => {
                  return await glossaryWorkflow({
                    projectId: input.projectId,
                    inputTopic: inputTopic,
                    keywordId: input.arguments.keywordIds[index],
                  });
                })
              );
          await sendEmail(
            input.email,
            "Batch post creation completed",
            "Hi, your batch post creation is completed. Thanks and Regards, Pulser AI"
          );
        })();
        return {
          success: true,
          data: "Posts creation batched",
        };
      } catch (error) {
        console.error("Error in post batch creation API:", error);
        return {
          success: false,
          error: "Internal server error",
        };
      }
    });
}
