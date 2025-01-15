import { tool } from "ai";
import { z } from "zod";

export const megaphoneCommunicationVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Megaphone Communication Visualization' designed to highlight key messages and their amplification. The layout includes:  
      1. A main header at the top for the overall title, with a sub-header below for additional context.  
      2. Three text sections on the left side, each containing:  
         - A title summarizing the key point.  
         - A descriptive line providing further details about the point.  
      3. A graphic on the right side featuring a megaphone projecting a collection of communication symbols (e.g., social media icons, email, etc.).  

      This template is ideal for showcasing communication strategies, message amplification, or promotional efforts.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title of the megaphone communication visualization."
        ),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Message 1
      title_1: z.string().describe("The title for the first message."),
      title_1_desc_line_1: z
        .string()
        .describe("The first description line for the first message."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("An optional second description line for the first message."),

      // Message 2
      title_2: z.string().describe("The title for the second message."),
      title_2_desc_line_1: z
        .string()
        .describe("The first description line for the second message."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe(
          "An optional second description line for the second message."
        ),

      // Message 3
      title_3: z.string().describe("The title for the third message."),
      title_3_desc_line_1: z
        .string()
        .describe("The first description line for the third message."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("An optional second description line for the third message."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_2_desc_line_2: "",
        title_3_desc_line_2: "",
        ...input,
        template_name: "megaphone-communication-visualization",
      };
    },
  });
