import { generateText } from "ai";
import { getModel } from "../get-model.js";
import { getOutlineEnrichTools } from "../tools/outline-enricher/outline-enrich-tools.js";

const SYSTEM_PROMPT = `
You are a professional SEO content writer.

You have the capability to perform image and video search. 

Based on the provided outline, Identify sections that would benefit from additional visuals (images or videos) where they are missing.
  `;

export async function outlineEnricher(query: string) {
  try {
    let toolResults: any[] = [];

    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: query,
      tools: getOutlineEnrichTools(),
      maxSteps: 10,
      onStepFinish: async (event: {
        stepType: string;
        toolCalls?: any[];
        toolResults?: any;
      }) => {
        if (event.stepType === "initial" && event.toolCalls) {
          toolResults = event.toolResults;
        }
      },
    });

    // console.log("Result: ", result);
    console.log(JSON.stringify(result, null, 2));
    //
    console.log("Tool results: ", JSON.stringify(toolResults, null, 2));

    return { text: result.text };
  } catch (error) {
    console.error("Error in writer:", error);
    return {
      text: "An error has occurred. Please try again.",
    };
  }
}
