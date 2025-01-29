import { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { incrementUsageCredit } from "../supabase/usage.js";
import { semrushKeywordOverviewOneDb } from "./semrush-keyword-overview-one-db.js";

const exportColumns = "Ph,Nq,Cp,Co,Nr,Td,Fk,In,Kd";
const displayLimit = 70;
const displayLimitFreeTrial = 5;

const intentMapping: Record<string, string> = {
  "0": "Commercial",
  "1": "Informational",
  "2": "Navigational",
  "3": "Transactional",
};

export const semrushKeywordBroadMatchAndOverview = async (
  orgId: string,
  phrase: string,
  database: string,
  displayOffset: number,
  kdFilter: number,
  isFreeTrial: boolean = false
): Promise<
  Result<
    {
      inputKeywordOverview: Record<string, string>;
      broadMatches: Record<string, string>[];
    },
    string
  >
> => {
  const response = await fetch(
    `https://api.semrush.com/?type=phrase_fullsearch&key=${
      process.env.SEMRUSH_API_KEY
    }&phrase=${phrase}&database=${database}&display_offset=${displayOffset}&display_filter=%2B|Kd|Lt|${kdFilter}&display_limit=${
      isFreeTrial ? displayLimitFreeTrial : displayLimit
    }&export_columns=${exportColumns}`
  );

  const data = (await response.text()).split("\n");
  // Extract fields and convert to camel case
  const fields = data[0]
    .trim()
    .split(";")
    .map((field) =>
      field
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index === 0
            ? match.toLowerCase()
            : match.toUpperCase().replace(/\s+/g, "")
        )
        .replace(/\s+/g, "")
    );
  // Create an array of objects
  const broadMatchResult = data.slice(1).map((row) => {
    const values = row.trim().split(";");
    const obj: Record<string, string> = {};

    fields.forEach((field, index) => {
      if (field === "intent") {
        const value = values[index].split(",")[0];
        obj[field] = intentMapping[value] || value;
      } else {
        if (field === "cPC") {
          obj["CPC"] = values[index];
        } else {
          obj[field] = values[index];
        }
      }
    });
    return obj;
  });

  const overviewResult: Result<
    Record<string, string>,
    string
  > = await semrushKeywordOverviewOneDb(phrase, database);

  if (overviewResult.isErr) {
    return err(overviewResult.error);
  }

  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const incrementUsageCreditResult: Result<string, string> =
    await incrementUsageCredit(supabase, orgId, "GLOSSARY");

  if (incrementUsageCreditResult.isErr) {
    return err(incrementUsageCreditResult.error);
  }

  const result = {
    inputKeywordOverview: overviewResult.value,
    broadMatches: broadMatchResult,
  };

  return ok(result);
};
