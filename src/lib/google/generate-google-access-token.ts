import { google } from "googleapis";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { SupabaseClient } from "@supabase/supabase-js";

export const generateGoogleAccessToken = async (
  projectId: string,
  code: string
): Promise<Result<string, string>> => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID ?? "",
    process.env.GOOGLE_CLIENT_SECRET ?? "",
    process.env.GOOGLE_REDIRECT_URI ?? ""
  );
  const { tokens } = await oAuth2Client.getToken(code);

  let google_refresh_token = tokens.refresh_token;
  const google_access_token = tokens.access_token;
  const google_token_expiry_date = tokens.expiry_date;

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  if (!google_refresh_token) {
    // Fetch existing refresh_token from the database
    const { data: existingTokenData, error: fetchError } = await supabase
      .from("Token")
      .select("google_refresh_token")
      .eq("project_id", projectId)
      .single();

    if (fetchError || !existingTokenData?.google_refresh_token) {
      return err(
        "Missing refresh_token and unable to retrieve an existing one"
      );
    }

    google_refresh_token = existingTokenData.google_refresh_token;
  }

  if (!google_access_token || !google_token_expiry_date) {
    return err("Error getting valid tokens");
  }

  const { error: tokenError } = await supabase.from("Token").upsert(
    {
      project_id: projectId,
      google_refresh_token,
      google_access_token,
      google_token_expiry_date,
    },
    { onConflict: "project_id" }
  );

  if (tokenError) {
    return ok("Error inserting/updating google tokens in database");
  }

  return ok("Authentication token generation successful");
};
