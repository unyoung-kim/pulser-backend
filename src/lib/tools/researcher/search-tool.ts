import { tool } from "ai";
import Exa from "exa-js";
import { multiSearchSchema, searchSchema } from "../../schema/search.js";
import {
  SearchResultImage,
  SearchResultItem,
  SearchResults,
  SearXNGResponse,
  SearXNGResult,
} from "../../types.js";

/**
 * Subtic reserach tool. This is basically calling tavily for multiple topics.
 *
 * Use this so that we can enrich our research from the initial outline.
 */
export const searchSubTopicsTool = () =>
  tool({
    description: "Search the web for multiple sub-topics",
    parameters: multiSearchSchema,
    execute: async ({
      queries,
      // max_results,
      search_depth,
      include_domains,
      exclude_domains,
    }) => {
      console.log("QUERIES: ", queries);
      try {
        return await Promise.all(
          queries.map(async (query) => {
            return await tavilySearch(
              query,
              2, // max_results,
              "advanced",
              include_domains,
              exclude_domains
            );
          })
        );
      } catch (error) {
        throw new Error(`Search sub-topic tool error: ${error}`);
      }
    },
  });

export const searchTool = () =>
  tool({
    description: "Search the web for information",
    parameters: searchSchema,
    execute: async ({
      query,
      max_results,
      search_depth,
      include_domains,
      exclude_domains,
    }) => {
      // Use the parameters directly here
      let searchResult: SearchResults;
      const searchAPI =
        (process.env.SEARCH_API as "tavily" | "exa" | "searxng") ?? "tavily";

      const effectiveSearchDepth =
        searchAPI === "searxng" &&
        process.env.SEARXNG_DEFAULT_DEPTH === "advanced"
          ? "advanced"
          : search_depth ?? "basic";

      console.log(
        `Using search API: ${searchAPI}, Search Depth: ${effectiveSearchDepth}`
      );

      try {
        if (searchAPI === "searxng" && effectiveSearchDepth === "advanced") {
          // API route for advanced SearXNG search
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
          const response = await fetch(`${baseUrl}/api/advanced-search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: query,
              maxResults: 5,
              searchDepth: effectiveSearchDepth,
              includeDomains: include_domains,
              excludeDomains: exclude_domains,
            }),
          });
          if (!response.ok) {
            throw new Error(
              `Advanced search API error: ${response.status} ${response.statusText}`
            );
          }
          searchResult = await response.json();
        } else {
          searchResult = await (searchAPI === "tavily"
            ? tavilySearchWithRawContent
            : searchAPI === "exa"
            ? exaSearch
            : searxngSearch)(
            query,
            max_results,
            effectiveSearchDepth === "advanced" ? "advanced" : "basic",
            include_domains,
            exclude_domains
          );
        }
      } catch (error) {
        throw new Error(`Search tool error: ${error}`);
      }

      console.log("SEARCH RESULT: ", searchResult);

      return searchResult;
    },
  });

async function tavilySearch(
  query: string,
  maxResults: number = 5,
  searchDepth: "basic" | "advanced" = "basic",
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<SearchResults> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set in the environment variables");
  }
  const includeImageDescriptions = false;
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      search_depth: searchDepth,
      include_images: false,
      include_image_descriptions: includeImageDescriptions,
      include_answers: true,
      include_domains: includeDomains,
      exclude_domains: excludeDomains,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Tavily API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const processedImages = includeImageDescriptions
    ? data.images
        .map(({ url, description }: { url: string; description: string }) => ({
          url: sanitizeUrl(url),
          description,
        }))
        .filter(
          (
            image: SearchResultImage
          ): image is { url: string; description: string } =>
            typeof image === "object" &&
            image.description !== undefined &&
            image.description !== ""
        )
    : data.images.map((url: string) => sanitizeUrl(url));

  return {
    ...data,
    images: processedImages,
  };
}

async function tavilySearchWithRawContent(
  query: string,
  maxResults: number = 5,
  searchDepth: "basic" | "advanced" = "basic",
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<SearchResults> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set in the environment variables");
  }
  const includeImageDescriptions = false;
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      search_depth: searchDepth,
      include_images: false,
      include_image_descriptions: includeImageDescriptions,
      include_answers: true,
      include_domains: includeDomains,
      exclude_domains: excludeDomains,
      include_raw_content: true,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Tavily API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  const trimmedRawData = data.results.map(
    (result: {
      title: string;
      url: string;
      content: string;
      score: number;
      raw_content: string;
    }) => {
      return {
        ...result,
        raw_content: result.raw_content.substring(0, 16000),
      };
    }
  );
  const processedImages = includeImageDescriptions
    ? data.images
        .map(({ url, description }: { url: string; description: string }) => ({
          url: sanitizeUrl(url),
          description,
        }))
        .filter(
          (
            image: SearchResultImage
          ): image is { url: string; description: string } =>
            typeof image === "object" &&
            image.description !== undefined &&
            image.description !== ""
        )
    : data.images.map((url: string) => sanitizeUrl(url));

  return {
    ...data,
    results: trimmedRawData,
    images: processedImages,
  };
}

async function exaSearch(
  query: string,
  maxResults: number = 10,
  _searchDepth: string,
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<SearchResults> {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    throw new Error("EXA_API_KEY is not set in the environment variables");
  }

  // @ts-ignore
  const exa = new Exa(apiKey);
  const exaResults = await exa.searchAndContents(query, {
    highlights: true,
    numResults: maxResults,
    includeDomains,
    excludeDomains,
  });

  return {
    results: exaResults.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      content: result.highlight ?? result.text,
    })),
    query,
    images: [],
    number_of_results: exaResults.results.length,
  };
}

async function searxngSearch(
  query: string,
  maxResults: number = 10,
  searchDepth: string,
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<SearchResults> {
  const apiUrl = process.env.SEARXNG_API_URL;
  if (!apiUrl) {
    throw new Error("SEARXNG_API_URL is not set in the environment variables");
  }

  try {
    // Construct the URL with query parameters
    const url = new URL(`${apiUrl}/search`);
    url.searchParams.append("q", query);
    url.searchParams.append("format", "json");
    url.searchParams.append("categories", "general,images");

    // Apply search depth settings
    if (searchDepth === "advanced") {
      url.searchParams.append("time_range", "");
      url.searchParams.append("safesearch", "0");
      url.searchParams.append("engines", "google,bing,duckduckgo,wikipedia");
    } else {
      url.searchParams.append("time_range", "year");
      url.searchParams.append("safesearch", "1");
      url.searchParams.append("engines", "google,bing");
    }

    // Fetch results from SearXNG
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SearXNG API error (${response.status}):`, errorText);
      throw new Error(
        `SearXNG API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data: SearXNGResponse = await response.json();

    // Separate general results and image results, and limit to maxResults
    const generalResults = data.results
      .filter((result) => !result.img_src)
      .slice(0, maxResults);
    const imageResults = data.results
      .filter((result) => result.img_src)
      .slice(0, maxResults);

    // Format the results to match the expected SearchResults structure
    return {
      results: generalResults.map(
        (result: SearXNGResult): SearchResultItem => ({
          title: result.title,
          url: result.url,
          content: result.content,
        })
      ),
      query: data.query,
      images: imageResults
        .map((result) => {
          const imgSrc = result.img_src ?? "";
          return imgSrc.startsWith("http") ? imgSrc : `${apiUrl}${imgSrc}`;
        })
        .filter(Boolean),
      number_of_results: data.number_of_results,
    };
  } catch (error) {
    console.error("SearXNG API error:", error);
    throw error;
  }
}

export function sanitizeUrl(url: string): string {
  return url.replace(/\s+/g, "%20");
}
