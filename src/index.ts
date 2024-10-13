// Express server, entry point.

import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import dotenv from 'dotenv';
import { testEndpointHandler } from "./handler/test-handler";
import { t } from "./lib/trpc";
import { wordpressAuthHandler } from "./handler/wordpress-auth-handler";
import { wordpressTokenHandler } from "./handler/wordpress-token-handler";
import { createContext } from "./context";
import { createPostHandler } from "./handler/wordpress-post-creation";

// Initialize Express app
const app = express();

// Express middlewares
app.use(cors());
app.use(helmet());
app.use(express.json()); // This should parse JSON request bodies

dotenv.config();

/**
 * tRPC routers from here
 * You should add any additional handlers in the '/handler' folder!!
 *
 * query => GET methods
 * mutation => POST methods
 */
const trpcRouter = t.router({
  "hello": testEndpointHandler(t, "hello"),
  "auth/wordpress/authorize": wordpressAuthHandler(t, "auth/wordpress/authorize"),
  "auth/wordpress/callback": wordpressTokenHandler(t, "auth/wordpress/callback"),
  "create-post": createPostHandler(t, "create-post"),
});

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
