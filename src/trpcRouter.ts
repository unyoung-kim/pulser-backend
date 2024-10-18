import { testEndpointHandler } from "./handler/test-handler";
import { t } from "./lib/trpc";
import { wordpressAuthHandler } from "./handler/wordpress-auth-handler";
import { wordpressTokenHandler } from "./handler/wordpress-token-handler";
import { createPostHandler } from "./handler/wordpress-post-creation";
import { webRetrievalHandler } from "./handler/web-retrieval-handler";

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
  });