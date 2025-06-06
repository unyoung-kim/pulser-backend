import fs from "fs";
import path from "path";
import { getLucideIconSVG } from "./get-lucide-icon-svg.js";

export const replacePlaceholders = (
  argumentObject: Record<string, string>
): string => {
  const templatePath = path.resolve(
    `./templates/${argumentObject["template_name"]}.SVG`
  );

  // Read the template synchronously (for simplicity in a small-scale use case)
  let updatedTemplate: string;
  try {
    updatedTemplate = fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  // Replace placeholders with the values from argumentObject
  for (const [key, value] of Object.entries(argumentObject)) {
    // const regex = new RegExp(`{{${key}}}`, "g"); // Match all placeholders like {{text_1}}, {{icon_1}}

    if (key.startsWith("icon_")) {
      // Replace placeholder with the SVG string for the Lucide icon
      const svg = getLucideIconSVG(value);
      if (svg.length > 0) {
        updatedTemplate = updatedTemplate.replace(`{{${key}}}`, svg);
      } else {
        updatedTemplate = updatedTemplate.replace(
          `{{fallback_${key}}}`,
          argumentObject[`fallback_${key}`]
        );
      }
    } else if (!key.startsWith("fallback_")) {
      // Replace placeholder with simple text value
      updatedTemplate = updatedTemplate.replace(`{{${key}}}`, value);
    }
  }

  return updatedTemplate;
};
