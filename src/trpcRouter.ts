import { googleAuthHandler } from "./handler/google-auth-handler.js";
import { googleDocCreationHandler } from "./handler/google-doc-creation-handler.js";
import { googleDocSharingHandler } from "./handler/google-doc-sharing-handler.js";
import { googleTokenGenerationHandler } from "./handler/google-token-generation-handler.js";
import { imageSearchHandler } from "./handler/image-search-handler.js";
import { initializeOrgHandler } from "./handler/initialize-org.js";
import { internalLinksHandler } from "./handler/internal-links-handler.js";
import { testEndpointHandler } from "./handler/test-handler.js";
import { topicGenerationHandler } from "./handler/topic-generation-handler.js";
import { videoSearchHandler } from "./handler/video-search-handler.js";
import { webRetrievalHandler } from "./handler/web-retrieval-handler.js";
import { wordpressAuthHandler } from "./handler/wordpress-auth-handler.js";
import { createPostHandler } from "./handler/wordpress-post-creation.js";
import { wordpressTokenGenerationHandler } from "./handler/wordpress-token-generation-handler.js";
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
  "auth/wordpress/callback": wordpressTokenGenerationHandler(
    t,
    "auth/wordpress/callback"
  ),
  "create-post": createPostHandler(t, "create-post"),
  "web-retrieval": webRetrievalHandler(t, "web-retrieval"),
  "internal-links-handler": internalLinksHandler(t, "internal-links-handler"),
  "image-search": imageSearchHandler(t, "image-search"),
  "video-search": videoSearchHandler(t, "video-search"),
  "initialize-org": initializeOrgHandler(t, "initialize-org"),
  "generate-topic": topicGenerationHandler(t, "generate-topic"),
  "auth/google/authorize": googleAuthHandler(t, "auth/google/authorize"),
  "auth/google/callback": googleTokenGenerationHandler(
    t,
    "auth/google/callback"
  ),
  "create-google-doc": googleDocCreationHandler(t, "create-google-doc"),
  "share-google-doc": googleDocSharingHandler(t, "share-google-doc"),
});
