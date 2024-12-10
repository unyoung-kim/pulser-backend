import { generateText } from "ai";
import { Result, err, ok } from "true-myth/result";
import { EnrichedURL } from "../enrich-internal-links.js";
import { getThrottledCaludeSonnet20240620 } from "../get-llm-models.js";

// const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
// For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
// If there are any images relevant to your answer, be sure to include them as well.
// Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`;

const SYSTEM_PROMPT = `<Task>
As a professional SEO blog writer, you will be given:
1) a list of internal website URLs of a client along with a short summary of the corresponding web page
2) a detailed outline for an SEO blog post to be written for that client.

Your task is to enrich the outline so that it includes at least around 4 to 5 internal URLs.
</Task>

<Rules>
1. Do not remove links or images from the outline.
2. Make sure the internal links are embedded naturally with the right anchor text throughout the article.
3. Do not change the title of the outline.
4. Preserve as much of the original outline as possible while adding the internal links.
5. Don't include internal links like "privacy policy", "disclaimer", "terms of service", but one's like "contact us" are good.
</Rules>`;

export async function outlineEnricher(
  enrichedURLs: EnrichedURL[],
  outline: string
): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: await getThrottledCaludeSonnet20240620(),
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
