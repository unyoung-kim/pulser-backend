import { Result, ok, err } from "true-myth/result";
import { generateText } from "ai";
import { getModel } from "../get-model.js";
import { serpTool } from "../tools/serp-tool.js";

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given a keyword string and client details.
Using the provided inputs and tool, your task is to generate the most relevant topic for a 3000 worded SEO blog post for a client that has the highest likelihood of users engagement.

Follow below tips to generate the topic:
1. Keep it under 60 characters
2. Each time generate a different 'topic' for the same 'keyword' and 'client details'. Maybe use tools to generate different results.
3. Place main keywords at the beginning of the topic
4. Include the client's brand name when relevant 
5. Make it descriptive and clear
6. Use natural language, avoid keyword stuffing
7. Incorporate action words, encourage click with compelling CTAs
8. Optimize for specific, intent-driven phrases
9. Address user pain points, make title relevant to user needs
10. Use numbers or data whenever possible
11. Leverage emotional triggers, use power words like "Amazing" or "Essential"

Just output the title.
`;

const angles = [
    "Suggest a unique angle",
    "Consider a common approach",
    "Explore a controversial perspective",
    "Focus on user pain points",
    "Highlight recent trends",
    "Use a data-driven approach",
    "Emphasize actionable tips",
    "Include expert opinions",
    "Compare different strategies",
    "Address common misconceptions",
    "Showcase case studies",
    "Dive into historical context",
    "Provide a step-by-step guide",
    "Analyze competitor strategies",
    "Discuss future predictions",
    "Integrate user testimonials",
    "Create a pros and cons list",
    "Outline common mistakes",
    "Suggest tools and resources",
    "Incorporate visual data or infographics",
    "Provide a checklist for readers",
    "Encourage user-generated content",
    "Focus on sustainability and ethics",
    "Highlight cultural or regional differences",
    "Discuss legal considerations",
    "Explore technological advancements",
    "Suggest budget-friendly options",
    "Create a beginner's guide",
    "Outline expert interview insights",
    "Share relevant statistics",
    "Address seasonal trends",
    "Combine multiple niches or topics"
];

export async function topiGenerator(keyword: string, clientDetails: string): Promise<Result<any,string>> {
    try {
        const currentDate = new Date().toLocaleString();
        const randomAngle = angles[Math.floor(Math.random() * angles.length)];
        const systemPromptVariation = `${SYSTEM_PROMPT} ${randomAngle}. Current date and time: ${currentDate}`;

        const result = await generateText({
          model: getModel(),
          system: systemPromptVariation,
          prompt: `Keyword: ${keyword}\nClient details: ${clientDetails}`,
          tools: { serp: serpTool() },
          maxSteps: 5,
          temperature: 1.0
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
