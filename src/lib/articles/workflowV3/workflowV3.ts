import { SupabaseClient } from "@supabase/supabase-js";
import { Result, err, ok } from "true-myth/result";
import { researcherV2 } from "../../agents/researcherV2.js";
import { fineTunedWriter, ftWriterEnhancer } from "../../agents/writer-ft.js";
import { getSupabaseClient } from "../../get-supabase-client.js";
import { EnrichedURL } from "../../internal-link/enrich-internal-links.js";
import { incrementUsageCredit } from "../../supabase/usage.js";
import { getClerkEmailId } from "../../utility/get-clerk-email-id.js";
import { sendEmail } from "../../utility/send-email.js";
/**
 * Based on user query, generate a blog post
 *
 * 1) Researcher comes up with an outline
 * 2) Writer comes up with an article using the outline
 * @param query
 * @returns
 */
export async function workflowV3({
  projectId,
  inputTopic,
  keywordId,
  instruction,
  secondaryKeywords,
  length,
}: {
  projectId: string;
  inputTopic: string;
  keywordId?: string;
  instruction?: string;
  secondaryKeywords?: string[];
  length?: "LONG" | "SHORT";
}): Promise<Result<{ contentId: string; content: string }, string>> {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { data: dataContentInsert, error: errorContentInsert } = await supabase
    .from("Content")
    .insert([
      {
        status: "generating",
        project_id: projectId,
        title: inputTopic,
        // image_url: firstImageUrl,
        keyword_id: keywordId,
      },
    ])
    .select();

  if (errorContentInsert) {
    return err(`Error creating content row: ${errorContentInsert.message}`);
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

  try {
    const projectName: string | null = project?.name ?? null;

    const projectBackground: Record<string, any> | null =
      project?.background ?? null;

    const clientDetails = `
  Client Information:
  - Name: ${projectName}
  - Background Information: ${JSON.stringify(projectBackground, null, 2)}
`.trim();

    const outline: Result<string, string> = await researcherV2(
      inputTopic,
      // clientDetails,
      instruction
    );

    if (outline.isErr) {
      throw new Error(outline.error);
    }

    console.log("outline: ", outline.value);

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

    //   const researchResults = await tavilySearch(inputTopic, 5, "basic");

    //   console.log("Research results: ", researchResults);

    // await new Promise((resolve) => setTimeout(resolve, 60000));
    const article: Result<string, string> = await fineTunedWriter(
      outline.value
    );

    console.log("article: ", article.isOk ? article.value : article.error);

    if (article.isErr) {
      throw new Error(article.error);
    }

    const enhancedArticle: Result<string, string> = await ftWriterEnhancer(
      article.value,
      clientDetails,
      enrichedURLs
    );

    if (enhancedArticle.isErr) {
      throw new Error(enhancedArticle.error);
    }

    console.log("enhancedArticle: ", enhancedArticle);
    console.log("enrichedURLs: ", enrichedURLs);

    console.log("enhancedArticle: ", enhancedArticle.value);

    //   const relatedQueries: Result<{ query: string }[], string> =
    //     await throttledQuerySuggestor(
    //       `${clientDetails}\nBlog Topic for client: ${inputTopic}`
    //     );

    // if (relatedQueries.isErr) {
    //   return err(relatedQueries.error);
    // }

    // console.log("Related queries: ", relatedQueries.value);

    //   const finalPost: Result<string, string> = await postFormatterAndHumanizer(
    //     `Topic: ${inputTopic}\nArticle: ${article.value}`,
    //     "HTML"
    //   );

    //   if (finalPost.isErr) {
    //     return err(finalPost.error);
    //   }

    //   console.log("Final post: " + finalPost.value);

    //   const firstImageUrl = extractFirstImageUrl(finalPost.value);

    const { error: errorContentBodyInsert } = await supabase
      .from("ContentBody")
      .insert([
        {
          content_id: contentId,
          body: enhancedArticle.value,
        },
      ]);

    if (errorContentBodyInsert) {
      throw new Error(
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

    const emailId: Result<string, string> = await getClerkEmailId(
      project?.org_id ?? ""
    );

    if (emailId.isErr) {
      console.error(`Error fetching email id: ${emailId.error}`);
    } else {
      await sendEmail(
        emailId.value,
        "Article generation successful",
        `Your article: ${inputTopic} has been generated`
      );
    }

    return ok({
      contentId: contentId,
      content: enhancedArticle.value,
    });
  } catch (error) {
    console.error("Error in workflowV3: ", error);
    const emailId: Result<string, string> = await getClerkEmailId(
      project?.org_id ?? ""
    );

    if (emailId.isErr) {
      console.error(`Error fetching email id: ${emailId.error}`);
    } else {
      await sendEmail(
        emailId.value,
        "Article generation failed",
        `Your article: ${inputTopic} has failed to generate`
      );
    }
    await supabase
      .from("Content")
      .update({
        status: "failed",
      })
      .eq("id", contentId);
    return err(`Error in workflowV3: ${error}`);
  }
}
