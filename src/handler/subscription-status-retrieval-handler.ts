import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import { getSubscriptionStatusFromStripe } from "../lib/stripe/get-subscription-status.js";

export function subscriptionStatusRetrievalHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/get-subscription-status",
        summary: "Subscription status endpoint",
        description: "Retreives the subscription status for an Organization",
        tags: ["Stripe"],
      },
    })
    .input(
      z.object({
        orgId: z.string().describe("Organization id to query status for"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> =
          await getSubscriptionStatusFromStripe(input.orgId);
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
