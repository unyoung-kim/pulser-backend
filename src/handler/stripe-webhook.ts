import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import { handleWebhookEvents } from "../lib/stripe/handleWebhookEvents.js";

export function stripeWebhook(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/webhook",
        summary: "Stripe webhook endpoint",
        description: "Handles Stripe webhook events",
        tags: ["Stripe"],
      },
    })
    .input(
      z.object({
        body: z.string().describe("Raw body of the webhook event"),
        headers: z.object({
          "stripe-signature": z.string().describe("Stripe signature header"),
        }),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const signature = input.headers["stripe-signature"];
        const result: Result<string, string> = await handleWebhookEvents(
          signature,
          input.body
        );
        if (result.isErr) {
          return {
            success: true,
            data: result.error,
          };
        }
        return {
          success: true,
          data: result.value,
        };
      } catch (error) {
        return {
          success: false,
          data: String(error),
        };
      }
    });
}
