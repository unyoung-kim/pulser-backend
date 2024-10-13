import { z } from "zod";
import { tRPC } from "../lib/trpc";
import { ApiResponseSchema } from "../lib/api-response-schema";

// create a post on wordpress
// refer to https://developer.wordpress.com/docs/api/1.1/post/sites/%24site/posts/new/
export function createPostHandler(t: tRPC, path: string) {
  return (
    t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/create-post",
        summary: "Create a post on WordPress",
      },
    })
    .input(
      z.object({
        accessToken: z.string(),
        siteId: z.string(),
        title: z.string(),
        content: z.string(),
      })
    )
    .output(ApiResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/${input.siteId}/posts/new`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${input.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: input.title,
            content: input.content,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return {
            success: false,
            error: errorData.message || 'Failed to create post',
          };
        }

        const data = await response.json();
        return {
          success: true,
          data: { url: data.URL },
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: 'An unexpected error occurred while creating the post',
        };
      }
    })
  );
}
