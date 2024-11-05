import { SupabaseClient } from "@supabase/supabase-js";
import { Result, err, ok } from "true-myth/result";
import pThrottle from 'p-throttle';
import { outlineEnricher } from "./agents/outline-enricher.js";
import { querySuggestor } from "./agents/query-suggestor.js";
import { researcherSequential } from "./agents/researcher.js";
import { writer } from "./agents/writer.js";
import { EnrichedURL } from "./enrich-internal-links.js";
import { postFormatter } from "./post-formatter.js";
import { getSupabaseClient } from "./get-supabase-client.js";
import { extractFirstImageUrl } from "./utility/extractFirstImageUrl.js";


const throttledResearcherSequential = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_CALUDE_LLM) ?? 2, // Number of calls allowed per interval
  interval: 1000, // Interval in milliseconds
})(researcherSequential);

const throttledOutlineEnricher = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_CALUDE_LLM) ?? 2,
  interval: 1000,
})(outlineEnricher);

const throttledWriter = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_CALUDE_LLM) ?? 2,
  interval: 1000,
})(writer);

const throttledQuerySuggestor = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_OPENAI_LLM) ?? 5,
  interval: 1000,
})(querySuggestor);

const throttledPostFormatter = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_OPENAI_LLM) ?? 5,
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
}: {
  projectId: string;
  inputTopic?: string;
}): Promise<Result<string, string>> {
  // const action = (await taskManager(query)) ?? { object: { next: 'proceed' } };

  // if (action.object.next === 'inquire') {
  //   const inquiry = await inquire(query);
  //   return { type: 'inquiry', asnwer: inquiry };
  // }

  //

  const topic = inputTopic ?? "Topic generated from topic generator"; // Leaving it as it is for now as we still need to figure out how to generate keywords

  // Here researcher should take client details as input as well but keeping a single parameter for now for testing
  const outline: Result<string, string> = await throttledResearcherSequential(topic);

  if (outline.isErr) {
    return err(outline.error);
  }

  console.log("Outline: ", outline.value);

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

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

  const enrichedOutline: Result<string, string> = await throttledOutlineEnricher(
    enrichedURLs,
    outline.value
  );

  if (enrichedOutline.isErr) {
    return err(enrichedOutline.error);
  }

  console.log("Enriched outline: ", enrichedOutline.value);

  const article: Result<string, string> = await throttledWriter(enrichedOutline.value);

  if (article.isErr) {
    return err(article.error);
  }

  console.log("Article: ", article.value);

  const relatedQueries: Result<{ query: string }[], string> = await throttledQuerySuggestor(topic);

  if (relatedQueries.isErr) {
    return err(relatedQueries.error);
  }

  console.log("Related queries: ", relatedQueries.value);

  
  const finalPost: Result<string,string> = await throttledPostFormatter(`Topic: ${topic}\nArticle: ${article.value}\nRelated Topics: ${relatedQueries.value}`, 'HTML') 

  if(finalPost.isErr){
    return err(finalPost.error)
  }

  console.log(finalPost.value)

  const firstImageUrl = extractFirstImageUrl(finalPost.value);

  console.log(firstImageUrl);

  const { data: dataContentInsert, error: errorContentInsert } = await supabase
        .from('Content')
        .insert([{
          "status": "draft",
          "project_id": projectId,
          "title": topic,
          "image_url": firstImageUrl
        },])
        .select()

  if (errorContentInsert) {
    return err(`Error saving content: ${errorContentInsert.message}`);
  }
  
  const id: string | null = dataContentInsert?.at(0)?.id ?? null;

  if(id==null || id.length==0){
    return err("Error fetching content id")
  }

  const { error: errorContentBodyInsert } = await supabase
        .from('ContentBody')
        .insert([{
          "content_id": id,
          "body": finalPost.value,
        },])

  if (errorContentBodyInsert) {
    return err(`Error saving content body: ${errorContentBodyInsert.message}`);
  }

  return ok(finalPost.value);
}
