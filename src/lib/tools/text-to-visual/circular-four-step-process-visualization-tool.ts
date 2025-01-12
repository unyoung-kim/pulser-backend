import { tool } from "ai";
import { z } from "zod";

export const circularFourStepProcessVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Circular Four-Step Process Visualization' designed to depict a process or workflow divided into four sequential stages. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for additional context.  
    2. A circular diagram divided into four equal segments, each representing one step in the process.  
    3. A central label placed inside the circle to provide an overarching theme or context for the entire process.  

    Each segment of the circle includes:  
    - A numeric label (1 to 4) to indicate the order of the step.  
    - A triangular section pointing toward the center, containing an icon.  
    - A title and up to two description lines displayed on the right side of the diagram for each corresponding step.  

    This template is ideal for visualizing processes, cycles, or concepts with four interconnected components.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the circular idea visualization."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Central Core
      central_label: z
        .string()
        .describe("The label describing the central concept or core stage."),

      // Segment 1
      title_1: z
        .string()
        .describe("The title of the description for the first segment."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first segment."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first segment."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first segment."),

      // Segment 2
      title_2: z
        .string()
        .describe("The title of the description for the second segment."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second segment."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second segment."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second segment."),

      // Segment 3
      title_3: z
        .string()
        .describe("The title of the description for the third segment."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third segment."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third segment."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third segment."),

      // Segment 4
      title_4: z
        .string()
        .describe("The title of the description for the fourth segment."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the fourth segment."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth segment."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth segment."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_2_desc_line_2: "",
        title_3_desc_line_2: "",
        title_4_desc_line_2: "",
        ...input,
        template_name: "circular-four-step-process-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKyUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xDJ/bcAAADmdFJOUwA9xfr/+8dANvj5OrObCwqWuOAjHuXjHEHB8+SPDhfoTvzKBwLiiRAz3GtKLyjhAVyuGrGABSdere7x/cspOd9psj7e9nHGBl0Nmr8gO7ntiEvmYgjrHROpGPC8WVQZwLcbpBGe52ijbDHELjD+tAN36U/Qk2DvW92UjtRz27DY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" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHyUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8KjtlYAAACmdFJOUwA+xPr/70r4S/ePgAHBfwkmGQLWyIUvDQ6wyv2fHmedcon0IDe3/hy44unGEEwGkPDVDIw5CruUMQ+LnH4kujpFem4f9rwS3Y0pedLT0BOW8bZ7uRE2HTzJBCpf8qFcq/P7FUaOqi7X6OeSKyf1FseXy0+RFFjmrU6nZkQ/VooFxfxHJb1Bpe5sIj0wC1J2Gt/5ZORIIVTMz97cYn0sURijs7Jjv6nWfM/BAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADRElEQVRYR+2X+VtNQRjH3+rbflPdaHGLIrcUKhSlCClC9uUi7g1ZkzX7EkKIspUlu//TM2fmnFm6cwu/eDw+v5yZ97zv55w7M2fOPURx8QmYjMQkshI3eTmA5BSzziMeqWnpkxDTkIA0M2Tii3kPQLoZMvEBGclWw9QE01KshgmCzKxsvx5hArIaTIE/B0idPiNXCTkCq8EU5ImJy4jzQlxgM5iCfKAgbWYAQGGeCAmBxaALimbNBoqJikrmADlzedDn5kQ1qILSeUF298WsXVYOzBeGClQucBoLoxikYFEVu/FqISB/CVCz2Gku0Vb1UqVaFdTWAanLlte7AqIGYAU/Va4aGmUxwxX4CoCZTc4gugL/SgRX8ZPNq+Vz4QyoxBWsAeoy+Sy4AlrbgnVqrjIjEiForUZbPWuoAloPbFByYwnaAb5paIKmoJluFWzEJt7XBLQZGbLDsAk6gu5k6IIt2Co7DJtgKSAWSD6wbbvHDmCnlm4TJAG7eN99mDx2a+k2QTOwRwTq9Pq9IS3dJtgH7HcjIUFmC6pCerldEDqATj1OFAccNGNWAR1CWB8tok5EuoxQDMFh4Ih+IjeCo3qEwQXdx45zTpz0noUMBLT3V30NIqfUAIcLGr0xDniC02H0KHvFmV7vOdfggnTgLOMcIPeD8xEELlzkbf+lPuCysbs7eAKnx47yQlfCQM/Va9dv3LzVBqDztlbpcqf/rk1A9+7L9VPhLQuDUKsoZBgCooEHD1l1pPIR3wxtWAVE/sHHA0+eqpFoNCLgHKMIrLSmFQqGiLpzTjrBXxE884anRQYVwfNSCx0yd5iR6Pz8Lj5FUlDUIydAp6JWXsw7JvX3GoLBEbPQJVHMhyZ4gZeGgLJeWXA3JE3gT3ltCiZFE6jB3xOc5v8dFEFXrsDZQzLFe11BE7wRbxEpKAu7gxYuI6LR4BDbKMeciRsefttgCKZNWMpNEVcQaSKid3hPRB+8qQgYArUjfsL4R8E463264eOnnbU7ZtZEE0TDWvNvC7I/f+F8/RajJoag3Zu5kRg1MQTpwCijz0yzdyYIoqfZO/8Ff4MgAVV/JohHapX8yP0OyOOUOlP8+LYSpCl9/lsJ/vgJ37qknGbWrM8AAAAASUVORK5CYII=" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALQUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wPARyEAAADwdFJOUwAMgMHAf/+9I+1JS+8gAQZQv0137PymU/6folKo63WG9K4tL4MY+/pGIXMNdL5IFj3ZAts6DmcxWVhphMRb3dzGglqU4amq4pJu9mFk92sD3w/zh/BRVe6JrJ3LJ1cpnC6K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" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKyUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xDJ/bcAAADmdFJOUwAIcs/3//6tBxHKtK/wbysiXS78N0X1+XG63E2HmYmYcJqOFBVpX30PIE6Ej3xcNQZE3uDiuWIaMygmgAJZ/dmznZKoyfTyjBhVNMv2qVMSBIXh8QMNze4LkAF7+xYlP0kwVNS/eLIeE22704sv5bxulvjo28A+70xlgjwKtqEO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" preserveAspectRatio="none" id="img4"></image>`,
      };
    },
  });
