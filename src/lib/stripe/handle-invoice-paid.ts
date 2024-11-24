import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import Result, { err, ok } from "true-myth/result";

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
      if (sessionList.length != 0) {
        // Handle subscription creation
        if (sessionList.length !== 1) {
          return err("Error getting unique session");
        }

        const session = sessionList.at(0);

        if (!session || !session.metadata) {
          return err("Error getting metadata from session");
        }

        const creditsCharged = parseInt(
          String(session.metadata.credits ?? "0"),
          10
        );

        if (creditsCharged <= 0) {
          return err("creditsCharged metadata is missing");
        }

        // Insert into the Usage table for subscription creation
        const { error } = await supabase.from("Usage").insert({
          stripe_subscription_id: subscriptionId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          credits_charged: creditsCharged,
        });

        return error
          ? err(error.message)
          : ok("Invoice payment processed successfully for subscription.");
      } else {
        // Handle subscription renewals
        if (!current_usage_id) {
          return err("Error fetching current usage id");
        }

        const { data: creditsChargedData, error: creditsChargedError } =
          await supabase
            .from("Usage")
            .select("credits_charged")
            .eq("id", current_usage_id)
            .single();

        if (creditsChargedError || !creditsChargedData?.credits_charged) {
          return err("Error fetching current credits charged");
        }

        const { error: usageInsertError } = await supabase
          .from("Usage")
          .insert({
            stripe_subscription_id: subscriptionId,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            credits_charged: parseInt(creditsChargedData.credits_charged, 10),
          });

        return usageInsertError
          ? err(usageInsertError.message)
          : ok("Invoice payment processed successfully for subscription.");
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

      if (
        usageError ||
        !usageData?.credits_charged ||
        !usageData?.additional_credits_charged ||
        !usageData?.credits_used
      ) {
        return err("Error fetching current credits details");
      }

      const creditsLeft =
        parseInt(usageData.credits_charged, 10) +
        parseInt(usageData.additional_credits_charged, 10) -
        parseInt(usageData.credits_used, 10);

      const newCredits = parseInt(subscription.metadata.newCredits, 10);

      const { error: existingUsageEndDateUpdateError } = await supabase
        .from("Usage")
        .update({ end_date: new Date().toISOString() })
        .eq("id", current_usage_id);

      if (existingUsageEndDateUpdateError) {
        return err("Error updating existing subscription usage date");
      }
      const { error: usageInsertError } = await supabase.from("Usage").insert({
        stripe_subscription_id: subscriptionId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        credits_charged: newCredits,
        additional_credits_charged: creditsLeft,
      });

      // Reset the metadata as the update is done
      await stripe.subscriptions.update(subscriptionId, {
        metadata: {},
      });

      return usageInsertError
        ? err(usageInsertError.message)
        : ok("Invoice payment processed successfully for subscription update.");
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

    const creditsCharged = parseInt(
      String(session.metadata.credits ?? "0"),
      10
    );

    if (creditsCharged <= 0) {
      return err("creditsCharged metadata is missing/invalid");
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

    const {
      data: additionalCreditsChargedData,
      error: additionalCreditsChargedError,
    } = await supabase
      .from("Usage")
      .select("additional_credits_charged")
      .eq("id", currentUsageIdData.current_usage_id)
      .single();

    if (
      additionalCreditsChargedError ||
      !additionalCreditsChargedData?.additional_credits_charged
    ) {
      return err("Error fetching current additional credits");
    }

    // Update the `additionalCreditsCharged` field
    const { error: updateError } = await supabase
      .from("Usage")
      .update({
        additional_credits_charged:
          parseInt(
            additionalCreditsChargedData.additional_credits_charged,
            10
          ) + creditsCharged,
      })
      .eq("id", currentUsageIdData?.current_usage_id);

    return updateError
      ? err(updateError.message)
      : ok("One-time payment processed successfully.");
  }
};
