import axios from "axios";
import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import {
  normalizeInputUrl,
  normalizeUrl,
  resolveUrl,
  shouldBeExcludedUrl,
  sortUrlsByDepth,
  args,
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
      executablePath:
        "/opt/render/project/puppeteer/chrome/linux-131.0.6778.85/chrome-linux64/chrome",
      args,
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

    let links: string[] = [];

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

    // await crawl(links, domain, visited, depth + 1);
    depth += 1;

    while (links.length > 0 && depth < MAX_DEPTH && visited.size < MAX_URLS) {
      const size: number = links.length;
      const newLinks: string[] = [];
      for (let i = 0; i < size; i++) {
        let url: string = links[i];
        // check if it has already been visited
        if (visited.has(url) || shouldBeExcludedUrl(url)) {
          continue;
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

          $("a").each((_, element) => {
            const href = $(element).attr("href");
            if (href) {
              const fullUrl = resolveUrl(url, href, domain);
              if (fullUrl && !visited.has(fullUrl)) {
                newLinks.push(normalizeUrl(fullUrl)); // Normalize URLs before adding to the list
              }
            }
          });
        } catch (error) {
          console.error(`Failed to crawl ${url}: ${error}`);
        }
        if (visited.size >= MAX_URLS) {
          break;
        }
      }
      links = newLinks;
      depth += 1;
    }
  } catch (error) {
    console.error(`Failed to crawl: ${error}`);
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
  return visited;
}

// // Function to crawl a page + gather all links matching key patterns
// export async function crawl(
//   urls: string[],
//   domain: string,
//   visited: Set<string> = new Set(),
//   depth: number = 3
// ): Promise<Set<string>> {
//   while (urls.length > 0 && depth < MAX_DEPTH && visited.size < MAX_URLS) {
//     const size: number = urls.length;
//     const newLinks: string[] = [];
//     for (let i = 0; i < size; i++) {
//       let url: string = urls[i];
//       // check if it has already been visited
//       if (visited.has(url) || shouldBeExcludedUrl(url)) {
//         continue;
//       }

//       try {
//         visited.add(url); // Add to the set

//         // Add rate limiting
//         await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));

//         // Fetch the page content
//         const response = await axios.get(url);
//         const html = response.data;

//         // Parse the HTML and extract links
//         const $ = cheerio.load(html);

//         $("a").each((_, element) => {
//           const href = $(element).attr("href");
//           if (href) {
//             const fullUrl = resolveUrl(url, href, domain);
//             if (fullUrl && !visited.has(fullUrl)) {
//               newLinks.push(normalizeUrl(fullUrl)); // Normalize URLs before adding to the list
//             }
//           }
//         });
//       } catch (error) {
//         console.error(`Failed to crawl ${url}: ${error}`);
//       }
//       if (visited.size >= MAX_URLS) {
//         break;
//       }
//     }
//     urls = newLinks;
//     depth += 1;
//   }
//   return visited;
// }
