import { SupabaseClient } from "@supabase/supabase-js";
import { Result, err, isOk, ok } from "true-myth/result";
import pThrottle from "p-throttle";
import { outlineEnricher } from "./agents/outline-enricher.js";
import { querySuggestor } from "./agents/query-suggestor.js";
import { researcherSequential } from "./agents/researcher.js";
import { writer } from "./agents/writer.js";
import { EnrichedURL } from "./enrich-internal-links.js";
import { postFormatter } from "./post-formatter.js";
import { getSupabaseClient } from "./get-supabase-client.js";
import { extractFirstImageUrl } from "./utility/extractFirstImageUrl.js";
import { topicGenerator } from "./agents/topic-generator.js";

const throttledResearcherSequential = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_CALUDE_LLM) || 2, // Number of calls allowed per interval
  interval: 1000, // Interval in milliseconds
})(researcherSequential);

const throttledOutlineEnricher = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_CALUDE_LLM) || 2,
  interval: 1000,
})(outlineEnricher);

const throttledWriter = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_CALUDE_LLM) || 2,
  interval: 1000,
})(writer);

const throttledQuerySuggestor = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_OPENAI_LLM) || 5,
  interval: 1000,
})(querySuggestor);

const throttledPostFormatter = pThrottle({
  limit: Number(process.env.MAX_CONCURRENT_CALL_TO_OPENAI_LLM) || 5,
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
  keyword,
}: {
  projectId: string;
  inputTopic?: string;
  keyword?: string;
}): Promise<Result<string, string>> {
  // const action = (await taskManager(query)) ?? { object: { next: 'proceed' } };

  // if (action.object.next === 'inquire') {
  //   const inquiry = await inquire(query);
  //   return { type: 'inquiry', asnwer: inquiry };
  // }

  //

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { data: clientDetailsResponse, error: clientDetailsError } = await supabase
    .from("Project")
    .select("name,domain,background")
    .eq("id", projectId);

  if (clientDetailsError) {
    return err(`Error fetching client details: ${clientDetailsError.message}`);
  }

  const clientName: string | null = clientDetailsResponse?.at(0)?.name ?? null;
  const clientDomain: string | null = clientDetailsResponse?.at(0)?.domain ?? null;
  const clientBackground: string | null = clientDetailsResponse?.at(0)?.background ?? null;

  const { data: clientKeywords, error: clientKeywordsError } = await supabase
    .from("Keyword")
    .select("keyword")
    .eq("project_id", projectId);

  if (clientKeywordsError) {
    return err(`Error fetching client details: ${clientKeywordsError.message}`);
  }

  const clientKeywordsList: {keyword: string}[] | null = clientKeywords ?? [];

  const clientDetails = `Client name: ${clientName}\nClient domain: ${clientDomain}\nClient background: ${clientBackground}\nClient keywords: ${clientKeywordsList}`

  let topic=null
  if(inputTopic){
    topic=inputTopic
  }
  else if(keyword){
    const generatedTopic: Result<string,string> = await topicGenerator(keyword,clientDetails)
    if(generatedTopic.isErr){
      return err("Error in topic generation")
    }else{
      topic=generatedTopic.value
    }
  }
  else{
    return err("Kindly provide topic/keyword for blog post generation")
  }

  const outline: Result<string, string> = await throttledResearcherSequential(
    topic, clientDetails
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
    await throttledQuerySuggestor(`${clientDetails}\nBlog Topic for client: ${topic}`);

  if (relatedQueries.isErr) {
    return err(relatedQueries.error);
  }

  console.log("Related queries: ", relatedQueries.value);

  const finalPost: Result<string, string> = await throttledPostFormatter(
    `Topic: ${topic}\nArticle: ${article.value}\nRelated Topics: ${relatedQueries.value}`,
    "HTML"
  );

  if (finalPost.isErr) {
    return err(finalPost.error);
  }

  console.log(finalPost.value);

  const firstImageUrl = extractFirstImageUrl(finalPost.value);

  console.log(firstImageUrl);

  const { data: dataContentInsert, error: errorContentInsert } = await supabase
    .from("Content")
    .insert([
      {
        status: "draft",
        project_id: projectId,
        title: topic,
        image_url: firstImageUrl,
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
