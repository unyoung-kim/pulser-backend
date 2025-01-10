import { tool } from "ai";
import { z } from "zod";

export const circularMetricsVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Circular Metrics Visualization' designed to display a central numeric value with supporting information. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for context.  
    2. A large central number representing the primary metric, accompanied by a brief description of up to two lines below.  
    3. A semi-circular graph surrounding the number, with multiple curved segments in different colors representing categories or sub-metrics.  
    4. Four descriptive text blocks on the right, each connected to a graph segment with dotted lines. Each block includes:  
      - A title summarizing the category.  
      - A brief description for additional details.  

    This template is ideal for visualizing key metrics or statistics with clear supporting categories.
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
        template_name: "circular-metrics-visualization",
      };
    },
  });
