import { tool } from "ai";
import { z } from "zod";

export const sixStageAlternatingDescriptionVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Six-Stage Alternating Description Visualization' designed to visually depict a process or sequence divided into six stages with alternating descriptions. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for context.  
    2. Six circular labels arranged in a horizontal sequence, each representing a stage in the process.  
    3. Descriptions for each stage alternate between being placed above and below the corresponding circular label. Each description includes:  
      - A title summarizing the stage ("title_1" to "title_6").  
      - Up to two lines of descriptive text for each title.  

    This template is ideal for showcasing processes, timelines, or sequential workflows with alternating descriptions to maintain visual balance and clarity.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title of the six-stage alternating description visualization."
        ),
      sub_header: z
        .string()
        .describe("The sub-header providing additional context."),

      // Title 1
      label_1: z.string().describe("The label for the first stage."),
      title_1: z.string().describe("The title for the first stage."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first stage."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first stage."),

      // Title 2
      label_2: z.string().describe("The label for the second stage."),
      title_2: z.string().describe("The title for the second stage."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second stage."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second stage."),

      // Title 3
      label_3: z.string().describe("The label for the third stage."),
      title_3: z.string().describe("The title for the third stage."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third stage."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third stage."),

      // Title 4
      label_4: z.string().describe("The label for the fourth stage."),
      title_4: z.string().describe("The title for the fourth stage."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the fourth stage."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth stage."),

      // Title 5
      label_5: z.string().describe("The label for the fifth stage."),
      title_5: z.string().describe("The title for the fifth stage."),
      title_5_desc_line_1: z
        .string()
        .describe("The first line of description for the fifth stage."),
      title_5_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fifth stage."),

      // Title 6
      label_6: z.string().describe("The label for the sixth stage."),
      title_6: z.string().describe("The title for the sixth stage."),
      title_6_desc_line_1: z
        .string()
        .describe("The first line of description for the sixth stage."),
      title_6_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the sixth stage."),
    }),
    execute: async (input) => {
      return {
        ...input,
        template_name: "six-stage-alternating-description-visualization",
      };
    },
  });
