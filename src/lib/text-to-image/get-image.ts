import fs from "fs";
import path from "path";
import Lucide from "lucide";
import { getLucideIconSVG } from "./get-lucide-icon-svg.js";

export const getImage = (argumentObject: Record<string, string>): string => {
  const templatePath = path.resolve(
    `./templates/${argumentObject["template_name"]}.svg`
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
    const regex = new RegExp(`{{${key}}}`, "g"); // Match all placeholders like {{text_1}}, {{icon_1}}

    if (key.startsWith("icon_")) {
      // Replace placeholder with the SVG string for the Lucide icon
      updatedTemplate = updatedTemplate.replace(regex, getLucideIconSVG(value));
    } else {
      // Replace placeholder with simple text value
      updatedTemplate = updatedTemplate.replace(regex, value);
    }
  }

  return updatedTemplate;
};
