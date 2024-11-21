import Result, { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";
import { getOrCreateCustomer } from "./get-or-create-customer.js";
import Stripe from "stripe";

export const createStripeSession = async (
  orgId: string,
  priceId: string,
  credits: number,
  mode: "payment" | "subscription"
): Promise<Result<string, string>> => {
  const stripeClientResult = getStripeClient();

  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }
  const stripe = stripeClientResult.value;

  // Get or create the customer
  const customerResult = await getOrCreateCustomer(orgId);

  if (customerResult.isErr) {
    return err(customerResult.error);
  }

  const customerId = customerResult.value;

  try {
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_SUCCESS_URL}`,
      cancel_url: `${process.env.FRONTEND_CANCEL_URL}`,
      customer: customerId,
      metadata: {
        credits: credits.toString(),
        orgId,
        priceId,
      },
    };

    // Enable invoice creation only for one-time payments
    if (mode === "payment") {
      sessionConfig.invoice_creation = {
        enabled: true,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    if (!session || !session.url) {
      return err("Error in getting session URL");
    }

    return ok(session.url);
  } catch (error) {
    return err(`Error creating Stripe session: ${error}`);
  }
};
