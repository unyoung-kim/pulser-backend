import { tool } from "ai";
import { z } from "zod";

export const segmentedVisualizationTool = () =>
  tool({
    description: `
        This tool collects parameters based on a "Segmented Visualization" template and outputs them with the template name.

        Purpose:
        - Visualizes five distinct categories or themes with corresponding data points, labels, and graphical representations.

        Structure:
        - A section title and sub-header at the top.
        - Five key categories, each containing:
          - A title summarizing the category.
          - A short description line for context.
          - Visual elements such as human icons for counts or progress bars for proportions.

        Parameters:
        - Section title and sub-header summarize the overall theme.
        - Each segment includes a title, a description line, and optional visual labels.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title summarizing the overall visualization."),
      sub_header: z
        .string()
        .describe("The sub-header providing additional context."),

      // Segment 1
      title_1: z.string().describe("The title for the first segment."),
      title_1_desc_line_1: z
        .string()
        .describe("The description for the first segment."),

      // Segment 2
      title_2: z.string().describe("The title for the second segment."),
      title_2_desc_line_1: z
        .string()
        .describe("The description for the second segment."),

      // Segment 3
      title_3: z.string().describe("The title for the third segment."),
      title_3_desc_line_1: z
        .string()
        .describe("The description for the third segment."),
      label_1: z.string().describe("The visual label for the third segment."),

      // Segment 4
      title_4: z.string().describe("The title for the fourth segment."),
      title_4_desc_line_1: z
        .string()
        .describe("The description for the fourth segment."),
      label_2: z.string().describe("The visual label for the fourth segment."),

      // Segment 5
      title_5: z.string().describe("The title for the fifth segment."),
      title_5_desc_line_1: z
        .string()
        .describe("The description for the fifth segment."),
      label_3: z.string().describe("The visual label for the fifth segment."),
    }),
    execute: async (input) => {
      return { ...input, template_name: "segmented-visualization" };
    },
  });
