// Express server, entry point.

import express from "express";
import bodyParser from "body-parser";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import multer from "multer";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { trpcRouter } from "./trpcRouter.js"; // Replace with your actual router import
import { createContext } from "./context.js";
import { createOpenApiDocument } from "./lib/generate-openapi-document.js";

dotenv.config();

const PORT = process.env.PORT ?? 8000;
export const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

// Initialize Express app
const app = express();

// Rate limiting
const maxRequestPerMinuteForInternalAPIs: number = 10;
const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: maxRequestPerMinuteForInternalAPIs, // 10 requests per minute
  message: {
    error: "Too many requests, please try again later.",
  },
});

const maxRequestPerMinuteForWebhook: number = 25;
const webhookRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: maxRequestPerMinuteForWebhook, // 25 requests per minute
  message: {
    error: "Too many requests, please try again later.",
  },
});

// Middleware for Stripe webhook: Raw body required for signature validation
app.post(
  "/stripe-webhook",
  webhookRateLimiter, // Apply specific rate limiter for /webhook
  bodyParser.raw({ type: "application/json" }) // Raw body for Stripe
);

// Apply general rate limiter to all other routes
app.use((req: any, res: any, next: any) => {
  if (req.path !== "/stripe-webhook") {
    return apiRateLimiter(req, res, next);
  }
  next();
});

// General middlewares
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

// Serve OpenAPI UI
const openApiDocument = createOpenApiDocument(baseURL);
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

const upload = multer({ dest: "uploads/" });

app.post(
  "/upload-docx",
  upload.single("file"), // Accept a single file with the key "file"
  (req: any, res: any, next: any) => {
    req.file = req.file; // Attach the file to the request object
    next();
  }
);

app.post(
  "/files-to-articles",
  upload.array("files"), // Accept array of files with the key "files"
  (req: any, res: any, next: any) => {
    req.files = req.files; // Attach the files to the request object
    next();
  }
);

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
