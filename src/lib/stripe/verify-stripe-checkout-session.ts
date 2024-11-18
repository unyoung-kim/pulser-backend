import stripe from "stripe";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getStripeClient } from "./get-stripe-client.js";

export const verifyStripeCheckoutSession = async (
  sessionId: string
): Promise<Result<string, string>> => {
  const stripeClientResult = getStripeClient();

  if (stripeClientResult.isErr) {
    return err(stripeClientResult.error);
  }

  const stripe = stripeClientResult.value;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify that the payment was successful
    if (session.payment_status === "paid") {
      // Trigger fulfillment logic here
      // Example: Granting access, generating a blog post, sending a confirmation email, etc.
      return ok(`Payment for session ${sessionId} was successful.`);
    } else {
      return err("Payment not successful");
    }
  } catch (error) {
    return err(`Error in checkout session verification ${error}`);
  }
};
