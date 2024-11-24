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

  const sessions: Stripe.Checkout.Session[] = (
    await stripe.checkout.sessions.list({
      customer: customer,
    })
  ).data;

  const sessionList = sessions.filter((s) => s.invoice === invoice.id);

  if (sessionList.length !== 1) {
    return err("Error geting unique session");
  }

  const session = sessionList.at(0);

  if (!session || !session.metadata) {
    return err("Error getting metadata from session");
  }

  const orgId = session.metadata.orgId;
  const creditsCharged = parseInt(String(session.metadata.credits ?? "0"), 10);
  const start = parseInt(
    String(invoice.lines.data.at(0)?.period.start ?? "0"),
    10
  );
  const end = parseInt(String(invoice.lines.data.at(0)?.period.end ?? "0"), 10);
  const startDate = new Date(start * 1000);
  const endDate = new Date(end * 1000);

  // Check if it's a subscription payment (subscription ID exists)
  const subscriptionId = invoice.subscription as string | null;

  // Handle subscription renewal or one-time payment based on subscriptionId
  if (subscriptionId) {
    // Handle subscription payment (renewal)

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const forUpdate = subscription.metadata.forUpdate;

    if (!forUpdate) {
      if (!startDate || !endDate || creditsCharged <= 0) {
        return err(
          "startDate, endDate, or creditsCharged are invalid/missing."
        );
      }

      // Insert into the Usage table for subscription renewals
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
      const { data: usageData, error: usageError } = await supabase
        .from("Usage")
        .select("*")
        .eq("stripe_subscription_id", subscriptionId)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
        .single();

      const creditsLeft =
        parseInt(usageData.credits_charged, 10) +
        parseInt(usageData.additional_credits_charged, 10) -
        parseInt(usageData.credits_used, 10);

      const newCredits = parseInt(subscription.metadata.newCredits, 10);

      const { error: existingUsageEndDateUpdateError } = await supabase
        .from("Usage")
        .update({ end_date: new Date().toISOString() })
        .eq("id", usageData.id);

      if (existingUsageEndDateUpdateError) {
        return err("Error updating existing subscription usage date");
      }
      const { error } = await supabase.from("Usage").insert({
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

      // Update the session metadata
      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          ...session.metadata,
          credits: newCredits,
        },
      });

      return error
        ? err(error.message)
        : ok("Invoice payment processed successfully for subscription update.");
    }
  } else {
    // Handle one-time payment

    if (!orgId || creditsCharged <= 0) {
      return err("Invalid metadata: orgId or credits are missing/invalid.");
    }

    const { data: customerId, error: stripeCustomerIdFetchError } =
      await supabase
        .from("Organization")
        .select("stripe_customer_id")
        .eq("org_id", orgId)
        .single();

    if (stripeCustomerIdFetchError) {
      return err("Error in fetching stripe cutomer id from database");
    }

    if (!customerId.stripe_customer_id) {
      return err("Stripe customer id not found in database");
    }

    const subscription = await stripe.subscriptions.list({
      customer: customerId.stripe_customer_id,
      status: "active",
    });

    if (!subscription?.data || subscription.data.length === 0) {
      return err("Error in fetching subscription id");
    }

    const subscriptionData = subscription.data.at(0);
    if (!subscriptionData) {
      return err("No active subscription found.");
    }

    const subscriptionId = subscriptionData.id;

    // Fetch the current billing cycle entry in `Usage`
    const { data, error: usageError } = await supabase
      .from("Usage")
      .select("*")
      .eq("stripe_subscription_id", subscriptionId)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .single();

    if (usageError || !data) {
      return err("Failed to fetch current billing cycle for orgId.");
    }

    // Update the `additionalCreditsCharged` field
    const { error: updateError } = await supabase
      .from("Usage")
      .update({
        additional_credits_charged:
          data.additional_credits_charged + creditsCharged,
      })
      .eq("id", data.id);

    return updateError
      ? err(updateError.message)
      : ok("One-time payment processed successfully.");
  }
};
