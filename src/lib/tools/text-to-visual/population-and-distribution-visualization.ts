import { tool } from "ai";
import { z } from "zod";

export const populationAndDistributionVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Population and Distribution Visualization' designed to display data related to proportions, distributions, or comparisons. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for context.  
    2. Two sections at the top:  
      - The first section includes a row of person icons, with a larger number of icons in blue to represent a higher proportion or count.  
      - The second section also includes a row of person icons, with a smaller number of icons in green.  
    3. A lower section with three titles and corresponding descriptions.  
    4. A horizontal segmented bar beneath the lower section, divided into three labeled segments:  
      - The first segment is the longest, indicating the largest proportion, followed by the second segment, then the third segment being the shortest.  

    This template is ideal for presenting demographic comparisons, survey data, or proportional statistics.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title summarizing the population/distribution visualization."
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
        template_name: "population-and-distribution-visualization",
      };
    },
  });
