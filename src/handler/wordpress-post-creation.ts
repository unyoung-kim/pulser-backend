import { z } from "zod";
import { tRPC } from "../lib/trpc";

// create a post on wordpress
export function createPostHandler(t: tRPC) {
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
    .output(
      z.object({
        url: z.string(),
      })
    )
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
          throw new Error('Failed to create post');
        }

        const data = await response.json();
        return { url: data.URL };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create post');
      }
    })
  );
}
