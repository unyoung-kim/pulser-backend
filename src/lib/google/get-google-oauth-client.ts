import { google } from "googleapis";
import { Result } from "true-myth";
import { getSupabaseClient } from "../get-supabase-client.js";
import { err, ok } from "true-myth/result";
import { SupabaseClient } from "@supabase/supabase-js";
import { OAuth2Client } from "google-auth-library";

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

  let accessToken = googleTokenData.google_access_token;
  const refreshToken = googleTokenData.google_refresh_token;
  let expiryDate = googleTokenData.google_token_expiry_date;

  if (!accessToken || !refreshToken || !expiryDate) {
    return err("Error fetching google access token for this projectId");
  }

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

      accessToken = credentials.access_token;
      expiryDate = credentials.expiry_date;
      if (!accessToken || !expiryDate) {
        return err("Error: New token data is incomplete");
      }

      await supabase
        .from("Token")
        .update({
          google_access_token: accessToken,
          google_token_expiry_date: expiryDate,
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
