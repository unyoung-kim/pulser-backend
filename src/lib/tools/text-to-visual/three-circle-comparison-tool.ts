import { tool } from "ai";
import { z } from "zod";

export const threeCircleComparisonTool = () =>
  tool({
    description: `
        This tool collects parameters based on a "Three-Part Circle Comparison" template and outputs them with the template name.

        Purpose:
        - Visualizes three interconnected themes or ideas side-by-side in circular sections.

        Structure:
        - A section title and sub-header at the top.
        - Three circular sections, each containing:
          - A title summarizing the idea.
          - Three optional description lines for additional context.
          - An associated Lucide icon.

        Parameters:
        - Section title and sub-header summarize the overall theme.
        - Each circle includes a title, icon, and up to three description lines.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title summarizing the three-part comparison."),
      sub_header: z
        .string()
        .describe("The sub-header providing additional context."),

      // Circle 1
      title_1: z.string().describe("The title for the first circle."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first circle."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first circle."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first circle."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first circle."),

      // Circle 2
      title_2: z.string().describe("The title for the second circle."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second circle."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second circle."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second circle."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second circle."),

      // Circle 3
      title_3: z.string().describe("The title for the third circle."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third circle."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third circle."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third circle."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third circle."),
    }),
    execute: async (input) => {
      return { ...input, template_name: "three-circle-comparison" };
    },
  });
