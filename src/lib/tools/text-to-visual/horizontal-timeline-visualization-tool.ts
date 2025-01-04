import { tool } from "ai";
import { z } from "zod";

export const horizontalTimelineVisualizationTool = () =>
  tool({
    description: `
      This tool collects parameters for a 'Horizontal Timeline' template and outputs them with the template name.

      Purpose:
      - Visualizes a chronological sequence of events or milestones across a horizontal axis, emphasizing progression over time.

      Structure:
      - A main header and sub-header at the top summarizing the timeline.
      - Six circular nodes aligned horizontally, each representing a year or milestone.
      - Each node contains a title (e.g., year) and is connected to text blocks via arrows.
      - Text blocks are positioned above or below the nodes with up to two descriptive lines for each milestone.

      Parameters:
      - Main header and sub-header summarize the timeline.
      - Each node includes a title and corresponding description lines.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the timeline visualization."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the timeline."
        ),

      // Title 1
      label_1: z.string().describe("The label for the first milestone."),
      title_1: z.string().describe("The title for the first milestone."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first milestone."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first milestone."),

      // Title 2
      label_2: z.string().describe("The label for the second milestone."),
      title_2: z.string().describe("The title for the second milestone."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second milestone."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second milestone."),

      // Title 3
      label_3: z.string().describe("The label for the third milestone."),
      title_3: z.string().describe("The title for the third milestone."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third milestone."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third milestone."),

      // Title 4
      label_4: z.string().describe("The label for the fourth milestone."),
      title_4: z.string().describe("The title for the fourth milestone."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the fourth milestone."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth milestone."),

      // Title 5
      label_5: z.string().describe("The label for the fifth milestone."),
      title_5: z.string().describe("The title for the fifth milestone."),
      title_5_desc_line_1: z
        .string()
        .describe("The first line of description for the fifth milestone."),
      title_5_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fifth milestone."),

      // Title 6
      label_6: z.string().describe("The label for the sixth milestone."),
      title_6: z.string().describe("The title for the sixth milestone."),
      title_6_desc_line_1: z
        .string()
        .describe("The first line of description for the sixth milestone."),
      title_6_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the sixth milestone."),
    }),
    execute: async (input) => {
      return {
        ...input,
        template_name: "horizontal-timeline-visualization",
      };
    },
  });
