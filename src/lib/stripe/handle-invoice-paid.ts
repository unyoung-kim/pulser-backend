import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { err, Result } from "true-myth/result";
import { handleSubscriptionCreation } from "./handle-subscription-creation.js";
import { handleSubscriptionRenewal } from "./handle-subscription-renewal.js";
import { handleSubscriptionChange } from "./handle-subscription-change.js";
import { handleOneTimePayment } from "./handle-one-time-payment.js";

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
        return handleSubscriptionCreation(
          customer,
          subscriptionId,
          sessionList,
          startDate,
          endDate,
          supabase
        );
      } else {
        // Handle subscription renewals
        return handleSubscriptionRenewal(
          current_usage_id,
          subscriptionId,
          startDate,
          endDate,
          orgId,
          supabase
        );
      }
    } else {
      // Handle subscription update
      return handleSubscriptionChange(
        current_usage_id,
        subscriptionId,
        subscription,
        startDate,
        endDate,
        orgId,
        supabase,
        stripe
      );
    }
  } else {
    // Handle one-time payment
    return handleOneTimePayment(sessionList, orgId, supabase);
  }
};
