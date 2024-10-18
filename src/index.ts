// Express server, entry point.

import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import dotenv from 'dotenv';
import { createContext } from "./context";
import { createOpenApiDocument } from "./lib/generate-openapi-document";
import swaggerUi from 'swagger-ui-express';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import { trpcRouter } from "./trpcRouter";


const PORT = process.env.PORT ?? 8000;
export const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;


// Initialize Express app
const app = express();

// Express middlewares
app.use(cors());
app.use(helmet());
app.use(express.json()); // This should parse JSON request bodies

dotenv.config();

const openApiDocument = createOpenApiDocument(baseURL);

// Serve OpenAPI UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Handle OpenAPI requests
app.use('/api', createOpenApiExpressMiddleware({ router: trpcRouter, createContext }));


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
