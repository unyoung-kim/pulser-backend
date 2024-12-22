import { tool } from "ai";
import { z } from "zod";

export const demographicDistributionVisualizationTool = () =>
  tool({
    description: `
        This tool collects parameters based on a "Demographic Distribution Visualization" template and outputs them with the template name.

      Purpose:
      - Visualizes demographic data or comparative statistics using icons, titles, and progress bars.

      Structure:
      - A main header and sub-header at the top to summarize the concept.
      - Two large sections at the top visualizing statistics with person icons and corresponding titles.
        - The first section contains more person icons than the second, indicating a larger proportion or count.
      - Three progress bars below, each with:
        - A title summarizing the data.
        - A descriptive label for the progress bar.
        - The first progress bar is the longest, followed by the second, and the third is the shortest, representing relative values.

      Parameters:
      - Main header and sub-header summarize the concept.
      - Each section includes a title, description, and the number of person icons.
      - Each progress bar includes a label, a title text and a description text.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title summarizing the demographic distribution visualization."
        ),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      title_1: z.string().describe("The title for the first statistic."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first statistic."),

      title_2: z.string().describe("The title for the second statistic."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second statistic."),

      title_3: z.string().describe("The title for the first progress bar."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the first progress bar."),
      label_1: z.string().describe("The label for the first progress bar."),

      title_4: z.string().describe("The title for the second progress bar."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the second progress bar."),
      label_2: z.string().describe("The label for the second progress bar."),

      title_5: z.string().describe("The title for the third progress bar."),
      title_5_desc_line_1: z
        .string()
        .describe("The first line of description for the third progress bar."),
      label_3: z.string().describe("The label for the third progress bar."),
    }),
    execute: async (input) => {
      return {
        ...input,
        template_name: "demographic-distribution-visualization",
      };
    },
  });
