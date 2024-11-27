import { Result, ok } from "true-myth/result";

export function getWordpressAuthUrl(): Result<string, string> {
  const authUrl = new URL(`https://public-api.wordpress.com/oauth2/authorize`);
  authUrl.searchParams.append(
    "client_id",
    process.env.WORDPRESS_CLIENT_ID ?? ""
  );
  authUrl.searchParams.append(
    "redirect_uri",
    process.env.WORDPRESS_REDIRECT_URI ?? ""
  );
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", process.env.WORDPRESS_SCOPE ?? "global");

  return ok(authUrl.toString());
}
