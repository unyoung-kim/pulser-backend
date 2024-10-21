// Express server, entry point.

import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { testEndpointHandler } from "./handler/test-handler";
import { contentHandler } from "./handler/content-handler";
import { t } from "./lib/trpc";
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
dotenv.config();
import swaggerUi from "swagger-ui-express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { createContext } from "./context.js";
import { openApiDocument } from "./lib/generate-openapi-document.js";
import { trpcRouter } from "./trpcRouter.js";

// Initialize Express app
const app = express();

// Express middlewares
app.use(cors());
app.use(helmet());
app.use(express.json()); // This should parse JSON request bodies

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * tRPC routers from here
 * You should add any additional handlers in the '/handler' folder!!
 *
 * query => GET methods
 * mutation => POST methods
 */
const trpcRouter = t.router({
  hello: testEndpointHandler(t, "hello"),
  content: contentHandler(t, supabase),
  // Just keep adding More endpoints here...
});
dotenv.config();

// Serve OpenAPI UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Handle OpenAPI requests
app.use(
  "/api",
  createOpenApiExpressMiddleware({ router: trpcRouter, createContext })
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
const PORT = process.env.PORT ?? 8000;
app.listen(PORT, () => {
  console.log(`💡 Server running on http://localhost:${PORT}`);
});

export type AppRouter = typeof trpcRouter;
