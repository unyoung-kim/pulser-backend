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
    // stripePriceId: "price_1Qag4GGEZWCXijlJhyDjx26M",
    // stripeProductId: "prod_RTdKZHfDHS61Cc",
    term: "MONTHLY",
    plan: "BASIC",
    credits: 100,
  },
  {
    stripePriceId: "price_1QZc0xGEZWCXijlJ12W3MVZw",
    stripeProductId: "prod_RSX5vscSGC8bca",
    // stripePriceId: "price_1Qag4YGEZWCXijlJVMVmObf8",
    // stripeProductId: "prod_RTdLRvnfcrkKDi",
    term: "MONTHLY",
    plan: "PRO",
    credits: 250,
  },
  {
    stripePriceId: "price_1QZc1RGEZWCXijlJ1mBUNsFd",
    stripeProductId: "prod_RSX5JqGsC7EtK5",
    // stripePriceId: "price_1Qag4YGEZWCXijlJVMVmObf8",
    // stripeProductId: "prod_RRjQ7fd2X2xQTG",
    term: "MONTHLY",
    plan: "AGENCY",
    credits: 1000,
  },
  {
    stripePriceId: "price_1QZc27GEZWCXijlJ6JCasqQL",
    stripeProductId: "prod_RSX6jXnhjHJLVq",
    // stripePriceId: "price_1Qag5QGEZWCXijlJc4lT7knx",
    // stripeProductId: "prod_RTdMSonEfubXjD",
    term: "YEARLY",
    plan: "BASIC",
    credits: 1200,
  },
  {
    stripePriceId: "price_1QZc2dGEZWCXijlJjqXZv4uQ",
    stripeProductId: "prod_RSX6D5JS9pcNas",
    // stripePriceId: "price_1Qag5qGEZWCXijlJv19JEAsq",
    // stripeProductId: "prod_RTdM8le3VcmlQG",
    term: "YEARLY",
    plan: "PRO",
    credits: 3000,
  },
  {
    stripePriceId: "price_1QZc3NGEZWCXijlJwb6807Uc",
    stripeProductId: "prod_RSX7tsEWRVwrP1",
    // stripePriceId: "price_1QYpy5GEZWCXijlJaDjzcOnO",
    // stripeProductId: "prod_RRjQYhZit7NOOH",
    term: "YEARLY",
    plan: "AGENCY",
    credits: 12000,
  },
];
