import { Result } from "true-myth";
import { ok } from "true-myth/result";
import { z } from "zod";

const exportColumns = "Ph,Nq,Cp,Co,Nr,Td,Fk,In,Kd";
const displayLimit = 50;

const intentEnum = z.enum([
  "Commercial",
  "Informational",
  "Navigational",
  "Transactional",
]);

const intentMapping: Record<string, string> = {
  "0": "Commercial",
  "1": "Informational",
  "2": "Navigational",
  "3": "Transactional",
};

export const semrushBroadMatchKeyword = async (
  phrase: string,
  database: string,
  displayOffset: number,
  kdFilter: number,
  intentFilter: z.infer<typeof intentEnum>
): Promise<Result<Record<string, string>[], string>> => {
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
  const result = data.slice(1).map((row) => {
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

  return ok(result);
};
