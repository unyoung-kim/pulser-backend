import { SupabaseClient } from "@supabase/supabase-js";
import pThrottle from "p-throttle";
import { Result, err, ok } from "true-myth/result";
import { outlineEnricher } from "../agents/outline-enricher.js";
import { querySuggestor } from "../agents/query-suggestor.js";
import { researcherSequential } from "../agents/researcher.js";
import { writer } from "../agents/writer.js";
import { EnrichedURL } from "../enrich-internal-links.js";
import { getSupabaseClient } from "../get-supabase-client.js";
import { postFormatter, postFormatterAndHumanizer } from "../post-formatter.js";
import { extractFirstImageUrl } from "../utility/extractFirstImageUrl.js";

const maxConcurrentCallToClaudeLLM: number = 2;
const maxConcurrentCallToOpenAILLM: number = 4;

const throttledResearcherSequential = pThrottle({
  limit: maxConcurrentCallToClaudeLLM, // Number of calls allowed per interval
  interval: 1000, // Interval in milliseconds
})(researcherSequential);

const throttledOutlineEnricher = pThrottle({
  limit: maxConcurrentCallToClaudeLLM,
  interval: 1000,
})(outlineEnricher);

const throttledWriter = pThrottle({
  limit: maxConcurrentCallToClaudeLLM,
  interval: 1000,
})(writer);

const throttledQuerySuggestor = pThrottle({
  limit: maxConcurrentCallToOpenAILLM,
  interval: 1000,
})(querySuggestor);

export const throttledPostFormatterAndHumanizer = pThrottle({
  limit: maxConcurrentCallToOpenAILLM,
  interval: 1000,
})(postFormatterAndHumanizer);

export const throttledPostFormatter = pThrottle({
  limit: maxConcurrentCallToOpenAILLM,
  interval: 1000,
})(postFormatter);

/**
 * Based on user query, generate a blog post
 *
 * 1) Researcher comes up with an outline
 * 2) Writer comes up with an article using the outline
 * @param query
 * @returns
 */
export async function workflow({
  projectId,
  inputTopic,
  keywordId,
}: {
  projectId: string;
  inputTopic: string;
  keywordId?: string;
}): Promise<Result<string, string>> {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { data: clientDetailsResponse, error: clientDetailsError } =
    await supabase
      .from("Project")
      .select("name,domain,background,description")
      .eq("id", projectId);

  if (clientDetailsError) {
    return err(`Error fetching client details: ${clientDetailsError.message}`);
  }

  const clientName: string | null = clientDetailsResponse?.at(0)?.name ?? null;
  const clientDomain: string | null =
    clientDetailsResponse?.at(0)?.domain ?? null;
  const clientBackground: string | null =
    clientDetailsResponse?.at(0)?.background ?? null;
  const clientProjectDescription: string | null =
    clientDetailsResponse?.at(0)?.description ?? null;

  const clientDetails = `
  Client Information:
  - Name: ${clientName}
  - Domain: ${clientDomain}
  - Background: ${clientBackground}
  - Project Description: ${clientProjectDescription}
`.trim();

  const outline: Result<string, string> = await throttledResearcherSequential(
    inputTopic,
    clientDetails
  );

  if (outline.isErr) {
    return err(outline.error);
  }

  console.log("Outline: ", outline.value);

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

  const enrichedOutline: Result<string, string> =
    await throttledOutlineEnricher(enrichedURLs, outline.value);

  if (enrichedOutline.isErr) {
    return err(enrichedOutline.error);
  }

  console.log("Enriched outline: ", enrichedOutline.value);

  const article: Result<string, string> = await throttledWriter(
    enrichedOutline.value
  );

  if (article.isErr) {
    return err(article.error);
  }

  console.log("Article: ", article.value);

  const relatedQueries: Result<{ query: string }[], string> =
    await throttledQuerySuggestor(
      `${clientDetails}\nBlog Topic for client: ${inputTopic}`
    );

  if (relatedQueries.isErr) {
    return err(relatedQueries.error);
  }

  // console.log("Related queries: ", relatedQueries.value);

  const finalPost: Result<string, string> =
    await throttledPostFormatterAndHumanizer(
      `Topic: ${inputTopic}\nArticle: ${article.value}\nRelated Topics: ${relatedQueries.value}`,
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

  return ok(finalPost.value);
}
