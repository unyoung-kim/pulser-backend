import { generateText } from "ai";
import { getModel } from "../get-model.js";
import { Result, ok, err } from "true-myth/result";
import { EnrichedURL } from "../enrich-internal-links.js";

// const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
// For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
// If there are any images relevant to your answer, be sure to include them as well.
// Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`;

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given:
1) a list of internal website URLs of a client along with a short summary of the corresponding web page
2) a detailed outline for an SEO blog post to be written for that client.

Your task is to enrich the outline with at least around 4 to 5 internal URLs. 
The output will be used to write a blog post of length strictly more than 3000 words, so try to preserve the structure of the original outline while being as much detailed as possible.

Make sure the internal links are embedded naturally with the right anchor text throughout the article.
  `;

export async function outlineEnricher(
  enrichedURLs: EnrichedURL[],
  outline: string
): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Enriched URLs: ${enrichedURLs}\nOutline: ${outline}`,
      maxTokens: 8000,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in outline enricher:", error);
    return err("An error has occured from the outline enricher");
  }
}
