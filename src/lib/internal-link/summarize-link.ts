import pThrottle from "p-throttle";
import { err, Result } from "true-myth/result";
import { ok } from "true-myth/result";
import Exa from "exa-js";
import { EnrichedURL, ExaResponseItem } from "./enrich-internal-links.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "../get-supabase-client.js";

const summarizeLink = async (
  projectId: string,
  url: string
): Promise<Result<EnrichedURL, string>> => {
  // @ts-ignore
  const exa = new Exa(process.env.EXA_API_KEY ?? "");
  const response = await exa.getContents([url], {
    summary: { query: "summarise the web page in maximum two sentences" },
  });

  // Check if the response has results
  if (!response || !response.results || !Array.isArray(response.results)) {
    console.error("Invalid response from Exa API:", response);
    return err("Invalid response from Exa API");
  }

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { error: insertError } = await supabase.from("InternalLink").insert(
    response.results.map((item: ExaResponseItem) => ({
      project_id: projectId,
      url: item.id,
      summary: item.summary,
    }))
  );

  if (insertError) {
    return err(`Error inserting internal links: ${insertError.message}`);
  }

  return ok(response.results?.at(0));
};

const maxConcurrentCallToExa: number = 4;

export const throttledSummarizeLink = pThrottle({
  limit: maxConcurrentCallToExa,
  interval: 1000,
})(summarizeLink);
