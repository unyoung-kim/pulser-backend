import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getGoogleOAuthClient } from "./get-google-oauth-client.js";

export const shareGoogleDoc = async (
  documentId: string,
  email: string,
  projectId: string
): Promise<Result<string, string>> => {
  try {
    const googleOAuth2ClientResult: Result<OAuth2Client, string> =
      await getGoogleOAuthClient(projectId);

    if (googleOAuth2ClientResult.isErr) {
      return ok(
        `Error getting Google OAuth client: ${googleOAuth2ClientResult.error}`
      );
    }

    const googleOAuth2Client = googleOAuth2ClientResult.value;

    const drive = google.drive({ version: "v3", auth: googleOAuth2Client });
    await drive.permissions.create({
      fileId: documentId,
      requestBody: {
        role: "writer", // Grant editing permissions
        type: "user", // Share with an individual user
        emailAddress: email,
        // sendNotificationEmail: false,
      },
    });

    return ok(`Document shared with ${email}`);
  } catch (error) {
    return err(`Error sharing document: ${error}`);
  }
};
