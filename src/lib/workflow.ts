import { taskManager } from "./agents/task-manager.js";
import { inquire } from "./agents/inquire.js";
import { researcher } from "./agents/researcher.js";
import { researcherBackup } from "./agents/researcher-backup.js";
import { contentEngine } from "./agents/content-engine.js";
import { querySuggestor } from "./agents/query-suggestor.js";
import { combineLLMAndToolResults } from "./combineLLMAndToolResults.js"

export async function workflow(query: string) {
    // const action = (await taskManager(query)) ?? { object: { next: 'proceed' } };
  
    // if (action.object.next === 'inquire') {
    //   const inquiry = await inquire(query);
    //   return { type: 'inquiry', asnwer: inquiry };
    // }
  
    // const { text, images, results } = await researcher(query);
    const { text, images, results } = await researcherBackup(query)
    const result= await combineLLMAndToolResults({images, results, query})
    // const { result } = await contentEngine(text);
    const { relatedQueries } = await querySuggestor(query)
  
    return {
      // type: 'result',
      answer: result,
      // images,
      // results,
      relatedQueries
    };
  }