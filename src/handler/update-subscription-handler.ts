import { Result } from "true-myth";
import { z } from "zod";
import { ApiResponseSchema } from "../lib/schema/api-response-schema.js";
import {
  STRIPE_PRODUCT_LIST,
  StripeProduct,
} from "../lib/stripe/product-list.js";
import { updateSubscription } from "../lib/stripe/update-subscription.js";
import { tRPC } from "../lib/trpc.js";

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
        plan: z.enum(["BASIC", "PRO", "AGENCY"]),
        term: z.enum(["MONTHLY", "YEARLY"]),
        couponCode: z.string().optional().describe("Coupon code to apply"),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const result: Result<string, string> = await updateSubscription(
          input.orgId,
          input.plan,
          input.term,
          input.couponCode
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
