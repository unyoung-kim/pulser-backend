import { Result } from "true-myth";
import result, { ok, err } from "true-myth/result";
import { semrushKeywordOverviewOneDb } from "./semrush-keyword-overview-one-db.js";

const exportColumns = "Ph,Nq,Cp,Co,Nr,Td,Fk,In,Kd";
const displayLimit = 70;

const intentMapping: Record<string, string> = {
  "0": "Commercial",
  "1": "Informational",
  "2": "Navigational",
  "3": "Transactional",
};

export const semrushKeywordBroadMatchAndOverview = async (
  phrase: string,
  database: string,
  displayOffset: number,
  kdFilter: number
): Promise<
  Result<
    { inputKeywordOverview: string; broadMatches: Record<string, string>[] },
    string
  >
> => {
  const response = await fetch(
    `https://api.semrush.com/?type=phrase_fullsearch&key=${process.env.SEMRUSH_API_KEY}&phrase=${phrase}&database=${database}&display_offset=${displayOffset}&display_filter=%2B|Kd|Lt|${kdFilter}&display_limit=${displayLimit}&export_columns=${exportColumns}`
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
        obj[field] = intentMapping[values[index]] || values[index];
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

  const overviewResult: Result<string, string> =
    await semrushKeywordOverviewOneDb(phrase, database);

  if (overviewResult.isErr) {
    return err(overviewResult.error);
  }

  const result = {
    inputKeywordOverview: overviewResult.value,
    broadMatches: broadMatchResult,
  };

  return ok(result);
};
