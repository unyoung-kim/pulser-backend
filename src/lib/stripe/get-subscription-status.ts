import Result, { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";
import { getSupabaseClient } from "../get-supabase-client.js";
import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function getSubscriptionStatusFromStripe(
  orgId: string
): Promise<Result<string, string>> {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }
  const supabase = supabaseClient.value;

  const { data: stripeCustomerIdData, error: stripeCustomerIdFetchError } =
    await supabase
      .from("Organization")
      .select("stripe_customer_id")
      .eq("org_id", orgId);

  if (stripeCustomerIdFetchError || !stripeCustomerIdData) {
    return err("Error in fetching stripe customer id");
  }

  if (stripeCustomerIdData.length == 0) {
    const { data: usageData, error: usageError } = await supabase
      .from("Usage")
      .select("*")
      .eq("org_id", orgId)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .single();

    if (usageError || !usageData) {
      return err("Error fetching usage data");
    }

    return ok(`
      "subscribed": "false",
      "credits_used": ${usageData.credits_used},
      "credits_charged": ${usageData.credits_charged},
      "additional_credits": ${usageData.additional_credits_charged}`);
  } else {
    const { data: usageData, error: usageError } = await supabase
      .from("Usage")
      .select("*")
      .eq("org_id", orgId)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .single();

    if (usageError || !usageData) {
      return err("Error fetching usage data");
    }
    const subscriptionId = usageData.stripe_subscription_id;

    const stripeClientResult = getStripeClient();
    if (stripeClientResult.isErr) {
      return err(stripeClientResult.error);
    }
    const stripe = stripeClientResult.value;

    const subscription: Stripe.Subscription =
      await stripe.subscriptions.retrieve(subscriptionId);

    const productId = subscription.items.data.at(0)?.plan.product;

    if (!productId || typeof productId !== "string") {
      return err("Error fetching product plan");
    }

    const product: Stripe.Product = await stripe.products.retrieve(
      productId as string
    );

    return ok(`
      "subscribed": "true",
      "subscription_name": ${product.name},
      "credits_used": ${usageData.credits_used},
      "credits_charged": ${usageData.credits_charged},
      "additional_credits": ${usageData.additional_credits_charged}`);
  }
}
