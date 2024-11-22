import { generateText } from "ai";
import { Result, err, ok } from "true-myth/result";
import { getGPT4o, getModel } from "../get-model.js";

// const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
// For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
// If there are any images relevant to your answer, be sure to include them as well.
// Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`;

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given an detailed outline for an SEO blog post.

Your task is to write a very long and detailed blog post, of length strictly more than 3000 words, based on the outline.

Here are a couple things to note when writing a blog post:
1) Word count of the blog post must around 3500 words. Follow this very strictly.
2) Use all the images and links provided in the outline. Links should be embedded naturally with the right anchor text throughout the article.
3) Pay particular attention to crafting the introduction. The introduction should provide value instantly and mention about the pain point of the audience. Keep the sentences short and concise.
4) Follow the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
5) Please generate text that avoids using formal or overly academic phrases such as 'it is worth noting,' 'furthermore,' 'consequently,' 'in terms of,' 'one may argue,' 'it is imperative,' 'this suggests that,' 'thus,' 'it is evident that,' 'notwithstanding,' 'pertaining to,' 'therein lies,' 'utilize,' 'be advised,' 'hence,' 'indicate,' 'facilitate,' 'subsequently,' 'moreover,' and 'it can be seen that.' Aim for a natural, conversational style that sounds like two friends talking at the coffee shop. Use direct, simple language and choose phrases that are commonly used in everyday speech. If a formal phrase is absolutely necessary for clarity or accuracy, you may include it, but otherwise, please prioritize making the text engaging, clear, and relatable.
6) When introducing a new product or concept, avoid using overly formal or forced phrases like "Meet X" or "Enter Y." Aim for a more natural and conversational approach.
  `;

export async function writer(outline: string): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: outline,
      maxTokens: 8000,
      temperature: 0.25,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occurred. Please try again.");
  }
}

export async function writerGPT(
  outline: string
): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getGPT4o(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: outline,
      maxTokens: 8000,
      temperature: 1,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occurred. Please try again.");
  }
}
