import LucideCore, { IconNode } from "lucide";
import LucideLab from "@lucide/lab";

// Function to get the SVG string for a Lucide icon
export const getLucideIconSVG = (iconName: string): string => {
  // Validate that the iconName exists in Lucide.icons

  const camelCase = iconName[0].toLowerCase() + iconName.slice(1);
  if (iconName in LucideCore.icons) {
    const icon = LucideCore.icons[iconName as keyof typeof LucideCore.icons];
    const children = icon.at(2);

    let result = "";

    if (children && Array.isArray(children)) {
      children.forEach((child) => {
        result += arrayToSVG(child); // Process child elements
      });
    }

    return result; // Convert the icon array to an SVG string
  } else if (camelCase in LucideLab) {
    const icon = LucideLab[iconName as keyof typeof LucideLab];
    let result = "";

    if (icon && Array.isArray(icon)) {
      icon.forEach((element) => {
        result += arrayToSVG(element); // Process child elements
      });
    }

    return result; // Convert the icon array to an SVG string
  } else {
    throw new Error(`Icon "${iconName}" not found in Lucide`);
  }
};

// Function to convert Lucide icon array to an SVG string
const arrayToSVG = (iconArray: IconNode): string => {
  const tagName = iconArray[0]; // First element is the tag name, e.g., "svg"
  const attributes = iconArray[1]; // Second element contains attributes as an object
  const children = iconArray[2]; // Third element contains child tags (if any)

  // Generate the opening tag with attributes
  let svgString = `<${tagName}`;

  // Append the attributes
  for (const [key, value] of Object.entries(attributes)) {
    svgString += ` ${key}="${value}"`;
  }

  // If there are child elements (e.g., <path>, <circle>), process them recursively
  if (children) {
    svgString += ">";
    children.forEach((child) => {
      svgString += arrayToSVG(child); // Recursively process child elements
    });
    svgString += `</${tagName}>`; // Close the main tag
  } else {
    svgString += " />"; // Self-close the tag if no children
  }

  return svgString;
};
