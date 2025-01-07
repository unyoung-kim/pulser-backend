import axios from "axios";
import * as cheerio from "cheerio";
import { Set as ImSet } from "immutable";
import {
  normalizeInputUrl,
  normalizeUrl,
  resolveUrl,
  shouldBeExcludedUrl,
  sortUrlsByDepth,
} from "./utility-functions.js";

// Add these constants at the top with other constants
const MAX_DEPTH = 2; // Maximum depth to crawl
const MAX_URLS = 75; // Maximum number of URLs to process
const RATE_LIMIT_MS = 0; // Delay between requests in milliseconds
const CHUNK_SIZE = 10;

/**
 * Use me!
 * Entry point to start the crawling process and return an array
 * @param domain
 * @returns
 */
export async function crawlImportantInternalLinks(
  domain: string,
  limit: number
): Promise<string[]> {
  const startTime = performance.now();
  console.log("Crawling only with Cheerio...");

  const url: string = normalizeInputUrl(domain);

  // Immutable way: reassigning `visited` after every operation
  console.log("Starting to crawl...");
  const visited: ImSet<string> = await crawlWithCheerio(
    url,
    domain,
    ImSet<string>()
  );
  console.log("Successfully crawled: ", visited.size, " URLs");

  const visitedArray = visited.toArray();
  console.log("URLs Found: ", visitedArray);

  const sortedUrls = sortUrlsByDepth(visitedArray);
  console.log("Sorted URLs");

  const endTime = performance.now();
  console.log(
    `Crawling completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds`
  );

  // If the number of URLs exceeds the limit, return only the first X URLs
  return sortedUrls.slice(0, limit);
}

/**
 * Cheerio loads only the static HTML of the page, so we need to use Puppeteer to load the dynamic HTML.
 * @param url
 * @param domain
 * @param visited
 * @returns
 */
export async function crawlWithCheerio(
  url: string,
  domain: string,
  visited: ImSet<string> = ImSet<string>(),
  depth: number = 0
): Promise<ImSet<string>> {
  // Normalize URL first and remove any trailing slashes or fragments
  const normalizedUrl = normalizeUrl(url).replace(/\/$/, "");

  // Early return conditions - moved up for faster filtering
  if (
    depth >= MAX_DEPTH ||
    visited.size >= MAX_URLS ||
    visited.has(normalizedUrl) ||
    shouldBeExcludedUrl(normalizedUrl) ||
    !normalizedUrl.includes(domain) // Add domain check early
  ) {
    return visited;
  }

  // Add to visited set immediately
  visited = visited.add(normalizedUrl);
  console.log("Visiting new link: ", normalizedUrl);

  try {
    // Add delay between requests to prevent rate limiting
    if (RATE_LIMIT_MS > 0) {
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
    }

    const response = await axios.get(normalizedUrl);
    const $ = cheerio.load(response.data);

    // Collect and filter links first
    const validLinks = $("a")
      .map((_, element) => $(element).attr("href"))
      .get()
      .reduce((acc: string[], href) => {
        if (!href) return acc;
        const fullUrl = resolveUrl(normalizedUrl, href, domain);
        if (!fullUrl || !fullUrl.includes(domain)) return acc;

        const normalizedHref = normalizeUrl(fullUrl).replace(/\/$/, "");
        if (
          !visited.has(normalizedHref) &&
          !shouldBeExcludedUrl(normalizedHref)
        ) {
          acc.push(normalizedHref);
        }
        return acc;
      }, []);

    // Process links in chunks
    for (let i = 0; i < validLinks.length; i += CHUNK_SIZE) {
      const chunk = validLinks.slice(i, i + CHUNK_SIZE);
      const chunkResults = await Promise.all(
        chunk.map((link) => crawlWithCheerio(link, domain, visited, depth + 1))
      );

      // Merge results from this chunk
      chunkResults.forEach((result) => {
        visited = visited.merge(result);
      });

      // Optional: Log progress
      console.log(
        `Processed chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(
          validLinks.length / CHUNK_SIZE
        )}`
      );
    }
  } catch (error) {
    console.error(`Failed to crawl ${normalizedUrl}: ${error}`);
  }

  return visited;
}
