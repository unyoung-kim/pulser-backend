import { Result } from "true-myth";
import { ok } from "true-myth/result";

const exportColumns = "Ph,Nq,Cp,Co,Nr,Td,In,Kd";

const intentMapping: Record<string, string> = {
  "0": "Commercial",
  "1": "Informational",
  "2": "Navigational",
  "3": "Transactional",
};

export const semrushKeywordOverviewOneDb = async (
  phrase: string,
  database: string
): Promise<Result<Record<string, string>, string>> => {
  const response = await fetch(
    `https://api.semrush.com/?type=phrase_this&key=${process.env.SEMRUSH_API_KEY}&phrase=${phrase}&database=${database}&export_columns=${exportColumns}`
  );

  const data = (await response.text()).split("\n");
  const fields = data[0].split(";");
  const values = data[1].split(";");

  // Create JSON object
  const jsonObject = fields.reduce<Record<string, string>>(
    (acc, field, index) => {
      // Convert field to camel case
      const camelCaseField = field
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index === 0
            ? match.toLowerCase()
            : match.toUpperCase().replace(/\s+/g, "")
        )
        .replace(/\s+/g, ""); // Remove any remaining spaces

      // Map the "intent" field
      if (camelCaseField === "intent") {
        const value = values[index].split(",")[0];
        acc[camelCaseField] = intentMapping[value] || value; // Default to original value if not found
      } else {
        // Check for specific abbreviations
        if (camelCaseField === "cPC") {
          acc["CPC"] = values[index]; // Assign to uppercase key
        } else {
          acc[camelCaseField] = values[index];
        }
      }

      return acc;
    },
    {}
  );

  return ok(jsonObject);
};
