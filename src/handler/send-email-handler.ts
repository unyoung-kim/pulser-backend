import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { sendEmail } from "../lib/utility/send-email.js";

export function sendEmailHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/send-email",
        summary: "Send email endpoint",
        description: "Sends an email to the given email id",
        tags: ["Email"],
      },
    })
    .input(
      z.object({
        emailId: z.string().describe("Email id"),
        subject: z.string().describe("Subject"),
        htmlBody: z.string().describe("HTML body"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        await sendEmail(input.emailId, input.subject, input.htmlBody);
        return {
          success: true,
          data: "Email sent successfully",
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    });
}
