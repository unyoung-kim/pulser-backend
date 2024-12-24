import { Result } from "true-myth";
import { z } from "zod";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { createStripeSession } from "../lib/stripe/create-stripe-session.js";
import { tRPC } from "../lib/trpc.js";

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
        plan: z.enum(["SOLO", "BUSINESS", "AGENCY"]),
        term: z.enum(["MONTHLY", "YEARLY"]),
        // priceId: z.string().describe("Price id of the plan"),
        // credits: z.number().describe("Number of credits for this plan"),
        mode: z.enum(["subscription", "payment"]).default("subscription"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> = await createStripeSession(
          input.orgId,
          input.plan,
          input.term,
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
