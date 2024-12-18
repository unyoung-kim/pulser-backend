import { tool } from "ai";
import { z } from "zod";

export const chainLinkTool = () =>
  tool({
    description: `
        This tool collects parameters based on a "Chain Link" template and outputs them with the template name. 

        Purpose:
        - Captures details about interconnected ideas or themes in a structured format.

        Structure:
        - A main title summarizing the interconnected ideas.
        - Five interconnected links, each containing:
          - A text label for the link.
          - An icon associated with the link (using Lucide icons).

        Parameters:
        - Text labels represent related ideas or themes and must be concise and meaningful.
        - Lucide icons are used as visual representations. Use PascalCase for icon names (e.g., "Activity").
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
      return { ...input, template_name: "chain-link" };
    },
  });
