import { generateText } from "ai";
import { getModel } from "../get-model.js";
import { getTools } from "../tools/researcher/get-tools.js";
import { ok, err, Result } from "true-myth/result"

// const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
// For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
// If there are any images relevant to your answer, be sure to include them as well.
// Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`;

const SYSTEM_PROMPT = `As a professional seo expert, your task is to come up with a detailed outline for an SEO blog post for a client given a blog post topic and client details.

You possess the ability to search for any information on the web.
For each blog post topic, utilize the search results to their fullest potential to provide additional information and assistance in your response.

Then, based on your outline created from the initial search, conduct further research on all the sub-topics to enrich the outline. If you are writing individual products or services, be sure to research them as well. 

For the outline, make sure each sections has all the relevant external links and images associated in the outline. Don't include any other text but the outline itself.

Here are a few rules to follow for the outline:

  1) Word count of the final blog post must be greater than 3000 words, so strictly provide sufficient number of sections, sub-sections, images and links in the outline considering this.
  2) Make sure to provide a strong hook, intro to the blog post.
  3) Pay particular attention to crafting the introduction. The introduction should provide value instantly and mention about the pain point of the audience.
  4) Use the client details provided in the input and web search results to promote client and its business/service in the blog post by following the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
  5) The outline should contain a main image below the title.
  6) Make sure to add images and external links for subtopics. Make sure to preserve/add as many external urls and images as possible.
  7) Instead of generating simple bullet points, if you have found a relevant information from the web, include it in the outline in a detail manner so that it retains as much meaningful information as possbile.
  8) If relevant, make sure to compare and contrast products and services.
  9) Again, make sure to conduct the initial research, come up with a basic outline, then conduct additional research on all the subtopics to enrich the outline.
  `;

export async function researcher(query: string): Promise<Result<string,string>> {
  try {
    // let toolResults: any[] = [];

    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: query,
      tools: getTools(),
      maxSteps: 10,
      maxTokens: 7000,
      // onStepFinish: async (event: {
      //   stepType: string;
      //   toolCalls?: any[];
      //   toolResults?: any;
      // }) => {
      //   if (event.stepType === "initial" && event.toolCalls) {
      //     toolResults = event.toolResults;
      //   }
      // },
    });

    // console.log("Result: ", result);
    console.log(JSON.stringify(result, null, 2));
    // //
    // console.log("Tool results: ", JSON.stringify(toolResults, null, 2));

    return ok(result.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occurred. Please try again.")
  }
}
