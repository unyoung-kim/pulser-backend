import { google } from "googleapis";
import { getGoogleOAuthClient } from "./get-google-oauth-client.js";
import { createReadStream, promises as fsPromises } from "fs";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";

export const convertDocxAndUpload = async (
  file: any,
  filename: string,
  projectId: string
): Promise<Result<string, string>> => {
  try {
    // Get OAuth2 client
    const googleOAuth2ClientResult = await getGoogleOAuthClient(projectId);
    if (googleOAuth2ClientResult.isErr) {
      return err(
        `Error getting Google OAuth client: ${googleOAuth2ClientResult.error}`
      );
    }
    const googleOAuth2Client = googleOAuth2ClientResult.value;

    // Initialize Google Drive API
    const drive = google.drive({ version: "v3", auth: googleOAuth2Client });

    // Upload and convert the .docx file to Google Doc
    const response = await drive.files.create({
      requestBody: {
        name: filename,
        mimeType: "application/vnd.google-apps.document", // Target as Google Doc
      },
      media: {
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx MIME type
        body: createReadStream(file.path),
      },
      fields: "id",
    });

    const fileId = response.data.id;
    if (!fileId) {
      return err("Error uploading and converting .docx to Google Doc.");
    }

    // Clean up the uploaded file
    await fsPromises.unlink(file.path);

    return ok(fileId);
  } catch (error) {
    console.error("Error uploading .docx file:", error);

    // Attempt to clean up the uploaded file even if there's an error
    if (file && file.path) {
      await fsPromises.unlink(file.path).catch((unlinkError) => {
        console.error("Failed to delete temporary file:", unlinkError);
      });
    }
    return err(`Error uploading .docx file: ${String(error)}`);
  }
};
