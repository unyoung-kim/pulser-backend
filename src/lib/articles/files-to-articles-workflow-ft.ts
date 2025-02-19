import { SupabaseClient } from "@supabase/supabase-js";
import { Result, err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { EnrichedURL } from "../internal-link/enrich-internal-links.js";
import { incrementUsageCredit } from "../supabase/usage.js";
import { sendEmail } from "../utility/send-email.js";
import { extractTextFromDocx } from "../utility/extract-text-from-docx.js";
import { promises as fsPromises } from "fs";
import { generateTitleFromInputText } from "./generate-title-from-input-text.js";
import { fileToArticleGeneratorFT } from "./file-to-article-generator-ft.js";
export async function filesToArticlesWorkflowFT(
  projectId: string,
  files?: any,
  texts?: string[],
  inputTopics?: string[],
  instructions?: string[]
): Promise<Result<string, string>> {
  console.log("Generating Articles from input files/texts..");

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  let articlesGeneratedSuccessfully: number = 0;

  files?.forEach(async (file: any, index: number) => {
    const text = file ? await extractTextFromDocx(file.path) : texts?.at(index);

    if (!text) {
      return err("Either file or text is required");
    }

    const title =
      inputTopics?.at(index) ?? (await generateTitleFromInputText(text));

    const { data: dataContentInsert, error: errorContentInsert } =
      await supabase
        .from("Content")
        .insert([
          {
            status: "generating",
            project_id: projectId,
            type: "FILETOARTICLE",
            title: title,
          },
        ])
        .select();

    if (errorContentInsert) {
      return err(`Error saving content: ${errorContentInsert.message}`);
    }

    const contentId: string | null = dataContentInsert?.at(0)?.id ?? null;

    if (contentId == null || contentId.length == 0) {
      return err("Error fetching created content id");
    }

    const { data: project, error: projectError } = await supabase
      .from("Project")
      .select("name,domain,background,description,org_id")
      .eq("id", projectId)
      .single();

    if (projectError) {
      return err(`Error fetching project details: ${projectError.message}`);
    }

    const projectName: string | null = project?.name ?? null;

    const projectBackground: Record<string, any> | null =
      project?.background ?? null;

    const clientDetails = `
    Client Information:
    - Name: ${projectName}
    - Background Information: ${JSON.stringify(projectBackground, null, 2)}
  `.trim();

    const enrichedURLsResponse = await supabase
      .from("InternalLink")
      .select("url,summary")
      .eq("project_id", projectId);

    const enrichedURLs: EnrichedURL[] = (enrichedURLsResponse.data ?? []).map(
      (item) => ({
        id: item.url,
        summary: item.summary,
      })
    );

    const article: Result<string, string> = await fileToArticleGeneratorFT(
      text,
      clientDetails,
      enrichedURLs,
      title,
      instructions?.at(index)
    );

    if (article.isErr) {
      return err(article.error);
    }

    const { error: errorContentBodyInsert } = await supabase
      .from("ContentBody")
      .insert([
        {
          content_id: contentId,
          body: article.value,
        },
      ]);

    if (errorContentBodyInsert) {
      return err(
        `Error saving content body: ${errorContentBodyInsert.message}`
      );
    }

    await supabase
      .from("Content")
      .update({
        status: "draft",
      })
      .eq("id", contentId);

    const incrementUsageCreditResult: Result<string, string> =
      await incrementUsageCredit(supabase, project?.org_id ?? "", "NORMAL");

    if (incrementUsageCreditResult.isErr) {
      console.error(
        `Error incrementing usage credit: ${incrementUsageCreditResult.error}`
      );
    }

    articlesGeneratedSuccessfully++;

    await fsPromises.unlink(file.path);
  });

  const { data: clerkUserIdData, error: clerkUserIdError } = await supabase
    .from("Project")
    .select("clerk_user_id")
    .eq("id", projectId)
    .single();

  if (clerkUserIdError) {
    console.error(`Error fetching clerk user id: ${clerkUserIdError.message}`);
    return err(`Error fetching clerk user id: ${clerkUserIdError.message}`);
  }

  const clerkUserId: string | null = clerkUserIdData?.clerk_user_id ?? null;

  if (clerkUserId) {
    await sendEmail(
      clerkUserId,
      "Your articles are ready!",
      `${articlesGeneratedSuccessfully} articles generated successfully`
    );
  }

  return ok("Files to articles workflow completed successfully");
}
