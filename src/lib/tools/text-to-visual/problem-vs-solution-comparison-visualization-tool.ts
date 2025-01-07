import { tool } from "ai";
import { z } from "zod";

export const problemVsSolutionComparisonVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Problem vs. Solution Comparison Visualization' designed to highlight problems and their corresponding solutions side by side. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for additional context.  
    2. Two silhouette profiles placed in the center, facing opposite directions. The "Problem" silhouette on the left features a locked padlock icon, while the "Solution" silhouette on the right features an unlocked padlock icon to symbolize resolution.  
    3. Three problems listed on the left side, each with:  
      - A title summarizing the problem.  
      - Up to three descriptive lines providing additional details for each problem.  
    4. Three corresponding solutions listed on the right side, each with:  
      - A title summarizing the solution.  
      - Up to three descriptive lines providing additional details for each solution.  
    5. Arrows connect each problem on the left to its respective solution on the right, emphasizing the direct relationship between them.  

    This template is ideal for visually contrasting challenges and their resolutions in a clear and engaging manner.
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
      return {
        problem_1_desc_line_2: "",
        problem_1_desc_line_3: "",
        problem_2_desc_line_2: "",
        problem_2_desc_line_3: "",
        problem_3_desc_line_2: "",
        problem_3_desc_line_3: "",
        solution_1_desc_line_2: "",
        solution_1_desc_line_3: "",
        solution_2_desc_line_2: "",
        solution_2_desc_line_3: "",
        solution_3_desc_line_2: "",
        solution_3_desc_line_3: "",
        ...input,
        template_name: "problem-vs-solution-comparison-visualization",
      };
    },
  });
