import { excludPatterns, keyPatterns } from "./uri-patterns.js";

// Function to check if a URL should be excluded based on exclusion patterns
export const shouldBeExcludedUrl = (url: string): boolean => {
  return excludPatterns.some((pattern) => url.endsWith(pattern));
};

// Function to normalize URLs by converting `http` to `https` and remove trailing slash
export const normalizeUrl = (url: string): string => {
  const secureUrl = url.startsWith("http://")
    ? url.replace("http://", "https://")
    : url;

  // Remove trailing slash unless it's the root URL
  const trimmedUrl = secureUrl.endsWith("/")
    ? secureUrl.slice(0, -1)
    : secureUrl;

  // Convert to lowercase
  return trimmedUrl;
};

// Helper function to resolve relative URLs to absolute URLs
export const resolveUrl = (
  base: string,
  href: string,
  domain: string
): string | null => {
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
};

// Helper function to check if a URL matches any key patterns
export const isKeyUrl = (url: string): boolean => {
  return keyPatterns.some((pattern) => url.includes(pattern));
};

/**
 * Function to calculate depth of a URL based on the number of path segments.
 * @param url
 * @returns depth of the URL
 */
export const calculateDepth = (url: string): number => {
  // Remove the protocol and domain part and count the number of `/` in the path
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  return path.split("/").filter(Boolean).length + 1; // +1 for the domain itself
};

/**
 * Function to sort URLs by their depth.
 * Maybe there is a better way to sort it
 *
 * E.g. product apge is more important that pricing page or something like that
 * @param urls
 * @returns sorted array of URLs by depth
 */
export const sortUrlsByDepth = (urls: string[]): string[] => {
  return urls.sort((a, b) => calculateDepth(a) - calculateDepth(b));
};

export const normalizeInputUrl = (input: string): string => {
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
};

export const args: string[] = [
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
  // Add these new memory-specific flags
  '--js-flags="--max-old-space-size=2048"', // Limit Chrome's memory usage
  "--memory-pressure-off",
  "--disable-dev-shm-usage",
  "--disable-background-timer-throttling",
  "--disable-renderer-backgrounding",
];
