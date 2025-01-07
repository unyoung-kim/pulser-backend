import { tool } from "ai";
import { z } from "zod";

export const cyclicFourStepProcessVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Four-Step Cyclic Process Visualization' designed to depict a continuous process or cycle divided into four sequential steps. The layout includes:  
    1. A main header at the top for the title, accompanied by a sub-header for additional context.  
    2. A central circular arrow graphic with four segments, each labeled with a number (01, 02, 03, 04) to indicate the sequence.  
    3. Four supporting blocks distributed evenly around the circular arrow, connected to their respective segments with dotted lines.  

    Each supporting block consists of:  
    - A rectangular shape containing an icon to represent the feature or step.  
    - A title positioned below the icon.  
    - A description of upto four lines below the title providing additional details.  

    This template is ideal for illustrating cyclical processes, recurring workflows, or interconnected steps in a system or strategy.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title summarizing the cyclic process visualization."
        ),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Stage 1
      title_1: z.string().describe("The title for the first text block."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first text block."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first text block."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first text block."),
      title_1_desc_line_4: z
        .string()
        .optional()
        .describe("The fourth line of description for the first text block."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first stage."),

      // Stage 2
      title_2: z.string().describe("The title for the second text block."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second text block."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second text block."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second text block."),
      title_2_desc_line_4: z
        .string()
        .optional()
        .describe("The fourth line of description for the second text block."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second stage."),

      // Stage 3
      title_3: z.string().describe("The title for the third text block."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third text block."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third text block."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third text block."),
      title_3_desc_line_4: z
        .string()
        .optional()
        .describe("The fourth line of description for the third text block."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third stage."),

      // Stage 4
      title_4: z.string().describe("The title for the fourth text block."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the fourth text block."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth text block."),
      title_4_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the fourth text block."),
      title_4_desc_line_4: z
        .string()
        .optional()
        .describe("The fourth line of description for the fourth text block."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth stage."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_1_desc_line_3: "",
        title_1_desc_line_4: "",
        title_2_desc_line_2: "",
        title_2_desc_line_3: "",
        title_2_desc_line_4: "",
        title_3_desc_line_2: "",
        title_3_desc_line_3: "",
        title_3_desc_line_4: "",
        title_4_desc_line_2: "",
        title_4_desc_line_3: "",
        title_4_desc_line_4: "",
        ...input,
        template_name: "cyclic-four-step-process-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALBUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1gHllsAAADrdFJOUwAXLi0Qhv3/+GIo7LGz9/UKR5jAIEi/FbD7yQna/P7wmgiy7+MGwvOJ+R3R39dKk4Qk9DjtW0agAR9XhcMCOnfTiCcF0j90VDT6KVlAyg0MaFyhz+jrtHglQ+Rzxn+d8rcxem22VeUUO+FNN4CBviqQ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" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALHUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4augDUAAADtdFJOUwAM3PLXs4ZPCQFf/5lOwDtsLFOgt0XP5xsi/vQNPcKi4m69xweBoTHO8YUIFN+bAkEm2q9j9WhC3hrmSWmoW/lwkb7g+IAOFql8I+yN6h4D/URZ6/P8iDUEuHlHCkwZsLkfe5bkv+7vUMHt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" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALQUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wPARyEAAADwdFJOUwAkqdTWqCMK4f/gCUi1DrhFVYuOUhRbTAQFWjvtyBIBLJiKjZYryTrynsfNhV9i34TOxaDxeL0tq/z9gTw9gv4Tu3uX5x996PshbAht8H6RjBUYDI8CPsDpRyJ1d/fa2PQg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" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKyUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xDJ/bcAAADmdFJOUwA9xfr/+8dANvj5OrObCwqWuOAjHuXjHEHB8+SPDhfoTvzKBwLiiRAz3GtKLyjhAVyuGrGABSdere7x/cspOd9psj7e9nHGBl0Nmr8gO7ntiEvmYgjrHROpGPC8WVQZwLcbpBGe52ijbDHELjD+tAN36U/Qk2DvW92UjtRz27DY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" preserveAspectRatio="none" id="img4"></image>`,
      };
    },
  });
