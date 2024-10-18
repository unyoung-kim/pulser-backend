import { taskManager } from "./agents/task-manager";
import { inquire } from "./agents/inquire";
import { researcher } from "./agents/researcher";
import { querySuggestor } from "./agents/query-suggestor";

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