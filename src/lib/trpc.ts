import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import { createContext } from "../context";

/**
 * Prepare tRPC object
 */
// Prepare endpoints
// Plug in the tRPC x OpenAPI tool:
// https://www.npmjs.com/package/trpc-openapi
export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>().create({
    errorFormatter(opts) {
      // You can change the error messages here if you want
    const { shape, error } = opts;
    return {
      ...shape,
      zodErrors:
        error.code === "BAD_REQUEST" && error.cause instanceof ZodError
          ? error.cause.issues
          : null,
    };
  },
});

export type tRPC = typeof t;
