import { Result, ok, err } from "true-myth/result";
import { SupabaseClient } from '@supabase/supabase-js'
import { querySuggestor } from "./agents/query-suggestor.js";
import { researcher } from "./agents/researcher.js";
import { writer } from "./agents/writer.js";
import { outlineEnricher } from "./agents/outline-enricher.js";
import { getSupabaseClient } from "./get-supabase-client.js";
import { EnrichedURL } from "./enrich-internal-links.js";

export interface WorkflowResult{
  answer: string,
  relatedQueries: { query: string }[]
}

/**
 * Based on user query, generate a blog post
 *
 * 1) Researcher comes up with an outline
 * 2) Writer comes up with an article using the outline
 * @param query
 * @returns
 */
export async function workflow({ projectId, inputTopic }: { projectId: string; inputTopic?: string}): Promise<Result<WorkflowResult, string>> {
  // const action = (await taskManager(query)) ?? { object: { next: 'proceed' } };

  // if (action.object.next === 'inquire') {
  //   const inquiry = await inquire(query);
  //   return { type: 'inquiry', asnwer: inquiry };
  // }

  //

  const topic = inputTopic ?? "Topic generated from topic generator"

  const outline: Result<string,string> = await researcher(topic);

  if(outline.isErr) return err(outline.error)

  console.log("Outline: ", outline.value);


  const supabaseClient: Result<SupabaseClient,string> = getSupabaseClient();

  if(supabaseClient.isErr) return err(supabaseClient.error);

  const supabase= supabaseClient.value;

  const enrichedURLsResponse = await supabase
    .from('InternalLink')
    .select('url,summary')
    .eq('project_id',projectId)

    const enrichedURLs: EnrichedURL[] = (enrichedURLsResponse.data ?? []).map(item => ({
      id: item.url,
      summary: item.summary,
  }));

  const enrichedOutline: Result<string,string> = await outlineEnricher(enrichedURLs, outline.value);

  if(enrichedOutline.isErr) return err(enrichedOutline.error)

  console.log("Enriched outline: ", enrichedOutline.value);


  const article: Result<string,string> = await writer(enrichedOutline.value);

  if(article.isErr) return err(article.error)

  console.log("Article: ", article.value);
  

  const relatedQueries: Result<{ query: string }[],string> = await querySuggestor(topic);

  if(relatedQueries.isErr) return err(relatedQueries.error)

  return ok({answer: article.value, relatedQueries: relatedQueries.value});
}
