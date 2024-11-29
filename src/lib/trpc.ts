import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";
import { ZodError } from "zod";
import { createContext } from "../context.js";

/**
 * Prepare tRPC object
 */
// Prepare endpoints
// Plug in the tRPC x OpenAPI tool:
// https://www.npmjs.com/package/trpc-openapi
export const t = initTRPC
  .meta<OpenApiMeta>()
  .context<inferAsyncReturnType<typeof createContext>>()
  .create({
    errorFormatter(opts) {
      const { shape, error } = opts;

      // Log the error details to the console for debugging purposes
      if (error.code === "BAD_REQUEST" && error.cause instanceof ZodError) {
        console.error("Zod Error: ", error.cause.issues); // Log the issues (validation errors) from Zod
      } else {
        console.error("Unexpected Error: ", error); // Log any unexpected errors
      }

      // Return the formatted error response
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
