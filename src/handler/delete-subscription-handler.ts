import { z } from "zod";
import { t, tRPC } from "../lib/trpc.js";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import { Result } from "true-myth";
import { deleteSubscription } from "../lib/stripe/delete-subscription.js";

export function deleteSubscriptionHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/delete-subscription",
        summary: "Subscription delete endpoint",
        description: "Delete a subscription",
        tags: ["Stripe"],
      },
    })
    .input(
      z.object({
        orgId: z.string(),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> = await deleteSubscription(
          input.orgId
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
