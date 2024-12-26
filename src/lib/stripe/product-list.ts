export interface StripeProduct {
  stripePriceId: string;
  stripeProductId: string;
  term: "MONTHLY" | "YEARLY";
  plan: "BASIC" | "PRO" | "AGENCY";
  credits: number;
}

/**
 * List of Plans and their corresponding credits & stripe product & price ids
 */
export const STRIPE_PRODUCT_LIST: StripeProduct[] = [
  {
    stripePriceId: "price_1QZbziGEZWCXijlJZrj3rxwp",
    stripeProductId: "prod_RSX3IGHWCaxrxI",
    term: "MONTHLY",
    plan: "BASIC",
    credits: 100,
  },
  {
    stripePriceId: "price_1QZc0xGEZWCXijlJ12W3MVZw",
    stripeProductId: "prod_RSX5vscSGC8bca",
    term: "MONTHLY",
    plan: "PRO",
    credits: 250,
  },
  {
    stripePriceId: "price_1QZc1RGEZWCXijlJ1mBUNsFd",
    stripeProductId: "prod_RSX5JqGsC7EtK5",
    term: "MONTHLY",
    plan: "AGENCY",
    credits: 1000,
  },
  {
    stripePriceId: "price_1QZc27GEZWCXijlJ6JCasqQL",
    stripeProductId: "prod_RSX6jXnhjHJLVq",
    term: "YEARLY",
    plan: "BASIC",
    credits: 1200,
  },
  {
    stripePriceId: "price_1QZc2dGEZWCXijlJjqXZv4uQ",
    stripeProductId: "prod_RSX6D5JS9pcNas",
    term: "YEARLY",
    plan: "PRO",
    credits: 3000,
  },
  {
    stripePriceId: "price_1QZc3NGEZWCXijlJwb6807Uc",
    stripeProductId: "prod_RSX7tsEWRVwrP1",
    term: "YEARLY",
    plan: "AGENCY",
    credits: 12000,
  },
];
