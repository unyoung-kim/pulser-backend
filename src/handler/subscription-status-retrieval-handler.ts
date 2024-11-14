import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import { getSubscriptionStatusFromStripe } from "../lib/getSubscriptionStatus.js";

export function subscriptionStatusRetrievalHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/get-subscription-status",
        summary: "Subscription status at Stripe endpoint",
        description: "Retreives the subscription status at Stripe",
        tags: ["Stripe"],
      },
    })
    .input(
      z.object({
        subscriptionId: z
          .string()
          .describe("Subscription id to query status for"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> =
          await getSubscriptionStatusFromStripe(input.subscriptionId);
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
