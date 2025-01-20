import Stripe from "stripe";
import Result, { err, ok } from "true-myth/result";
import { getOrCreateCustomer } from "./get-or-create-customer.js";
import { getStripeClient } from "./get-stripe-client.js";
import { STRIPE_PRODUCT_LIST, StripeProduct } from "./product-list.js";

export const createStripeSession = async (
  orgId: string,
  plan: "BASIC" | "PRO" | "AGENCY",
  term: "MONTHLY" | "YEARLY",
  mode: "payment" | "subscription",
  couponCode?: string
): Promise<Result<string, string>> => {
  const stripeProduct: StripeProduct | undefined = STRIPE_PRODUCT_LIST.find(
    (product: StripeProduct) => product.plan === plan && product.term === term
  );

  if (!stripeProduct) {
    return err("Invalid plan or term");
  }

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
          price: stripeProduct.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_SUCCESS_URL}`,
      cancel_url: `${process.env.FRONTEND_CANCEL_URL}`,
      customer: customerId,
      metadata: {
        orgId,
        productId: stripeProduct.stripeProductId,
        couponCode: couponCode ?? null,
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
