import { tool } from "ai";
import { z } from "zod";

export const problemSolutionTool = () =>
  tool({
    description: `
        This tool collects parameters based on a "Problem-Solution Comparison" template and outputs them with the template name.

        Purpose:
        - Visualizes a comparison between problems and their corresponding solutions in a structured format.

        Structure:
        - A section title and sub-header at the top.
        - Three problems listed on the left with descriptions (up to three lines per problem).
        - Three solutions listed on the right with descriptions (up to three lines per solution).

        Parameters:
        - Problems and solutions must include concise titles and up to three description lines.
        - Section title and sub-header summarize the overall theme.
    `,
    parameters: z.object({
      header: z.string().describe("The main title summarizing the comparison."),
      sub_header: z
        .string()
        .describe("The sub-header providing additional context."),

      // Problem Titles and Descriptions
      problem_1: z.string().describe("The title for the first problem."),
      problem_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first problem."),
      problem_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first problem."),
      problem_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first problem."),

      problem_2: z.string().describe("The title for the second problem."),
      problem_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second problem."),
      problem_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second problem."),
      problem_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second problem."),

      problem_3: z.string().describe("The title for the third problem."),
      problem_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third problem."),
      problem_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third problem."),
      problem_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third problem."),

      // Solution Titles and Descriptions
      solution_1: z.string().describe("The title for the first solution."),
      solution_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first solution."),
      solution_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first solution."),
      solution_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first solution."),

      solution_2: z.string().describe("The title for the second solution."),
      solution_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second solution."),
      solution_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second solution."),
      solution_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second solution."),

      solution_3: z.string().describe("The title for the third solution."),
      solution_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third solution."),
      solution_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third solution."),
      solution_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third solution."),
    }),
    execute: async (input) => {
      return { ...input, template_name: "problem-solution" };
    },
  });
