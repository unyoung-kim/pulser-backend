"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEndpointHandler = void 0;
const zod_1 = require("zod");
/**
 * Test endpoint (GET)
 */
function testEndpointHandler(t, endpoint) {
    return (t.procedure
        .meta({
        openapi: {
            method: "GET",
            path: "/trpc/hello",
            summary: "A hello world endpoint",
        },
    })
        .input(zod_1.z.void())
        .output(zod_1.z.object({
        message: zod_1.z.string(),
    }))
        // .query() for GET methods, .mutation() for POST methods
        .query((opts) => {
        return { message: "hello, world" };
    }));
}
exports.testEndpointHandler = testEndpointHandler;
