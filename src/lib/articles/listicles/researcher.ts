import { generateText, tool } from "ai";
import { err, ok, Result } from "true-myth/result";

import { z } from "zod";
import { getThrottledGPT4o } from "../../get-llm-models.js";
import { tavilySearchWithRawContent } from "../../tools/researcher/search-tool.js";
import { SearchResults } from "../../types.js";

const SYSTEM_PROMPT = `
You're an expert in creating detailed listicle outlines. Your task is to conduct thorough web research to generate the most accurate and comprehensive listicle outline possible. Follow these steps:

<Rules>
1. Refined Searches: Based on the initial search results, conduct further searches for each item in the list to gather in-depth information. If the listicle is about a specific location or region, include the location in the search query. (E.g. "7 best restaurants in Tokyo" => "[Restaurant Name] in Tokyo")
2. Strict Adherence to Number: If a specific number is provided (e.g., '7 best restaurants in Tokyo'), ensure the final outline contains exactly that number of items.
3. Detailed Outline: Each item in the list should be well-researched and include at least five to ten detailed bullet points each with 2 to 3 sentences to write a full article about. Each section should have enough information, enough to write stand alone full article about.
5. Include Links: Ensure that each list item has a relevant official website or a reputable source link.ß
6. Data Accuracy: Use Google search results for specific factual details like locations, prices, and links. Use AI-based search results for general descriptions and insights.
7. Refinement & Quality: The final outline should be polished, detailed, and structured in a way that makes it easy for a writer to expand into a full article.

</Rules>
`;

/**
 * This is a sequential approach to the researcher agent. This is a more deterministic approach and it also preserves more information from the initial research.
 * @param query
 * @returns
 */
export async function researcherListicle(
  topic: string
): Promise<Result<string, string>> {
  try {
    // Conduct the search with the search queries
    const searchResult: SearchResults = await tavilySearchWithRawContent(topic);

    // Now analyze the search result and figure out which further search queries to conduct and come up with an outline

    const currentDate = new Date().toLocaleString();
    // Generate the initial outline
    const outline = await generateText({
      model: await getThrottledGPT4o(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Topic: ${topic}\n Initial Search Result: ${JSON.stringify(
        searchResult,
        null,
        2
      )}`,
      tools: {
        search: searchSubTopicsTool(),
      },
      temperature: 0.6,
      maxSteps: 3,
      maxTokens: 8000,
    });

    return ok(outline.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occured from the researcher");
  }
}

/**
 * Subtic reserach tool. This is basically calling tavily for multiple topics.
 *
 * Use this so that we can enrich our research from the initial outline.
 */
export const searchSubTopicsTool = () =>
  tool({
    description:
      "Search the web for multiple sub-topics for a listicle article.",
    parameters: searchSchema,
    execute: async ({ queries, include_domains, exclude_domains }) => {
      try {
        const results: {
          aiSearchResult: SearchResults;
          googleSearchResult: Record<string, any> | undefined;
        }[] = await Promise.all(
          queries.map(async (query) => {
            const tavilyResult = await tavilySearchWithRawContent(
              query,
              2, // max_results,
              "advanced",
              include_domains,
              exclude_domains,
              8000
            );

            const exactResult = await serperSearch(query);

            return {
              aiSearchResult: tavilyResult,
              googleSearchResult: exactResult,
            };
          })
        );

        console.log("QUERIES: ", queries);
        return results;
      } catch (error) {
        throw new Error(`Search sub-topic tool error: ${error}`);
      }
    },
  });

export const searchSchema = z.object({
  queries: z
    .array(z.string())
    .describe(
      "If a specific number is provided in the topic for a listicle article, the number of queries should be the same. Each query should be specific enough to be able to find the exact content that it is looking for."
    ),
  max_results: z.coerce
    .number()
    .describe("The maximum number of results to return"),
  search_depth: z
    .string()
    .describe(
      'The depth of the search. Allowed values are "basic" or "advanced"'
    ),
  include_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically include in the search results. Default is None, which includes all domains."
    ),
  exclude_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically exclude from the search results. Default is None, which doesn't exclude any domains."
    ),
});

// This is to get the exact info from google search of the listicles
export const serperSearch = async (query: string) => {
  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const fullResponse = await response.json();

    // Create a filtered response with only the desired fields
    const filteredResponse = {
      searchParameters: fullResponse.searchParameters,
      knowledgeGraph: fullResponse.knowledgeGraph,
      organic: fullResponse.organic?.slice(0, 2) ?? [], // Get only first two organic results
    };

    return filteredResponse;
  } catch (error) {
    console.error("Image Search API error:", error);
  }
};
