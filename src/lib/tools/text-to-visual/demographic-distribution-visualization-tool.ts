import { tool } from "ai";
import { z } from "zod";

export const demographicDistributionVisualizationTool = () =>
  tool({
    description: `
        This tool collects parameters based on a "Demographic Distribution Visualization" template and outputs them with the template name.

        Purpose:
        - Visualizes demographic data or comparative statistics using icons, titles, and progress bars.

        Structure:
        - A main header and sub-header summarize the concept.
        - Two sections at the top visualize statistics with person icons and titles:
          - The first section has more person icons than the second, representing a larger proportion or count.
        - Three progress bars below, each with:
          - A title summarizing the data.
          - A label and description text.
          - Progress bars vary in length: the first is the longest, followed by the second, and the third is the shortest, reflecting relative values.

        Parameters:
        - Includes a header, sub-header, titles and descriptions for each statistic and progress bar, and a label for each progress bar.
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
