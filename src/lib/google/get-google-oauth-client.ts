import { google } from "googleapis";
import { Result } from "true-myth";
import { getSupabaseClient } from "../get-supabase-client.js";
import { err, ok } from "true-myth/result";
import { SupabaseClient } from "@supabase/supabase-js";
import { OAuth2Client } from "google-auth-library";
import { decrypt, encrypt } from "../utility/encrypt-and-decrypt-function.js";

export const getGoogleOAuthClient = async (
  projectId: string
): Promise<Result<OAuth2Client, string>> => {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { data: googleTokenData, error: googleTokenError } = await supabase
    .from("Token")
    .select("google_access_token,google_refresh_token,google_token_expiry_date")
    .eq("project_id", projectId)
    .single();

  if (googleTokenError) {
    return err(
      `Error fetching google access tokens: ${googleTokenError.message}`
    );
  }

  const encryptedAccessToken = googleTokenData.google_access_token;
  const encryptedRefreshToken = googleTokenData.google_refresh_token;
  const expiryDate = googleTokenData.google_token_expiry_date;

  if (!encryptedAccessToken || !encryptedRefreshToken || !expiryDate) {
    return err("Error fetching google access token for this projectId");
  }

  const accessToken = decrypt(encryptedAccessToken);
  const refreshToken = decrypt(encryptedRefreshToken);

  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URI
  ) {
    return err("Missing environment variables for Google OAuth configuration");
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  });

  if (expiryDate < Date.now() + 60 * 1000) {
    try {
      console.log("Access token expired. Attempting to refresh...");
      const { credentials } = await oAuth2Client.refreshAccessToken();

      if (!credentials?.access_token || !credentials?.expiry_date) {
        return err("Error: new token data is incomplete");
      }

      // Preserve the existing refresh_token if not returned
      credentials.refresh_token = credentials.refresh_token || refreshToken;

      const newEncryptedAccessToken = encrypt(credentials.access_token);
      const newExpiryDate = credentials.expiry_date;

      await supabase
        .from("Token")
        .update({
          google_access_token: newEncryptedAccessToken,
          google_token_expiry_date: newExpiryDate,
        })
        .eq("project_id", projectId);

      oAuth2Client.setCredentials(credentials);
      console.log("Access token refreshed successfully");
    } catch (error) {
      return err(`Error refreshing access token: ${(error as Error).message}`);
    }
  }

  return ok(oAuth2Client);
};
