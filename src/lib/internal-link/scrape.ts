import axios from "axios";
import * as cheerio from "cheerio";
import { Set as ImmutableSet, Set } from "immutable"; // Import Immutable.js Set
import * as puppeteer from "puppeteer";
import { URL } from "url";

// Define the patterns you want to scrape
// Product-related URLs
const productPatterns = [
  "/product",
  "/products",
  "/item",
  "/shop",
  "/store",
  "/catalog",
];

// About Us / Company Information
const aboutPatterns = [
  "/about",
  "/about-us",
  "/company",
  "/team",
  "/mission",
  "/history",
];

// Services / Offerings
const servicePatterns = [
  "/services",
  "/solutions",
  "/offerings",
  "/pricing",
  "/plans",
];

// Contact Information
const contactPatterns = [
  "/contact",
  "/contact-us",
  "/support",
  "/help",
  "/customer-support",
  "/get-in-touch",
  "/faq",
];

// Blog / Articles / News
const blogPatterns = [
  "/blog",
  "/news",
  "/article",
  "/updates",
  "/press",
  "/resources",
];

// Careers / Jobs
const careerPatterns = [
  "/careers",
  "/jobs",
  "/work-with-us",
  "/employment",
  "/join-us",
];

// Legal / Privacy
// const legalPatterns = [
//   "/privacy",
//   "/terms",
//   "/legal",
//   "/cookies",
//   "/disclaimer",
// ];

// Case Studies / Testimonials
const caseStudyPatterns = [
  "/case-studies",
  "/success-stories",
  "/testimonials",
  "/clients",
  "/partners",
];

// Documentation / Guides
const documentationPatterns = [
  "/docs",
  "/documentation",
  "/guides",
  "/how-to",
  "/manual",
];

// Downloads
const downloadPatterns = ["/downloads", "/resources/downloads", "/assets"];

// Events / Webinars
const eventPatterns = ["/events", "/webinars", "/conferences", "/workshops"];

// Portfolio / Projects
const portfolioPatterns = ["/portfolio", "/projects", "/works", "/showcase"];

const keyPatterns = [
  ...productPatterns,
  ...aboutPatterns,
  ...servicePatterns,
  ...contactPatterns,
  ...blogPatterns,
  ...careerPatterns,
  //   ...legalPatterns,
  ...caseStudyPatterns,
  ...documentationPatterns,
  ...downloadPatterns,
  ...eventPatterns,
  ...portfolioPatterns,
];

// Array of patterns to exclude
const excludPatterns = [
  "#", // Exclude URLs with fragment identifiers
  "terms-and-conditions",
  "privacy",
  "terms",
  "login",
];

// Add these constants at the top with other constants
const MAX_DEPTH = 3; // Maximum depth to crawl
const MAX_URLS = 150; // Maximum number of URLs to process
const RATE_LIMIT_MS = 1000; // Delay between requests in milliseconds

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
    ImmutableSet<string>()
  );
  console.log("Successfully crawled: ", visited.size, " URLs");
  console.log("URLs Found: ", visited.toArray());

  const sortedUrls = sortUrlsByDepth(visited.toArray());
  console.log("Sorted URLs");
  // If the number of URLs exceeds the limit, return only the first X URLs
  return sortedUrls.slice(0, limit);
}

// Function to check if a URL should be excluded based on exclusion patterns
function shouldBeExcludedUrl(url: string): boolean {
  return excludPatterns.some((pattern) => url.endsWith(pattern));
}

// Function to normalize URLs by converting `http` to `https` and remove trailing slash
function normalizeUrl(url: string): string {
  const secureUrl = url.startsWith("http://")
    ? url.replace("http://", "https://")
    : url;

  // Remove trailing slash unless it's the root URL
  const trimmedUrl = secureUrl.endsWith("/")
    ? secureUrl.slice(0, -1)
    : secureUrl;

  // Convert to lowercase
  return trimmedUrl;
}

// Function to crawl a page + gather all links matching key patterns
export async function crawl(
  url: string,
  domain: string,
  visited: ImmutableSet<string> = ImmutableSet<string>(),
  depth: number = 3
): Promise<ImmutableSet<string>> {
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
    // Immutable operation: always reassign the result to `visited`
    visited = visited.add(url); // Add to the immutable set

    // Add rate limiting
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));

    // Fetch the page content
    const response = await axios.get(url);
    const html = response.data;

    // Parse the HTML and extract links
    const $ = cheerio.load(html);
    const links: string[] = [];

    // const element = $(".css-1xiconc");
    // // Find all <a> tags inside the selected element
    // const lis = element.find("a");

    // console.log("lis: ", lis.length);

    // // Loop through each <a> tag found and get its href attribute and text
    // lis.each((index, link) => {
    //   const href = $(link).attr("href");
    //   const text = $(link).text();
    //   console.log(`Link ${index + 1}:`, { href, text });
    // });

    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        const fullUrl = resolveUrl(url, href, domain);
        if (
          fullUrl &&
          !visited.has(fullUrl) &&
          new URL(fullUrl).hostname.includes(domain)
          // &&
          // isKeyUrl(fullUrl)
        ) {
          // console.log("FOUND 2: ", fullUrl);
          links.push(normalizeUrl(fullUrl)); // Normalize URLs before adding to the list
        }
      }
    });

    // Recursively crawl each key link and reassign the `visited` set to keep it immutable
    for (const link of links) {
      visited = await crawl(link, domain, visited, depth + 1); // Recursively update the immutable set
      // Break early if we hit the URL limit
      if (visited.size >= MAX_URLS) break;
    }

    return visited;
  } catch (error) {
    console.error(`Failed to crawl ${url}: ${error}`);
    return visited; // Return visited set even if there's an error
  }
}

// Helper function to resolve relative URLs to absolute URLs
function resolveUrl(base: string, href: string, domain: string): string | null {
  try {
    const fullUrl = new URL(href, base).href;
    // Check if the URL's hostname matches the domain
    const urlHostname = new URL(fullUrl).hostname;
    return fullUrl.startsWith("https") && urlHostname.includes(domain)
      ? fullUrl
      : null;
  } catch (e) {
    return null; // Ignore invalid URLs
  }
}

// Helper function to check if a URL matches any key patterns
function isKeyUrl(url: string): boolean {
  return keyPatterns.some((pattern) => url.includes(pattern));
}

/**
 * Function to calculate depth of a URL based on the number of path segments.
 * @param url
 * @returns depth of the URL
 */
function calculateDepth(url: string): number {
  // Remove the protocol and domain part and count the number of `/` in the path
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  return path.split("/").filter(Boolean).length + 1; // +1 for the domain itself
}

/**
 * Function to sort URLs by their depth.
 * Maybe there is a better way to sort it
 *
 * E.g. product apge is more important that pricing page or something like that
 * @param urls
 * @returns sorted array of URLs by depth
 */
function sortUrlsByDepth(urls: string[]): string[] {
  return urls.sort((a, b) => calculateDepth(a) - calculateDepth(b));
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
  visited: ImmutableSet<string> = ImmutableSet<string>(),
  depth: number = 0
): Promise<ImmutableSet<string>> {
  if (depth >= MAX_DEPTH || visited.size >= MAX_URLS) {
    return visited;
  }

  // Normalize the URL to `https` and check if it has already been visited
  url = normalizeUrl(url);
  if (visited.has(url) || shouldBeExcludedUrl(url)) {
    return visited;
  }

  try {
    visited = visited.add(url); // Add to the immutable set

    // Launch a headless browser with Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "/opt/render/project/puppeteer/chrome/linux-131.0.6778.85/chrome-linux64/chrome",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Navigate to the URL and wait for the page to load
    await page.goto(url, { waitUntil: "networkidle2" });

    // Get the full rendered HTML after JavaScript has executed
    const html = await page.content();

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Close the browser
    await browser.close();

    const links: string[] = [];

    // Find all <a> tags and extract URLs.
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        const fullUrl = resolveUrl(url, href, domain);

        if (
          fullUrl &&
          !visited.has(fullUrl) &&
          new URL(fullUrl).hostname.includes(domain)

          // &&
          // isKeyUrl(fullUrl)
        ) {
          console.log("FOUND: ", fullUrl);
          links.push(normalizeUrl(fullUrl));
        }
      }
    });

    for (const link of links) {
      console.log("Crawling: ", link);
      visited = await crawl(link, domain, visited, depth + 1);
      if (visited.size >= MAX_URLS) break;
    }

    console.log("Visited: ", visited.toArray());

    return visited;
  } catch (error) {
    console.error(`Failed to crawl ${url}: ${error}`);
    return visited;
  }
}

export function normalizeInputUrl(input: string): string {
  // Trim and lowercase
  input = input.trim().toLowerCase();

  // Remove existing protocol if present
  input = input.replace(/^(https?:\/\/)/, "");

  // Remove www. if present
  input = input.replace(/^www\./, "");

  // Split domain and potential path
  const parts = input.split("/");
  const domain = parts[0];
  const path = parts.slice(1).join("/");

  // Reconstruct URL
  let normalizedUrl = `https://${domain}`;

  // Add path if exists
  if (path) {
    normalizedUrl += `/${path}`;
  }

  return normalizedUrl;
}

// console.log("Starting to crawling...");
// Usage example
// const ans = await crawlImportantInternalLinks("wearetenet.com", 100);
// console.log("ANS: ", ans); // Print the final array of crawled URLs
