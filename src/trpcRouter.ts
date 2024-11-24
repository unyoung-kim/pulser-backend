import { imageSearchHandler } from "./handler/image-search-handler.js";
import { initializeOrgHandler } from "./handler/initialize-org.js";
import { internalLinksHandler } from "./handler/internal-links-handler.js";
import { testEndpointHandler } from "./handler/test-handler.js";
import { videoSearchHandler } from "./handler/video-search-handler.js";
import { stripeSessionCreationHandler } from "./handler/stripe-session-creation-handler.js";
import { stripeWebhook } from "./handler/stripe-webhook.js";
import { stripeSessionVerificationHandler } from "./handler/stripe-session-verification-handler.js";
import { subscriptionStatusRetrievalHandler } from "./handler/subscription-status-retrieval-handler.js";
import { webRetrievalHandler } from "./handler/web-retrieval-handler.js";
import { wordpressAuthHandler } from "./handler/wordpress-auth-handler.js";
import { createPostHandler } from "./handler/wordpress-post-creation.js";
import { wordpressTokenHandler } from "./handler/wordpress-token-handler.js";
import { t } from "./lib/trpc.js";

/**
 * tRPC routers from here
 * You should add any additional handlers in the '/handler' folder!!
 *
 * query => GET methods
 * mutation => POST methods
 */
export const trpcRouter = t.router({
  hello: testEndpointHandler(t, "hello"),
  "auth/wordpress/authorize": wordpressAuthHandler(
    t,
    "auth/wordpress/authorize"
  ),
  "auth/wordpress/callback": wordpressTokenHandler(
    t,
    "auth/wordpress/callback"
  ),
  "create-post": createPostHandler(t, "create-post"),
  "web-retrieval": webRetrievalHandler(t, "web-retrieval"),
  "internal-links-handler": internalLinksHandler(t, "internal-links-handler"),
  "image-search": imageSearchHandler(t, "image-search"),
  "video-search": videoSearchHandler(t, "video-search"),
  "create-stripe-session": stripeSessionCreationHandler(
    t,
    "create-stripe-session"
  ),
  webhook: stripeWebhook(t, "webhook"),
  "verify-checkout-session": stripeSessionVerificationHandler(
    t,
    "verify-checkout-session"
  ),
  "get-subscription-status": subscriptionStatusRetrievalHandler(
    t,
    "get-subscription-status"
  ),
  "initialize-org": initializeOrgHandler(t, "initialize-org"),
});
