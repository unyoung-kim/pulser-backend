import { testEndpointHandler } from "./handler/test-handler.js";
import { t } from "./lib/trpc.js";
import { wordpressAuthHandler } from "./handler/wordpress-auth-handler.js";
import { wordpressTokenHandler } from "./handler/wordpress-token-handler.js";
import { createPostHandler } from "./handler/wordpress-post-creation.js";
import { webRetrievalHandler } from "./handler/web-retrieval-handler.js";
import { internalLinksHandler } from "./handler/internal-links-handler.js"

/**
 * tRPC routers from here
 * You should add any additional handlers in the '/handler' folder!!
 *
 * query => GET methods
 * mutation => POST methods
 */
export const trpcRouter = t.router({
    "hello": testEndpointHandler(t, "hello"),
    "auth/wordpress/authorize": wordpressAuthHandler(t, "auth/wordpress/authorize"),
    "auth/wordpress/callback": wordpressTokenHandler(t, "auth/wordpress/callback"),
    "create-post": createPostHandler(t, "create-post"),
    "web-retrieval": webRetrievalHandler(t, "web-retrieval"),
    "internal-links-handler": internalLinksHandler(t, "internal-links-handler")
  });