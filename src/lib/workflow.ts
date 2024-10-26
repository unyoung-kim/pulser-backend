import { Result, ok, err } from "true-myth/result";
import { querySuggestor } from "./agents/query-suggestor.js";
import { researcher } from "./agents/researcher.js";
import { writer } from "./agents/writer.js";

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
export async function workflow(query: string): Promise<Result<WorkflowResult,string>> {
  // const action = (await taskManager(query)) ?? { object: { next: 'proceed' } };

  // if (action.object.next === 'inquire') {
  //   const inquiry = await inquire(query);
  //   return { type: 'inquiry', asnwer: inquiry };
  // }

  //
  const outline: Result<string,string> = await researcher(query);

  if(outline.isErr) return err(outline.error)

  console.log("Outline: ", outline.value);

  // const {text: enrichedOutline } = await outline(outline);
  const article: Result<string,string> = await writer(outline.value);

  if(article.isErr) return err(article.error)

  console.log("Article: ", article.value);

  const relatedQueries: Result<{ query: string }[],string> = await querySuggestor(query);

  if(relatedQueries.isErr) return err(relatedQueries.error)

  return ok({answer: article.value, relatedQueries: relatedQueries.value});
}
