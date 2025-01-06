import { tool } from "ai";
import { z } from "zod";

export const threeCircleSequentialFlowVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Three-Circle Sequential Flow Visualization' designed to showcase a linear process or progression through three stages. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for additional context.  
    2. Three circular shapes arranged horizontally, each representing a step in the process.  
    3. Each circle contains:  
      - A bold title summarizing the step.  
      - A description of upto two lines providing additional details below the title.  
    4. Arrows between the circles indicate the sequential flow, visually emphasizing progression from the first to the third stage.  

    This template is ideal for illustrating step-by-step processes, workflows, or sequential concepts in a clean and straightforward format.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title summarizing the three-circle-sequential-flow-visualization."
        ),
      sub_header: z
        .string()
        .describe("The sub-header providing additional context."),

      // Step 1
      title_1: z.string().describe("The title for the first step."),
      title_1_desc_line_1: z
        .string()
        .describe("The first description line for the first step."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the first step."),

      // Step 2
      title_2: z.string().describe("The title for the second step."),
      title_2_desc_line_1: z
        .string()
        .describe("The first description line for the second step."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the second step."),

      // Step 3
      title_3: z.string().describe("The title for the third step."),
      title_3_desc_line_1: z
        .string()
        .describe("The first description line for the third step."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the third step."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_2_desc_line_2: "",
        title_3_desc_line_2: "",
        ...input,
        template_name: "three-circle-sequential-flow-visualization",
      };
    },
  });
