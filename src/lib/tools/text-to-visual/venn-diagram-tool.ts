import { tool } from "ai";
import { z } from "zod";

export const vennDiagramTool = () =>
  tool({
    description: `
        This tool generates an SVG image based on a "Venn Diagram" template.

        Purpose:
        - Visualizes relationships and overlaps between three main categories or ideas in an aesthetically pleasing format.

        Structure:
        - A main title displayed at the top of the diagram.
        - Three intersecting circles representing three categories or ideas.
        - Each circle includes:
        - A text label for the category.
        - An icon representing the idea.
        - The overlap section of the Venn Diagram corresponds to the second category, represented by text_2 and icon_2.
    `,
    parameters: z.object({
      main_title: z
        .string()
        .describe("The main title summarizing the theme of the Venn Diagram."),
      text_1: z.string().describe("A concise label for the first category."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first category."),
      text_2: z
        .string()
        .describe(
          "A concise label for the second category, representing the overlap section of the Venn Diagram."
        ),
      icon_2: z
        .string()
        .describe(
          "The name of the Lucide icon for the second category, representing the overlap section of the Venn Diagram."
        ),
      text_3: z.string().describe("A concise label for the third category."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third category."),
    }),
    execute: async (input) => {
      return { ...input, template_name: "venn-diagram" };
    },
  });
