import Result, { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";
import { getSupabaseClient } from "../get-supabase-client.js";
import { SupabaseClient } from "@supabase/supabase-js";

export const getOrCreateCustomer = async (
  orgId: string
): Promise<Result<string, string>> => {
  const stripeClientResult = getStripeClient();

  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }
  const stripe = stripeClientResult.value;

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  // Check if the customer exists in your database
  const { data: existingCustomerData, error: customerFetchError } =
    await supabase
      .from("Organization")
      .select("stripe_customer_id")
      .eq("org_id", orgId)
      .single();

  if (customerFetchError) {
    return err("Error fetching customer from DB.");
  }

  if (existingCustomerData.stripe_customer_id) {
    // Customer already exists in your database
    return ok(existingCustomerData.stripe_customer_id);
  }

  // Create a new customer in Stripe
  try {
    const customer = await stripe.customers.create({
      // email,
      // name,
      metadata: { orgId },
    });

    // Store the stripe customer id in the database
    const { error: insertError } = await supabase
      .from("Organization")
      .update({ stripe_customer_id: customer.id })
      .eq("org_id", orgId);

    if (insertError) {
      // To check race condition
      if (insertError.code === "PGRST116") {
        console.log("Conflict detected, fetching existing record...");
        const { data: existingData, error: fetchError } = await supabase
          .from("Organization")
          .select("stripe_customer_id")
          .eq("org_id", orgId)
          .single();

        if (fetchError) {
          return err(`Error fetching existing customer: ${fetchError.message}`);
        }

        return existingData.stripe_customer_id;
      }

      return err(`Error saving customer to database: ${insertError.message}`);
    }

    return ok(customer.id);
  } catch (error) {
    return err(`Error creating customer in Stripe: ${error}`);
  }
};
