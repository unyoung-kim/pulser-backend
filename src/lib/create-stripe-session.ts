import Result, { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";

export const createStripeSession = async (
  projectId: string,
  priceId: string
): Promise<Result<string, string>> => {
  const stripeClientResult = getStripeClient();
  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }
  const stripe = stripeClientResult.value;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer: projectId,
      // customer_email: "email"
      // cancel_at_period_end: true,
      // description: "Subscription description",
    });

    if (!session || !session.url) {
      return err("Error in getting session url");
    }

    return ok(session.url);
  } catch (error) {
    return err(`Error in session creation ${error}`);
  }
};
