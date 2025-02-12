import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().describe("The query to search for"),
  max_results: z.coerce
    .number()
    .describe("The maximum number of results to return"),
  search_depth: z
    .string()
    .describe(
      'The depth of the search. Allowed values are "basic" or "advanced"'
    ),
  include_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically include in the search results. Default is None, which includes all domains."
    ),
  exclude_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically exclude from the search results. Default is None, which doesn't exclude any domains."
    ),
});

export const multiSearchSchema = z.object({
  queries: z
    .array(z.string())
    .describe(
      "Exactly 5 subtopic queries to search for. Make sure to include a variety of queries to get a diverse set of results."
    ),
  max_results: z.coerce
    .number()
    .describe("The maximum number of results to return"),
  search_depth: z
    .string()
    .describe(
      'The depth of the search. Allowed values are "basic" or "advanced"'
    ),
  include_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically include in the search results. Default is None, which includes all domains."
    ),
  exclude_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically exclude from the search results. Default is None, which doesn't exclude any domains."
    ),
});

// Used for the researcher tool
export const multiSearchSchemaV2 = z.object({
  queries: z
    .array(z.string())
    .describe(
      "Exactly 3 queries to search for. 1) The topic given. 2) Interesting and relevant statistic that could be used in the introduction. 3) User instruction/outline if provided."
    ),
  max_results: z.coerce
    .number()
    .describe("The maximum number of results to return"),
  search_depth: z
    .string()
    .describe(
      'The depth of the search. Allowed values are "basic" or "advanced"'
    ),
  include_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically include in the search results. Default is None, which includes all domains."
    ),
  exclude_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically exclude from the search results. Default is None, which doesn't exclude any domains."
    ),
});
