import { generateText } from "ai";
import { getModel } from "../get-model.js";

// const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
// For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
// If there are any images relevant to your answer, be sure to include them as well.
// Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`;

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given an detailed outline for an SEO blog post.

Your task is to write a blog post based on the outline. that is around 2000 words long.

Here are a couple things to note when writing a blog post:
1) Make sure to provide a strong hook, intro to the blog post.
2) Pay particular attention to crafting the introduction. The introduction should provide value instantly and mention about the pain point of the audience.
3) Follow the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
4) Don't use over complex languages. Make sure it's around 8th grade reading level in a natural tone. 
5) Preserve all images in the correct place.
6. Make sure external links are embedded naturally with the right anchor text throughout the article.
  `;

export async function writer(outline: string) {
  try {
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: outline,
      maxTokens: 5000,
    });

    console.log("Result: ", result);

    return { text: result.text };
  } catch (error) {
    console.error("Error in researcher:", error);
    return {
      text: "An error has occurred. Please try again.",
    };
  }
}
