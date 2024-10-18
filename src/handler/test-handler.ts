import { z } from "zod";
import { tRPC } from "../lib/trpc";
import { ApiResponseSchema } from "../lib/schema/api-response-schema";

/**
 * Test endpoint (GET)
 */
export function testEndpointHandler(t: tRPC, path: string) {
  return (
    t.procedure
      .meta({
        openapi: {
          method: "GET",
          path: "/hello",
          summary: "A hello world endpoint",
          description: "A simple test endpoint that returns a hello world message",
          tags: ['Test'],
        },
      })
      .input(z.void())
      .output(ApiResponseSchema)
      .query(() => {
        return {
          success: true,
          data: { message: "hello, world" },
        };
      })
  );
}
