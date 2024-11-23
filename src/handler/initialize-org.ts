import { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "true-myth";
import { z } from "zod";
import { getSupabaseClient } from "../lib/get-supabase-client.js";
import { tRPC } from "../lib/trpc.js";

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
      },
    })
    .input(z.any())
    .mutation(async ({ input }) => {
      try {
        if (input.type !== "organization.created") {
          console.log("ERROR - Received webhook for event: ", input.type);
          return;
        }
        const orgId: string = input.data.id;

        const supabaseClient: Result<SupabaseClient, string> =
          getSupabaseClient();

        if (supabaseClient.isErr) {
          console.log("Error in getting supabase client", supabaseClient.error);
          return;
        }

        const supabase = supabaseClient.value;

        // Add organization to Supabase
        const { data: organization, error: orgError } = await supabase
          .from("Organization")
          .upsert({
            org_id: orgId,
            created_at: new Date().toISOString(),
          })
          .select();

        if (orgError) {
          console.log(`Failed to create organization: ${orgError.message}`);
          return;
        }

        // Create a new usage row
        const { data: usage, error: usageError } = await supabase
          .from("Usage")
          .insert({
            org_id: orgId,
            start_date: new Date().toISOString().split("T")[0],
            credits_used: 0,
            credits_charged: 0,
            additional_credits_charged: 0,
          })
          .select()
          .single();

        if (usageError) {
          console.log(`Failed to create usage: ${usageError.message}`);
          return;
        }

        // Update organization with the new usage ID
        const { error: updateError } = await supabase
          .from("organizations")
          .update({ current_usage_id: usage.id })
          .eq("org_id", orgId);

        if (updateError) {
          console.log(
            `Failed to update organization with usage: ${updateError.message}`
          );
          return;
        }

        console.log("Organization initialized successfully");
      } catch (error) {
        console.log("Error in initializeOrgHandler", error);
      }
    });
}
