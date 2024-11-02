import { generateText } from "ai";
import { Result, err, ok } from "true-myth/result";
import { getModel } from "../get-model.js";

// const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
// For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
// If there are any images relevant to your answer, be sure to include them as well.
// Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`;

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given an detailed outline for an SEO blog post.

Your task is to write a blog post, of length strictly more than 3000 words, based on the outline.

Here are a couple things to note when writing a blog post:
1) Word count of the blog post must be greater than 3500 words. Follow this very strictly.
2) Use all the images and links provided in the outline. Links should be embedded naturally with the right anchor text throughout the article.
3) Pay particular attention to crafting the introduction. The introduction should provide value instantly and mention about the pain point of the audience. Keep the sentences short and concise.
4) Follow the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
5) Don't use over complex languages. Make sure it's around 8th grade reading level in a natural tone. Make this less cheesy and sound natural with simple sentence structures and words.
  `;

export async function writer(outline: string): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: outline,
      maxTokens: 8000,
    });

    console.log("Result: ", result);

    return ok(result.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occurred. Please try again.");
  }
}
