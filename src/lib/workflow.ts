import { querySuggestor } from "./agents/query-suggestor.js";
import { researcher } from "./agents/researcher.js";
import { writer } from "./agents/writer.js";

/**
 * Based on user query, generate a blog post
 *
 * 1) Researcher comes up with an outline
 * 2) Writer comes up with an article using the outline
 * @param query
 * @returns
 */
export async function workflow(query: string) {
  // const action = (await taskManager(query)) ?? { object: { next: 'proceed' } };

  // if (action.object.next === 'inquire') {
  //   const inquiry = await inquire(query);
  //   return { type: 'inquiry', asnwer: inquiry };
  // }

  //
  const { text: outline } = await researcher(query);

  console.log("Outline: ", outline);

  // const {text: enrichedOutline } = await outline(outline);
  const { text: article } = await writer(outline);

  console.log("Article: ", article);

  const { relatedQueries } = await querySuggestor(query);

  return {
    // type: 'result',
    answer: article,
    relatedQueries,
  };
}
