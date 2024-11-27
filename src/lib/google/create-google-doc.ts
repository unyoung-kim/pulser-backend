import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getGoogleOAuthClient } from "./get-google-oauth-client.js";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export const createGoogleDoc = async (
  filename: string,
  content: string,
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

    const docs = google.docs({ version: "v1", auth: googleOAuth2Client });

    // Create a new Google Doc
    const doc = await docs.documents.create({
      requestBody: {
        title: filename,
      },
    });

    const documentId = doc.data.documentId;
    if (!documentId) {
      return err("Error creating google document");
    }
    console.log(`Document created with ID: ${documentId}`);

    // Insert content
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              endOfSegmentLocation: {},
              text: content,
            },
          },
        ],
      },
    });

    return ok("Content uploaded to Google Doc successfully.");
  } catch (error) {
    return err(`Error creating or updating document: ${error}`);
  }
};
