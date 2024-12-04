import { tool } from "ai";
import { z } from "zod";
import { replacePlaceholders } from "../../text-to-image/replace-placeholders.js";

export const chainLinkTool = () =>
  tool({
    description: `
        This tool generates an SVG image based on a "chain link" template. 

        Purpose:
        - Visualizes interconnected ideas or themes in a structured and visually appealing way.

        Structure:
        - A main title at the top of the image.
        - Five interconnected links, each containing:
        - A text label above or below the link.
        - An icon inside the link.

        Parameters:
        - The text labels represent related ideas or themes and are concise and meaningful.
        - The icons are visual representations of the associated ideas and must strictly be Lucide icons. Icon names should be in PascalCase (e.g., "Activity", "Briefcase").
    `,
    parameters: z.object({
      main_title: z
        .string()
        .describe("The main title summarizing the interconnected ideas."),
      text_1: z.string().describe("A concise label for the first link."),
      text_2: z.string().describe("A concise label for the second link."),
      text_3: z.string().describe("A concise label for the third link."),
      text_4: z.string().describe("A concise label for the fourth link."),
      text_5: z.string().describe("A concise label for the fifth link."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first link."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second link."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third link."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth link."),
      icon_5: z
        .string()
        .describe("The name of the Lucide icon for the fifth link."),
    }),
    execute: async (input) => {
      console.log(input);
      return replacePlaceholders({ ...input, template_name: "chain-link" });
    },
  });
