import { Result, ok, err } from "true-myth/result";
import { generateText } from "ai";
import { getModel } from "../get-model.js";
import { serpTool } from "../tools/serp-tool.js";

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given a keyword string and client details. 
Using the provided inputs and tool, your task is to generate a highly relevant topic for a SEO blog post tailored for a client, optimized to engage users near the bottom or middle of the sales funnel.
You can utilize the Google Autocomplete API to fetch relevant, up-to-date topic suggestions that enhance SEO content generation.

Follow these tips to generate the topic:

1. Focus on Bottom-of-the-Funnel (BoFu) or Middle-of-the-Funnel (MoFu) strategies, using keywords that indicate strong purchase intent, like comparisons, alternatives, product categories, or solution-oriented phrases.
2. Keep the title under 60 characters.
3. Place the main keywords at the beginning of the title.
4. Make it descriptive, clear, and to-the-point. Use natural language.
5. Incorporate action words and compelling CTAs to increase clicks.
6. Optimize for specific, intent-driven phrases that answer user needs, pain points, or decision-making queries.
7. Use numbers, data, or other quantitative elements whenever possible.
8. Generate a list of engaging blog topics, then select the one most likely to attract high-intent visitors and leads for the business.

Only output the suggested title.
`;

export async function topicGenerator(keyword: string, clientDetails: string): Promise<Result<any,string>> {
    try {
        const currentDate = new Date().toLocaleString();

        const result = await generateText({
          model: getModel(),
          system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
          prompt: `Keyword: ${keyword}\nClient details: ${clientDetails}`,
          tools: { serp: serpTool() },
          maxSteps: 3,
        //   temperature: 1.0
        //   toolChoice: 'required'
        });
    
        console.log("Result: ", result);
    
        return ok(result.text);
    } 
    catch (error) {
        console.error("Error in topic generator:", error);
        return err("An error has occured from the topic generator")
    }
}
