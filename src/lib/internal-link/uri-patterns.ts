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

export const keyPatterns = [
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
export const excludPatterns = [
  "#", // Exclude URLs with fragment identifiers
  "terms-and-conditions",
  "termsandconditions",
  "privacy-policy",
  "privacypolicy",
  "privacy",
  "terms",
  "login",
];
