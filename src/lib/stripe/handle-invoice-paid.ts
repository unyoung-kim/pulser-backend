import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import Result, { err, ok } from "true-myth/result";
import { STRIPE_PRODUCT_LIST, StripeProduct } from "./product-list.js";

export const handleInvoicePaid = async (
  invoice: Stripe.Invoice,
  supabase: SupabaseClient,
  stripe: Stripe
): Promise<Result<string, string>> => {
  const customer = invoice.customer as string | null;

  if (customer == null) {
    return err("Customer id not found in invoice");
  }

  const { data: orgData, error: orgIdError } = await supabase
    .from("Organization")
    .select("org_id,current_usage_id")
    .eq("stripe_customer_id", customer)
    .single();

  if (orgIdError || !orgData?.org_id) {
    return err("Error fetching org id for the stripe customer id");
  }

  const orgId = orgData?.org_id;
  const current_usage_id = orgData?.current_usage_id;

  const sessions: Stripe.Checkout.Session[] = (
    await stripe.checkout.sessions.list({
      customer: customer,
    })
  ).data;

  const sessionList = sessions.filter((s) => s.invoice === invoice.id);

  // Check if it's a subscription payment (subscription ID exists)
  const subscriptionId = invoice.subscription as string | null;

  // Handle subscription renewal or one-time payment based on subscriptionId
  if (subscriptionId) {
    // Handle subscription payment
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const forUpdate = subscription.metadata.forUpdate;

    const start = parseInt(
      String(invoice.lines.data.at(0)?.period.start ?? "0"),
      10
    );
    const end = parseInt(
      String(invoice.lines.data.at(0)?.period.end ?? "0"),
      10
    );
    const startDate = new Date(start * 1000);
    const endDate = new Date(end * 1000);

    if (!startDate || !endDate) {
      return err("startDate or endDate are invalid/missing.");
    }

    if (!forUpdate) {
      if (sessionList.length !== 0) {
        // Handle subscription creation
        if (sessionList.length !== 1) {
          return err("Error getting unique session");
        }

        const session = sessionList.at(0);

        if (!session || !session.metadata) {
          return err("Error getting metadata from session");
        }

        const productId = session.metadata.productId;

        if (productId == null) {
          return err("productId metadata is missing");
        }

        const stripeProduct = STRIPE_PRODUCT_LIST.find(
          (product: StripeProduct) => product.stripeProductId === productId
        );

        if (!stripeProduct) {
          return err("Product not found for productId: " + productId);
        }

        // Search for the usage record for Free Credits with end date null
        const { data: usageData, error: usageError } = await supabase
          .from("Usage")
          .select("id")
          .eq("id", current_usage_id)
          .eq("plan", "FREE_CREDIT")
          .is("end_date", null);

        if (usageError || !usageData) {
          return err("Error fetching current usage id");
        }

        // If there is a free credits usage record, update its end date to today
        if (usageData.length !== 0) {
          const { error: usageEndDateUpdateError } = await supabase
            .from("Usage")
            .update({ end_date: new Date().toISOString().split("T")[0] })
            .eq("id", current_usage_id);

          if (usageEndDateUpdateError) {
            return err("Error updating existing subscription usage date");
          }
        }
        // TODO: We should set the term and plan field here. Check supabase for new fields. use product-list.ts STRIPE_PRODUCT_LIST to get the term and plan if required.

        // Insert into the Usage table for subscription creation
        const { data: newUsageInsertData, error: newUsageInsertError } =
          await supabase
            .from("Usage")
            .insert({
              stripe_subscription_id: subscriptionId,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              credits_charged: stripeProduct.credits,
              org_id: orgId,
              plan: stripeProduct.plan,
              term: stripeProduct.term,
            })
            .select("id")
            .single();

        if (newUsageInsertError) {
          return err("Error inserting new usage record");
        }

        const { error: usageIdUpdateError } = await supabase
          .from("Organization")
          .update({ current_usage_id: newUsageInsertData?.id })
          .eq("org_id", orgId);

        if (usageIdUpdateError) {
          return err("Error updating new usage id in Organization table");
        }

        return ok("Invoice payment processed successfully for subscription.");
      } else {
        // Handle subscription renewals
        if (!current_usage_id) {
          return err("Error fetching current usage id");
        }

        const {
          data: currentSubscriptionData,
          error: currentSubscriptionError,
        } = await supabase
          .from("Usage")
          .select("credits_charged,plan,term")
          .eq("id", current_usage_id)
          .single();

        if (currentSubscriptionError || !currentSubscriptionData) {
          return err("Error fetching current credits charged");
        }

        const { data: newUsageInsertData, error: newUsageInsertError } =
          await supabase
            .from("Usage")
            .insert({
              stripe_subscription_id: subscriptionId,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              credits_charged: currentSubscriptionData.credits_charged,
              org_id: orgId,
              plan: currentSubscriptionData.plan,
              term: currentSubscriptionData.term,
            })
            .select("id")
            .single();

        if (newUsageInsertError) {
          return err("Error inserting new usage record");
        }

        const { error: usageIdUpdateError } = await supabase
          .from("Organization")
          .update({ current_usage_id: newUsageInsertData?.id })
          .eq("org_id", orgId);

        if (usageIdUpdateError) {
          return err("Error updating new usage id in Organization table");
        }

        return ok("Invoice payment processed successfully for subscription.");
      }
    } else {
      //Handle subcription update
      if (!current_usage_id) {
        return err("Error fetching current usage id");
      }

      const { data: usageData, error: usageError } = await supabase
        .from("Usage")
        .select("credits_charged,additional_credits_charged,credits_used")
        .eq("id", current_usage_id)
        .single();

      if (usageError || !usageData) {
        return err("Error fetching current credits details");
      }

      const creditsLeft =
        parseInt(usageData.credits_charged, 10) +
        parseInt(usageData.additional_credits_charged, 10) -
        parseInt(usageData.credits_used, 10);

      const productId = subscription.metadata.productId;

      const stripeProduct = STRIPE_PRODUCT_LIST.find(
        (product: StripeProduct) => product.stripeProductId === productId
      );

      if (!stripeProduct) {
        return err("Product not found for productId: " + productId);
      }

      const { error: existingUsageEndDateUpdateError } = await supabase
        .from("Usage")
        .update({ end_date: new Date().toISOString() })
        .eq("id", current_usage_id);

      if (existingUsageEndDateUpdateError) {
        return err("Error updating existing subscription usage date");
      }
      const { data: newUsageInsertData, error: newUsageInsertError } =
        await supabase
          .from("Usage")
          .insert({
            stripe_subscription_id: subscriptionId,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            credits_charged: stripeProduct.credits,
            additional_credits_charged: creditsLeft,
            org_id: orgId,
            plan: stripeProduct.plan,
            term: stripeProduct.term,
          })
          .select("id")
          .single();

      if (newUsageInsertError) {
        return err(
          `Error inserting new usage record: ${newUsageInsertError.message}`
        );
      }

      const { error: usageIdUpdateError } = await supabase
        .from("Organization")
        .update({ current_usage_id: newUsageInsertData?.id })
        .eq("org_id", orgId);

      if (usageIdUpdateError) {
        return err("Error updating new usage id in Organization table");
      }

      // Reset the metadata as the update is done
      await stripe.subscriptions.update(subscriptionId, {
        metadata: "",
      });

      return ok(
        "Invoice payment processed successfully for subscription update."
      );
    }
  } else {
    // Handle one-time payment
    if (sessionList.length !== 1) {
      return err("Error getting unique session");
    }

    const session = sessionList.at(0);

    if (!session || !session.metadata) {
      return err("Error getting metadata from session");
    }

    const stripeProduct = STRIPE_PRODUCT_LIST.find(
      (product: StripeProduct) =>
        product.stripeProductId === session.metadata?.productId
    );

    if (!stripeProduct) {
      return err(
        "Product not found for productId: " + session.metadata?.productId
      );
    }

    const { data: currentUsageIdData, error: currentUsageIdError } =
      await supabase
        .from("Organization")
        .select("current_usage_id")
        .eq("org_id", orgId)
        .single();

    if (currentUsageIdError || !currentUsageIdData?.current_usage_id) {
      return err("Error fetching current usage id");
    }

    // Update the Usage record
    const { error } = await supabase.rpc(
      "increment_additional_credits_charged",
      {
        usage_id: currentUsageIdData.current_usage_id,
        increment_value: stripeProduct.credits,
      }
    );

    if (error) {
      return err(`Error updating additional credits: ${error.message}`);
    }

    return error ? err(error) : ok("One-time payment processed successfully.");
  }
};
