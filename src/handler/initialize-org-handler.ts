import { z } from "zod";
import { tRPC } from "../lib/trpc.js";
import { initializeOrg } from "../lib/initialize-org.js";

/**
 * Check out https://clerk.com/docs/integrations/webhooks/overview
 *
 * Clerk's webhook will be triggered when new user signs up.
 * @param t
 * @param path
 * @returns
 */
export function initializeOrgHandler(t: tRPC, path: string) {
  return t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/initialize-org",
        summary: "Webhook for Clerk to initialize organization",
        description:
          "This webhook is used to initialize an organization when a new user signs up",
        tags: ["Webhook"],
      },
    })
    .input(
      z
        .object({
          type: z.string(),
          data: z
            .object({
              id: z.string(),
            })
            .passthrough(),
        })
        .passthrough()
    )
    .output(z.void())
    .mutation(async ({ input }) => {
      try {
        if (input.type !== "organization.created") {
          console.log("ERROR - Received webhook for event: ", input.type);
          return;
        }
        await initializeOrg(input.data.id);
      } catch (error) {
        console.log("Error in initializeOrgHandler", error);
      }
      return;
    });
}
