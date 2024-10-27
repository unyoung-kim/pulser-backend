import { Result, ok, err } from "true-myth/result";
import { generateText } from "ai";
import { getModel } from "../get-model.js";
import { serpTool } from "../tools/serp-tool.js";

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given a keyword string and client details.
Using the provided inputs and tool, your task is to generate the most relevant topic for a 3000 worded SEO blog post for a client that has the highest likelihood of users engagement.

Follow below tips to generate the topic:
1. Keep it under 60 characters
2. Place main keywords at the beginning of the topic
3. Include the client's brand name when relevant 
4. Make it descriptive and clear
5. Use natural language, avoid keyword stuffing
6. Incorporate action words, encourage click with compelling CTAs
7. Optimize for specific, intent-driven phrases
8. Address user pain points, make title relevant to user needs
9. Use numbers or data whenever possible
10. Leverage emotional triggers, use power words like "Amazing" or "Essential"

Just output the title.
`;

export async function topicGenerator(keyword: string, clientDetails: string): Promise<Result<any,string>> {
    try {
        const currentDate = new Date().toLocaleString();

        const result = await generateText({
          model: getModel(),
          system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
          prompt: `Keyword: ${keyword}\nClient details: ${clientDetails}`,
          tools: { serp: serpTool() },
          maxSteps: 5,
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
