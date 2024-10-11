import { z } from "zod";
import { tRPC } from "../lib/trpc";

/**
 * Test endpoint (GET)
 */
export function testEndpointHandler(t: tRPC) {
  return (
    t.procedure
      .meta({
        openapi: {
          method: "GET",
          path: "/hello",
          summary: "A hello world endpoint",
        },
      })
      .input(z.void())
      .output(
        z.object({
          message: z.string(),
        })
      )
      // .query() for GET methods, .mutation() for POST methods
      .query((opts) => {
        return { message: "hello, world" };
      })
  );
}
