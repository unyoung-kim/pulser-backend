import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import { convertDocxAndUpload } from "../lib/google/convert-docx-and-upload.js";

export function uploadDocxHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/upload-docx",
        summary: "Upload a .docx file and convert it to a Google Doc",
        description: "Accepts a .docx file and uploads it as a Google Doc",
        tags: ["Document"],
      },
    })
    .input(
      z.object({
        filename: z.string().describe("The name of the Google Doc to create"),
        projectId: z
          .string()
          .describe("Project id for which the google doc needs to be created"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input, ctx }) => {
      // Retrieve the uploaded file from the context (from Multer)
      const file = ctx.req?.file;
      if (!file) {
        return {
          success: false,
          error: "No file uploaded.",
        };
      }

      try {
        const result: Result<string, string> = await convertDocxAndUpload(
          file,
          input.filename,
          input.projectId
        );

        if (result.isErr) {
          return {
            success: false,
            error: result.error,
          };
        }

        return {
          success: true,
          data: {
            fileId: result.value,
            message: "File uploaded and converted to Google Doc successfully.",
          },
        };
      } catch (error) {
        return {
          success: false,
          error: `Unexpected error in upload docx handler: ${String(error)}`,
        };
      }
    });
}
