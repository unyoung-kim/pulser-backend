import { tool } from "ai";
import { z } from "zod";

export const threeSequentialStepFlowTool = () =>
  tool({
    description: `
        This tool captures parameters based on the "Three Sequential Step Flow" template and outputs them with the template name.

        Purpose:
        - Visualizes a process or flow in three sequential steps represented as circular sections.
        - Arrows indicate progression between each step.

        Structure:
        - A section title and sub-header at the top.
        - Three circular sections, each containing:
          - A title summarizing the step.
          - Two optional description lines for context.

        Parameters:
        - Section title and sub-header provide the context for the flow.
        - Each circle includes a title and up to two description lines.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title summarizing the three-step flow."),
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
        template_name: "three-sequential-step-flow",
      };
    },
  });
