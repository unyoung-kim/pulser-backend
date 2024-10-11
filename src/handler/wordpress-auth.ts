import { z } from "zod";
import { tRPC } from "../lib/trpc";

// redirect to wordpress for authentication
export function authorizeHandler(t: tRPC) {
  return t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/wordpress/authorize",
        summary: "Get WordPress authentication URL",
      },
    })
    .input(z.void())
    .output(z.object({
      redirectUrl: z.string(),
    }))
    .query(() => {
      const authUrl = new URL(`https://public-api.wordpress.com/oauth2/authorize`);
      authUrl.searchParams.append('client_id', process.env.CLIENT_ID || '');
      authUrl.searchParams.append('redirect_uri', process.env.REDIRECT_URI || '');
      authUrl.searchParams.append('scope', process.env.SCOPE || '');
      authUrl.searchParams.append('response_type', 'code');

      return { redirectUrl: authUrl.toString() };
    });
}

// handle the callback from wordpress
export function getAccessTokenHandler(t: tRPC) {
  return t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/wordpress/callback",
        summary: "Handle the callback from WordPress and get access token",
      },
    })
    .input(
      z.void()
    )
    .output(z.object({
      accessToken: z.string(),
    }))
    .query(async ({ ctx }) => {
      // Extracting the code from the query parameters
      const code = ctx.req.query.code;

      // Validate that the code is present
      if (typeof code !== 'string') {
        throw new Error("Missing or invalid parameter: code");
      }

      try {
        const response = await fetch('https://public-api.wordpress.com/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.CLIENT_ID || '',
            client_secret: process.env.CLIENT_SECRET || '',
            redirect_uri: process.env.REDIRECT_URI || '',
            code: code,
            grant_type: 'authorization_code',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }

        const data = await response.json();
        const accessToken = data.access_token;

        // Return the access token
        return { accessToken };
      } catch (error) {
        console.error(error);
        throw new Error('Authentication failed');
      }
    });
}