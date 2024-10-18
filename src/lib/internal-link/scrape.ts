import axios from "axios";
import * as cheerio from "cheerio";
import { Set as ImmutableSet } from "immutable"; // Import Immutable.js Set
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
];

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
  // Immutable way: reassigning `visited` after every operation
  const visited = await crawl(
    `https://${domain}`,
    domain,
    ImmutableSet<string>()
  );

  const sortedUrls = sortUrlsByDepth(visited.toArray());

  // If the number of URLs exceeds the limit, return only the first X URLs
  return sortedUrls.slice(0, limit);
}

// Function to check if a URL should be excluded based on exclusion patterns
function shouldBeExcludedUrl(url: string): boolean {
  return excludPatterns.some((pattern) => url.includes(pattern));
}

// Function to normalize URLs by converting `http` to `https`
function normalizeUrl(url: string): string {
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}

// Function to crawl a page + gather all links matching key patterns
async function crawl(
  url: string,
  domain: string,
  visited: ImmutableSet<string> = ImmutableSet<string>()
): Promise<ImmutableSet<string>> {
  // Normalize the URL to `https` and check if it has already been visited
  url = normalizeUrl(url);
  if (visited.has(url) || shouldBeExcludedUrl(url)) {
    return visited;
  }

  try {
    // Immutable operation: always reassign the result to `visited`
    visited = visited.add(url); // Add to the immutable set

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
        if (
          fullUrl &&
          !visited.has(fullUrl) &&
          fullUrl.includes(domain) &&
          isKeyUrl(fullUrl)
        ) {
          links.push(normalizeUrl(fullUrl)); // Normalize URLs before adding to the list
        }
      }
    });

    // Recursively crawl each key link and reassign the `visited` set to keep it immutable
    for (const link of links) {
      visited = await crawl(link, domain, visited); // Recursively update the immutable set
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
    return fullUrl.includes(domain) ? fullUrl : null;
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

// Usage example
// const ans = await crawlImportantInternalLinks("drinkag1.com", 100);
// console.log("ANS: ", ans); // Print the final array of crawled URLs
