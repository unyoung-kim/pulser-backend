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
        body: z.unknown().optional(), // Raw body does not have a strict schema
        headers: z
          .object({
            "stripe-signature": z.string().describe("Stripe signature header"),
          })
          .passthrough()
          .optional(),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ ctx }) => {
      try {
        const signature = ctx.req.headers["stripe-signature"];
        const rawBody = ctx.rawBody;

        const result = await handleWebhookEvents(signature, rawBody);

        if (result.isErr) {
          console.error(`Error processing webhook event: ${result.error}`);
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
        console.error(`Unexpected error in webhook handler: ${error}`);
        return {
          success: false,
          data: `Unexpected error: ${String(error)}`,
        };
      }
    });
}
