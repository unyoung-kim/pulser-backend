// Express server, entry point.

import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { createContext } from "./context.js";
import { createOpenApiDocument } from "./lib/generate-openapi-document.js";
import swaggerUi from "swagger-ui-express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { trpcRouter } from "./trpcRouter.js";
import rateLimit from "express-rate-limit";

const PORT = process.env.PORT ?? 8000;
export const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

// Initialize Express app
const app = express();

// if (process.env.NODE_ENV === "production") {
//   app.set("trust proxy", true); // Trust all proxies in production
// }

// Express middlewares
app.use(
  cors({
    origin: "*", // or specify allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
    credentials: true, // if you need to allow credentials
  })
);
app.use(helmet());
app.use(express.json()); // This should parse JSON request bodies

dotenv.config();

const openApiDocument = createOpenApiDocument(baseURL);

const maxRequestPerMinuteForInternalAPIs: number = 5;

// Set up rate limiting
const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: maxRequestPerMinuteForInternalAPIs, // Setting it to 5 per IP as post generation takes atleast 30 seconds
  message: {
    error: "Too many requests, please try again later.",
  },
});

// Apply rate limiting middleware globally to all routes
app.use("/", apiRateLimiter);

// Serve OpenAPI UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Handle OpenAPI requests
app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: trpcRouter,
    createContext,
    responseMeta: undefined,
    onError: undefined,
    maxBodySize: undefined,
  })
);

// TODO: I should probably add auth here too but I can do this later.

// Apply the tRPC middleware on the '/trpc' route
app.use(
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext,
  })
);

// Start the server
app.listen(PORT, () => {
  console.log(`💡 Server running on ${baseURL}`);
});

// Rate limiting based on different routes:

// // Define rate limiters for specific route patterns
// const rateLimiters = {
//   "hello": rateLimit({
//     windowMs: 60 * 1000, // 1 minute
//     max: 10,
//     message: { error: "Too many requests to hello route, please try again later." },
//   }),
//   "auth": rateLimit({
//     windowMs: 60 * 1000, // 1 minute
//     max: 5,
//     message: { error: "Too many requests to auth routes, please try again later." },
//   }),
//   "create-post": rateLimit({
//     windowMs: 60 * 1000, // 1 minute
//     max: 3,
//     message: { error: "Too many requests to create-post route, please try again later." },
//   }),
// };

// // Middleware to dynamically apply rate limiting based on route pattern
// const dynamicRateLimiter = (req, res, next) => {
//   const path = req.path.split("/trpc/")[1]; // Get the tRPC route name
//   const rateLimiter = Object.entries(rateLimiters).find(([key]) => path.startsWith(key));

//   if (rateLimiter) {
//     // Apply the matched rate limiter
//     rateLimiter[1](req, res, next);
//   } else {
//     // No rate limiter for this route, proceed to the next middleware
//     next();
//   }
// };

// // Apply the dynamic rate limiter middleware to the tRPC route
// app.use(
//   "/trpc",
//   dynamicRateLimiter,
//   trpcExpress.createExpressMiddleware({
//     router: trpcRouter,
//     createContext,
//   })
// );
