import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { createStripeSession } from "../lib/stripe/create-stripe-session.js";
import { Result } from "true-myth";

export function stripeSessionCreationHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/create-stripe-session",
        summary: "Stripe session creation endpoint",
        description: "Creates Stripe session",
        tags: ["Stripe"],
      },
    })
    .input(
      z.object({
        orgId: z
          .string()
          .describe(
            "Organisation for which the Stripe checkout session needs to be created"
          ),
        priceId: z.string().describe("Price id of the plan"),
        credits: z.number().describe("Number of credits for this plan"),
        mode: z.enum(["subscription", "payment"]),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> = await createStripeSession(
          input.orgId,
          input.priceId,
          input.credits,
          input.mode
        );
        if (result.isErr) {
          return {
            success: false,
            error: result.error,
          };
        }
        return {
          success: true,
          data: result.value,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    });
}
