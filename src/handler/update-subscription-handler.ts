import { z } from "zod";
import { t, tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import { err } from "true-myth/result";
import { updateSubscription } from "../lib/stripe/update-subscription.js";

export function updateSubscriptionHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/update-subscription",
        summary: "Subscription update endpoint",
        description: "Update a subscription",
        tags: ["Stripe"],
      },
    })
    .input(
      z.object({
        orgId: z.string(),
        priceId: z.string(),
        credits: z.string(),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> = await updateSubscription(
          input.orgId,
          input.priceId,
          input.credits
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
