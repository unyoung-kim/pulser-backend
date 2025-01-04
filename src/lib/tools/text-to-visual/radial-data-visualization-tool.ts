import { tool } from "ai";
import { z } from "zod";

export const radialDataVisualizationTool = () =>
  tool({
    description: `
    This tool collects parameters for a 'Radial Data Visualization' template and outputs them with the template name.

    Purpose:
    - Visualizes a central numerical value or metric surrounded by radial segments that represent related data points or categories.
    - Highlights a key metric with supporting descriptions for clarity and context.

    Structure:
    - A main header and sub-header at the top summarizing the visualization.
    - A large central numeric value representing the primary metric.
    - Four radial segments (arc-like shapes) surrounding the central metric, each connected to a description block positioned externally.
    - Each description block includes:
    - A title summarizing the category.
    - A line of supporting text for additional details.

    Parameters:
    - Main header and sub-header summarize the visualization.
    - The central metric represents the primary data value.
    - Each radial segment is linked to a title and description block.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the radial data visualization."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),
      central_metric: z
        .string()
        .describe(
          "The central numerical value representing the primary metric."
        ),
      central_desc_line_1: z
        .string()
        .describe("A brief description of the central metric."),
      central_desc_line_2: z
        .string()
        .optional()
        .describe("A second line of description for the central metric."),

      // Segment 1
      title_1: z.string().describe("The title for the first radial segment."),
      title_1_desc_line_1: z
        .string()
        .describe(
          "The first line of description for the first radial segment."
        ),

      // Segment 2
      title_2: z.string().describe("The title for the second radial segment."),
      title_2_desc_line_1: z
        .string()
        .describe(
          "The first line of description for the second radial segment."
        ),

      // Segment 3
      title_3: z.string().describe("The title for the third radial segment."),
      title_3_desc_line_1: z
        .string()
        .describe(
          "The first line of description for the third radial segment."
        ),

      // Segment 4
      title_4: z.string().describe("The title for the fourth radial segment."),
      title_4_desc_line_1: z
        .string()
        .describe(
          "The first line of description for the fourth radial segment."
        ),
    }),
    execute: async (input) => {
      return {
        ...input,
        template_name: "radial-data-visualization",
      };
    },
  });
