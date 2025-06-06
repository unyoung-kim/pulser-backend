import { SupabaseClient } from "@supabase/supabase-js";
import { Result, err, ok } from "true-myth/result";
import { outlineEnricher } from "../agents/outline-enricher.js";
import { researcherSequential } from "../agents/researcher.js";
import { writer } from "../agents/writer.js";
import { EnrichedURL } from "../internal-link/enrich-internal-links.js";
import { getSupabaseClient } from "../get-supabase-client.js";
import { postFormatterAndHumanizer } from "../post-formatter.js";
import { incrementUsageCredit } from "../supabase/usage.js";
import { extractFirstImageUrl } from "../utility/extractFirstImageUrl.js";

/**
 * Based on user query, generate a blog post
 *
 * 1) Researcher comes up with an outline
 * 2) Writer comes up with an article using the outline
 * @param query
 * @returns
 */
export async function workflowV2({
  projectId,
  inputTopic,
  keywordId,
  secondaryKeywords,
  instruction,
  length,
}: {
  projectId: string;
  inputTopic: string;
  length: "LONG" | "SHORT";
  keywordId?: string;
  secondaryKeywords?: string[];
  instruction?: string;
}): Promise<Result<string, string>> {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { data: projectData, error: projectError } = await supabase
    .from("Project")
    .select("name,domain,background,description,org_id")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return err(`Error fetching project details: ${projectError.message}`);
  }

  const projectName: string | null = projectData?.name ?? null;

  const projectBackground: Record<string, any> | null =
    projectData?.background ?? null;

  const clientDetails = `
  Client Information:
  - Name: ${projectName}
  - Background Information: ${JSON.stringify(projectBackground, null, 2)}
`.trim();

  const outline: Result<string, string> = await researcherSequential(
    inputTopic,
    clientDetails,
    length,
    secondaryKeywords,
    instruction
  );

  if (outline.isErr) {
    return err(outline.error);
  }

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

  console.log("Enriched URLs: ", enrichedURLs);

  const enrichedOutline: Result<string, string> =
    enrichedURLs.length === 0
      ? ok(outline.value)
      : await outlineEnricher(enrichedURLs, outline.value);

  if (enrichedOutline.isErr) {
    return err(enrichedOutline.error);
  }

  // await new Promise((resolve) => setTimeout(resolve, 60000));

  const article: Result<string, string> = await writer(
    enrichedOutline.value,
    length,
    secondaryKeywords
  );

  if (article.isErr) {
    return err(article.error);
  }

  console.log("Article: ", article.value);

  // const relatedQueries: Result<{ query: string }[], string> =
  //   await throttledQuerySuggestor(
  //     `${clientDetails}\nBlog Topic for client: ${inputTopic}`
  //   );

  // if (relatedQueries.isErr) {
  //   return err(relatedQueries.error);
  // }

  // console.log("Related queries: ", relatedQueries.value);

  const finalPost: Result<string, string> = await postFormatterAndHumanizer(
    `Topic: ${inputTopic}\nArticle: ${article.value}`,
    "HTML"
  );

  if (finalPost.isErr) {
    return err(finalPost.error);
  }

  console.log("Final post: " + finalPost.value);

  const firstImageUrl = extractFirstImageUrl(finalPost.value);

  const { data: dataContentInsert, error: errorContentInsert } = await supabase
    .from("Content")
    .insert([
      {
        status: "draft",
        project_id: projectId,
        title: inputTopic,
        image_url: firstImageUrl,
        keyword_id: keywordId,
      },
    ])
    .select();

  if (errorContentInsert) {
    return err(`Error saving content: ${errorContentInsert.message}`);
  }

  const id: string | null = dataContentInsert?.at(0)?.id ?? null;

  if (id == null || id.length == 0) {
    return err("Error fetching content id");
  }

  const { error: errorContentBodyInsert } = await supabase
    .from("ContentBody")
    .insert([
      {
        content_id: id,
        body: finalPost.value,
      },
    ]);

  if (errorContentBodyInsert) {
    return err(`Error saving content body: ${errorContentBodyInsert.message}`);
  }

  const incrementUsageCreditResult: Result<string, string> =
    await incrementUsageCredit(supabase, projectData?.org_id ?? "", "NORMAL");

  if (incrementUsageCreditResult.isErr) {
    return err(incrementUsageCreditResult.error);
  }

  return ok(finalPost.value);
}
