import Result, { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";
import { getOrCreateCustomer } from "./get-or-create-customer.js";

export const createStripeSession = async (
  orgId: string,
  priceId: string,
  credits: number,
  mode: string
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
    const session = await stripe.checkout.sessions.create({
      mode: mode as "payment" | "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      //   success_url: `${process.env.FRONTEND_SUCCESS_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${process.env.FRONTEND_CANCEL_URL}`,
      cancel_url: `${process.env.FRONTEND_CANCEL_URL}`,
      customer: customerId,
      metadata: {
        credits: credits,
        orgId: orgId,
        priceId: priceId,
      },
      // cancel_at_period_end: true,
      // description: "Subscription description",
    });

    if (!session || !session.url) {
      return err("Error in getting session URL");
    }

    return ok(session.url);
  } catch (error) {
    return err(`Error in session creation ${error}`);
  }
};
