import { generateText } from "ai";
import { err, ok, Result } from "true-myth/result";
import {
  getThrottledClaudeSonnet,
  getThrottledGPT4o,
} from "../get-llm-models.js";
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
      model: await getThrottledClaudeSonnet(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: query,
      tools: getTools(),
      maxSteps: 10,
      maxTokens: 8000,
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

For the outline, make sure each sections has all the relevant external links and images associated and is written in markdown format. Output the outline inside <outline> tags.

<Rules>
Here are a few rules you must follow for the outline:

<General>
  1) Provide sufficient number of sections, sub-sections, images and links in the outline for a long blog post. Make sure images that you include provide value to the content or else don't include them.
  2) Use the client details provided in the input and web search results to promote client and its business/service in the blog post by following the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
  3) If relevant, make sure to compare and contrast products and services.
  4) Make sure to focus on the topic of the article and provide relevant information at the front of the article.
  5) Avoid being too salesy - this means that don't promote the client's products or services more than three times in the outline. 
</General>

  <Introduction>
  1) Make sure to provide a strong hook, intro to the blog post. The introduction should provide value instantly and mention about the pain point of the audience.
  2) If client background includes social proof, case studies, or credibility, make sure to include it in the introduction outline to build trust.
  3) Conduct research to find some unique insight about the topic like a quote, statistic, or a surprising fact and add it to the outline with the source.
  </Introduction>

  <Images & Links>
  1) Strictly analyze the images provided by the researcher. Add the main image before the introduction section, below the title, and make sure the image is relevant to the topic. The image should be generic and not include any logos or branding.
  2) You will be penalized if you add any additional images throughout the outline. Only acceptable case would be if the image is a graph or a chart that is informational.
  3) Make sure to include [Link: ...] and [Image: ...] for each section.
  4) You must include a main image in the introduction section.
  5) Include as many links / sources as many sources through out the article in the [Link: ...] format.
  6) Don't add image at the end of the outline.
  </Images & Links>
</Rules>

Think step by step before you come up with the outline.
`;

const FINAL_OUTLINE_PROMPT = `You are a professional SEO content writer. You will be given an outline of an SEO blog post.

You possess the ability to search for any information on the web.

Your task is to conduct further research on sub topics and enrich the outline by adding more details and links. Find where resources are lacking and conduct further research on those topics. Only return the outline with the additional research and don't include any explanation text about the task. Output the outline inside <outline> tags. Make sure to write in markdown format. 

RULES: 
1) Make sure introduction has multiple links. The introduction should provide value instantly and mention about the pain point of the audience. If there isn't already, make sure when conducting research to find some unique insight about the topic like a quote, statistic, or a surprising fact and add it to the outline with the source.
2) The outline should follow the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
3) Make sure to add links (only if valuable or insightful to the content) for subtopics that lack them in the given outline. You will be rewarded extra points for having multiple links per subtopic.
4) Return a full outline with all the sections, sub-sections and links without any ommissions from the given outline.
5) Focus research efforts on sections that most directly address the article's central topic. You will be rewarded extra points for this.
6)  Preserve images if they are already in the outline. Only add images if they are a graph or a chart.
7) Don't add image at the end of the outline.
`;

/**
 * This is a sequential approach to the researcher agent. This is a more deterministic approach and it also preserves more information from the initial research.
 * @param query
 * @returns
 */
export async function researcherSequential(
  topic: string,
  clientDetails: string
): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    // Generate the initial outline
    const firstOutline = await generateText({
      model: await getThrottledClaudeSonnet(),
      system: `${INITIAL_OUTLINE_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Topic: ${topic}\nClient Details: ${clientDetails}`,
      tools: {
        search: searchTool(),
        // retrieve: retrieveTool(),
      },
      temperature: 0.4,
      maxSteps: 3,
      maxTokens: 8000,
    });

    console.log("FIRST OUTLINE: ", firstOutline.text);

    const detailedOutline = await generateText({
      model: await getThrottledGPT4o(),
      system: `${FINAL_OUTLINE_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Initial Topic: ${topic}\nClient Details: ${clientDetails}\nOutline: ${firstOutline.text}`,
      tools: {
        subtopicSearch: searchSubTopicsTool(),
      },
      maxSteps: 2,
      temperature: 0,
      maxTokens: 8000,
    });

    console.log("DETAILED OUTLINE: ", detailedOutline.text);

    return ok(detailedOutline.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occured from the researcher");
  }
}
