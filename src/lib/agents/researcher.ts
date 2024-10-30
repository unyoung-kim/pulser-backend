import { generateText } from "ai";
import { err, ok, Result } from "true-myth/result";
import { getModel } from "../get-model.js";
import { getTools } from "../tools/researcher/get-tools.js";
import {
  searchSubTopicsTool,
  searchTool,
} from "../tools/researcher/search-tool.js";

// const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
// For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
// If there are any images relevant to your answer, be sure to include them as well.
// Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`;

const SYSTEM_PROMPT = `As a professional seo expert, your task is to come up with a detailed outline for an SEO blog post for a client given a blog post topic and client details.

You possess the ability to search for any information on the web.

Come up with the initial outline from the topic and client details. Then, based on your outline created from the initial search, conduct further research on all the sub-topics to enrich the outline. If you are writing individual products or services, be sure to research them as well. 

For the outline, make sure each sections has all the relevant external links and images associated in the outline. Don't include any other text but the outline itself.

Here are a few rules you must follow for the outline:

  1) Provide sufficient number of sections, sub-sections, images and links in the outline for a very long blog post.
  2) Make sure to provide a strong hook, intro to the blog post. The introduction should provide value instantly and mention about the pain point of the audience.
  3) Use the client details provided in the input and web search results to promote client and its business/service in the blog post by following the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
  4) The outline should contain a main image below the title. In the introduction section, add four to five links/sources.
  5) Make sure to add images and external links for subtopics. Make sure to preserve/add as many external urls and images as possible.
  6) Instead of generating simple bullet points, if you have found a relevant information from the web, include it in the outline in a detail manner so that it retains as much meaningful information as possbile.
  7) If relevant, make sure to compare and contrast products and services.
  8) Again, make sure to conduct the initial research, come up with a basic outline, then conduct additional research on all the subtopics to enrich the outline.
  `;

export async function researcher(
  query: string
): Promise<Result<string, string>> {
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
    console.log("RESEARCHER RESULT: ", JSON.stringify(result, null, 2));
    // //
    // console.log("Tool results: ", JSON.stringify(toolResults, null, 2));

    return ok(result.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occured from the researcher");
  }
}

const INITIAL_OUTLINE_PROMPT = `As a professional seo expert, your task is to come up with a detailed outline for an SEO blog post for a client given a blog post topic and client details.

You possess the ability to search for any information on the web.

Conduct a deep research on the topic. Then, come up with the initial outline of the blog post based on your research.

For the outline, make sure each sections has all the relevant external links and images associated in the outline. Output the outline inside <outline> tags.

Here are a few rules you must follow for the outline:

  1) Provide sufficient number of sections, sub-sections, images and links in the outline for a very long blog post.
  2) Make sure to provide a strong hook, intro to the blog post. The introduction should provide value instantly and mention about the pain point of the audience.
  3) Use the client details provided in the input and web search results to promote client and its business/service in the blog post by following the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
  4) The outline should contain a main image below the title. 
  5) If relevant, make sure to compare and contrast products and services.
  6) For each section, add actual images and as many real links from the research in the format of [Link: ...] and [Image: ...]
`;

const FINAL_OUTLINE_PROMPT = `You will be given an outline of an SEO blog post.

You possess the ability to search for any information on the web.

Your task is to conduct further research on sub topics and enrich the outline by adding more details, images and links. Find where resources are lacking and conduct further research on those topics. Only return the outline with the additional research and don't include any explanation text about the task. Output the outline inside <outline> tags.

Here are a few rules you must follow:

1) Make sure introduction has multiple links. The introduction should provide value instantly and mention about the pain point of the audience. Make sure when conducting research to find some unique insight about the topic like a quote, statistic, or a surprising fact and add it to the outline with the link.
2) The outline should follow the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
3) Make sure to add images and links for subtopics that lack them in the given outline. You will be rewarded extra points for having multiple links per subtopic.
4) Preserve all of images and links previously provided in the outline. If you have found detailed and useful information, enrich the outline with it. 
5) Return a full outline with all the sections, sub-sections, images and links without any ommissions from the given outline.
`;

/**
 * This is a sequential approach to the researcher agent. This is a more deterministic approach and it also preserves more information from the initial research.
 * @param query
 * @returns
 */
export async function researcherSequential(
  query: string
): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    // Generate the initial outline
    const firstOutline = await generateText({
      model: getModel(),
      system: `${INITIAL_OUTLINE_PROMPT} Current date and time: ${currentDate}`,
      prompt: query,
      tools: {
        search: searchTool(),
        // retrieve: retrieveTool(),
      },
      maxSteps: 3,
    });

    const detailedOutline = await generateText({
      model: getModel(),
      system: `${FINAL_OUTLINE_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Initial query: ${query}\n\ Outline: ${firstOutline.text}`,
      tools: {
        subtopicSearch: searchSubTopicsTool(),
      },
      maxSteps: 3,
      temperature: 0,
    });

    return ok(detailedOutline.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occured from the researcher");
  }
}
