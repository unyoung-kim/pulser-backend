import { SupabaseClient } from "@supabase/supabase-js";
import Exa from "exa-js";
import pThrottle from "p-throttle";
import { err, ok, Result } from "true-myth/result";
import { getSupabaseClient } from "./get-supabase-client.js";
import { crawlImportantInternalLinks } from "./internal-link/scrape.js";

// Define the interface for enriched URL
export interface EnrichedURL {
  id: string;
  // highlights: string[];
  // text: string;
  summary: string;
}

// Define the interface for the response item
interface ExaResponseItem {
  id: string; // Adjust the type as necessary
  summary: string; // Adjust the type as necessary
}

const maxConcurrentCallToExa: number = 4;

export const throttledEnrichInternalLinks = pThrottle({
  limit: maxConcurrentCallToExa,
  interval: 1000, // Interval in milliseconds
})(enrichInternalLinks);

export async function enrichInternalLinks(
  projectId: string
): Promise<Result<EnrichedURL[], string>> {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { error: existingInternalLinkDeletingError } = await supabase
    .from("InternalLink")
    .delete()
    .eq("project_id", projectId);

  if (existingInternalLinkDeletingError) {
    return err(
      `Error in deleting existing internal links: ${existingInternalLinkDeletingError.message}`
    );
  }

  const { data: project, error: projectError } = await supabase
    .from("Project")
    .select("domain, background")
    .eq("id", projectId);

  if (projectError) {
    return err(`Error fetching project: ${projectError.message}`);
  }

  const domain: string | null =
    project?.at(0)?.background.basic.companyUrl ?? null;
  // const orgId: string = (project && project.length > 0) ? project.at(0).org_id : "";

  if (domain == null || domain.length == 0) {
    return err("Error fetching domain/domain unavailable");
  }

  const internalLinks: string[] = await crawlImportantInternalLinks(domain, 30);

  if (!internalLinks || internalLinks.length == 0) {
    return err("No internal links found from crawler");
  }

  console.log("Found ", internalLinks.length, " internal links for ", domain);

  // @ts-ignore
  const exa = new Exa(process.env.EXA_API_KEY ?? "");
  const response = await exa.getContents(internalLinks, {
    // text: { maxCharacters: 500 },
    summary: { query: "summarise the web page in maximum two sentences" },
    // highlights: { numSentences: 2 }
  });

  // Check if the response has results
  if (!response || !response.results || !Array.isArray(response.results)) {
    console.error("Invalid response from Exa API:", response);
    return err("Invalid response from Exa API");
  }

  const getEnrichedContents: EnrichedURL[] = response.results.map(
    (item: ExaResponseItem) => ({
      id: item.id, // Assuming 'id' corresponds to 'id' in EnrichedURL
      summary: item.summary,
    })
  );

  const { error: insertError } = await supabase.from("InternalLink").insert(
    getEnrichedContents.map((enrichedURL: EnrichedURL) => ({
      // org_id: orgId,
      project_id: projectId,
      url: enrichedURL.id,
      summary: enrichedURL.summary,
    }))
  );

  if (insertError) {
    return err(`Error inserting internal links: ${insertError.message}`);
  }

  console.log("Successfully enriched internal links for ", domain);

  return ok(getEnrichedContents);
}
