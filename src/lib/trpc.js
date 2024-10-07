"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = void 0;
const server_1 = require("@trpc/server");
require("dotenv/config");
const zod_1 = require("zod");
/**
 * Prepare tRPC object
 */
// Prepare endpoints
// Plug in the tRPC x OpenAPI tool:
// https://www.npmjs.com/package/trpc-openapi
exports.t = server_1.initTRPC.create({
    errorFormatter(opts) {
        // You can change the error messages here if you want
        const { shape, error } = opts;
        return Object.assign(Object.assign({}, shape), { zodErrors: error.code === "BAD_REQUEST" && error.cause instanceof zod_1.ZodError
                ? error.cause.issues
                : null });
    },
});
