import axios from "axios";
import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
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
const RATE_LIMIT_MS = 1000; // Delay between requests in milliseconds

let browser: puppeteer.Browser | null = null;

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
  console.log("Puppeteer Cache Directory:", process.env.PUPPETEER_CACHE_DIR);

  const url: string = normalizeInputUrl(domain);

  // Immutable way: reassigning `visited` after every operation
  console.log("Starting to crawl...");
  const visited: Set<string> = await crawlWithPuppeteer(
    url,
    domain,
    new Set<string>()
  );
  console.log("Successfully crawled: ", visited.size, " URLs");

  const visitedArray = [...visited];
  console.log("URLs Found: ", visitedArray);

  const sortedUrls = sortUrlsByDepth(visitedArray);
  console.log("Sorted URLs");
  // If the number of URLs exceeds the limit, return only the first X URLs
  return sortedUrls.slice(0, limit);
}

// Function to crawl a page + gather all links matching key patterns
export async function crawl(
  url: string,
  domain: string,
  visited: Set<string> = new Set(),
  depth: number = 3
): Promise<Set<string>> {
  // Add depth check
  if (depth >= MAX_DEPTH || visited.size >= MAX_URLS) {
    return visited;
  }

  // Normalize the URL to `https` and check if it has already been visited
  url = normalizeUrl(url);
  if (visited.has(url) || shouldBeExcludedUrl(url)) {
    return visited;
  }

  try {
    visited.add(url); // Add to the set

    // Add rate limiting
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));

    // Fetch the page content
    const response = await axios.get(url);
    const html = response.data;

    // Parse the HTML and extract links
    const $ = cheerio.load(html);
    const links: string[] = [];

    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        const fullUrl = resolveUrl(url, href, domain);
        if (fullUrl && !visited.has(fullUrl)) {
          links.push(normalizeUrl(fullUrl)); // Normalize URLs before adding to the list
        }
      }
    });

    // Recursively crawl each key link
    for (const link of links) {
      await crawl(link, domain, visited, depth + 1);
      // Break early if we hit the URL limit
      if (visited.size >= MAX_URLS) break;
    }

    return visited;
  } catch (error) {
    console.error(`Failed to crawl ${url}: ${error}`);
    return visited; // Return visited set even if there's an error
  }
}

/**
 * Cheerio loads only the static HTML of the page, so we need to use Puppeteer to load the dynamic HTML.
 * @param url
 * @param domain
 * @param visited
 * @returns
 */
export async function crawlWithPuppeteer(
  url: string,
  domain: string,
  visited: Set<string> = new Set(),
  depth: number = 0
): Promise<Set<string>> {
  if (depth >= MAX_DEPTH || visited.size >= MAX_URLS) {
    return visited;
  }

  // Normalize the URL to `https` and check if it has already been visited
  url = normalizeUrl(url);
  if (visited.has(url) || shouldBeExcludedUrl(url)) {
    return visited;
  }

  // Launch a headless browser with Puppeteer
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      // executablePath:
      //   "/opt/render/project/puppeteer/chrome/linux-131.0.6778.85/chrome-linux64/chrome",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--single-process",
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-extensions",
        "--disable-sync",
        "--disable-translate",
        "--headless",
        "--disable-gl-drawing-for-tests",
        "--disable-popup-blocking",
        "--disable-threaded-animation",
        "--disable-threaded-scrolling",
        "--disable-in-process-stack-traces",
        "--disable-histograms",
        "--disable-logging",
        "--disable-web-security",
        "--disk-cache-size=0",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--no-zygote",
        "--ignore-certificate-errors",
        "--allow-running-insecure-content",
        "--enable-features=NetworkService,NetworkServiceInProcess",
        "--disable-component-extensions-with-background-pages",
        "--disable-component-update",
        "--disable-ipc-flooding-protection",
        "--force-color-profile=srgb",
        "--disable-translate-new-ux",
        "--disable-features=TranslateUI",
        "--disable-infobars",
      ],
    });
  }

  let page: puppeteer.Page | null = null;

  try {
    visited.add(url); // Add to the set

    page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    const links: string[] = [];

    try {
      // Navigate to the URL and wait for the page to load
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      // Get the full rendered HTML after JavaScript has executed
      const html = await page.content();

      await page.close(); // Close page to save memory
      page = null;

      // Load the HTML into Cheerio
      const $ = cheerio.load(html);

      // Find all <a> tags and extract URLs.
      $("a").each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
          const fullUrl = resolveUrl(url, href, domain);

          if (fullUrl && !visited.has(fullUrl)) {
            console.log("FOUND: ", fullUrl);
            links.push(normalizeUrl(fullUrl));
          }
        }
      });
    } catch (error) {
      console.warn(
        `Dynamic load failed for ${url}, Error: ${error}, trying static content...`
      );
      links.push(url);
      visited.clear();
    }

    for (const link of links) {
      console.log("Crawling: ", link);
      await crawl(link, domain, visited, depth + 1);
      if (visited.size >= MAX_URLS) break;
    }

    return visited;
  } catch (error) {
    console.error(`Failed to crawl ${url}: ${error}`);
    return visited;
  } finally {
    if (page) {
      await page.close(); // Ensure the page is closed in the finally block
      page = null;
    }
    if (depth === 0 && browser) {
      await browser.close();
      browser = null; // Reset browser for the next crawl session
    }
  }
}
