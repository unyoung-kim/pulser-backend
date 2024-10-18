import { taskManager } from "./agents/task-manager.js";
import { inquire } from "./agents/inquire.js";
import { researcher } from "./agents/researcher.js";
import { querySuggestor } from "./agents/query-suggestor.js";

export async function workflow(query: string) {
    // const action = (await taskManager(query)) ?? { object: { next: 'proceed' } };
  
    // if (action.object.next === 'inquire') {
    //   const inquiry = await inquire(query);
    //   return { type: 'inquiry', asnwer: inquiry };
    // }
  
    const { text } = await researcher(query);
  
    const { relatedQueries } = await querySuggestor(query);
  
    return {
      // type: 'result',
      answer: text,
      relatedQueries
    };
  }