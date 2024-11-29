import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
    rawBody: req.body, // Add raw body to context
  };
};
