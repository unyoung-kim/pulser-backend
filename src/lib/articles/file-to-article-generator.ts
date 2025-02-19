import { generateText } from "ai";
import { EnrichedURL } from "../internal-link/enrich-internal-links.js";
import { Result, err, ok } from "true-myth/result";
import { getThrottledGPT4o } from "../get-llm-models.js";

const SYSTEM_PROMPT = `
  You are a highly skilled SEO content writer with expertise in creating engaging and informative blog posts.
  
  Your task is to generate a well-structured blog post based on the following inputs:
  
  1. **Input Text**: The main content or ideas that need to be elaborated upon.
  2. **Client Details**: Information about the client, including their brand voice, target audience, and any specific messaging they want to convey.
  3. **Enriched Internal Links**: Relevant internal links that should be included to enhance the article's SEO and provide additional resources for readers.
  4. **Input Topic**: The primary topic or theme of the blog post that should guide the content creation.
  5. **User Instructions**: Any specific guidelines or requirements provided by the user, such as tone, style, or key points to cover.

  Ensure that the blog post is:
  - **SEO-Optimized**: Use relevant keywords naturally throughout the content.
  - **Engaging**: Write in a conversational tone that resonates with the target audience.
  - **Informative**: Provide valuable insights and information that address the readers' needs and questions.
  - **Well-Structured**: Organize the content with clear headings, subheadings, and bullet points where appropriate for better readability.

  Remember to maintain a consistent style and voice that aligns with the client's branding while ensuring the content is original and free of plagiarism.
`;

export const fileToArticleGenerator = async (
  text: string,
  clientDetails: string,
  enrichedURLs: EnrichedURL[],
  inputTopic?: string,
  instructions?: string
): Promise<Result<string, string>> => {
  try {
    const currentDate = new Date().toLocaleString();

    const result = await generateText({
      model: await getThrottledGPT4o(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Input text: ${text}\n Client details: ${clientDetails}\n Enriched URLs: ${enrichedURLs}\n Input topic: ${inputTopic}\n User instruction: ${instructions}`,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in fileToArticleGenerator:", error);
    return err("An error has occured from the fileToArticleGenerator");
  }
};
