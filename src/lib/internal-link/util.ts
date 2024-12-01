export function extractDomain(url: string): string {
  // Trim and lowercase
  url = url.trim().toLowerCase();

  // Remove protocol (http, https, ftp, etc.)
  url = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Remove path, query parameters, and hash
  url = url.split("/")[0];
  url = url.split("?")[0];
  url = url.split("#")[0];

  return url;
}
