import Stripe from "stripe";
import { err, ok, Result } from "true-myth/result";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Result<Stripe, string> {
  if (stripeClient) return ok(stripeClient);

  const stripeSecretAPIKey: string | null =
    process.env.STRIPE_SECRET_API_KEY ?? null;

  if (stripeSecretAPIKey == null) {
    return err("Stripe secret key is not defined");
  }

  stripeClient = new Stripe(stripeSecretAPIKey);
  return ok(stripeClient);
}
