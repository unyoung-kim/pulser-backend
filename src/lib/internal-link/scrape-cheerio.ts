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
const MAX_DEPTH = 3; // Maximum depth to crawl
const MAX_URLS = 150; // Maximum number of URLs to process
const RATE_LIMIT_MS = 0; // Delay between requests in milliseconds

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
  // Normalize URL first
  const normalizedUrl = normalizeUrl(url);

  // Check all conditions before proceeding
  if (
    depth >= MAX_DEPTH ||
    visited.size >= MAX_URLS ||
    visited.has(normalizedUrl) ||
    shouldBeExcludedUrl(normalizedUrl)
  ) {
    return visited;
  }

  // Add to visited set immediately
  visited = visited.add(normalizedUrl);
  console.log("Visiting new link: ", normalizedUrl);

  try {
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
    const response = await axios.get(normalizedUrl);
    const $ = cheerio.load(response.data);

    let links = ImSet<string>();
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        const fullUrl = resolveUrl(normalizedUrl, href, domain);
        if (!fullUrl) return;
        const normalizedHref = normalizeUrl(fullUrl);
        if (
          !visited.has(normalizedHref) &&
          !links.has(normalizedHref) &&
          !shouldBeExcludedUrl(normalizedHref)
        ) {
          links = links.add(normalizedHref);
        }
      }
    });

    // Recursively crawl all found links
    for (const link of links) {
      visited = await crawlWithCheerio(link, domain, visited, depth + 1);
      if (visited.size >= MAX_URLS) break;
    }
  } catch (error) {
    console.error(`Failed to crawl ${normalizedUrl}: ${error}`);
  }

  return visited;
}
