import { err, ok, Result } from "true-myth/result";

export async function callWordpressAccessTokenGenerationURL(
  code: string
): Promise<Result<string, string>> {
  const response = await fetch(
    "https://public-api.wordpress.com/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.WORDPRESS_CLIENT_ID ?? "",
        client_secret: process.env.WORDPRESS_CLIENT_SECRET ?? "",
        redirect_uri: process.env.WORDPRESS_REDIRECT_URI ?? "",
        code: code,
        grant_type: "authorization_code",
      }),
    }
  );

  if (!response.ok) {
    return err("Failed to fetch access token");
  }

  const data = await response.json();
  return ok(data.access_token);
}
