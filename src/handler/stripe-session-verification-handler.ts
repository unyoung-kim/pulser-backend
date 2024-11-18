import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import { verifyStripeCheckoutSession } from "../lib/stripe/verify-stripe-checkout-session.js";

export function stripeSessionVerificationHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/verify-checkout-session",
        summary: "Stripe checkout session verification endpoint",
        description: "Checks if the checkout was successful",
        tags: ["Stripe"],
      },
    })
    .input(
      z.object({
        sessionId: z
          .string()
          .describe("Session id for which verification needs to be done"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> =
          await verifyStripeCheckoutSession(input.sessionId);
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
