import { tool } from "ai";
import { z } from "zod";

export const threeVerticallyTieredContentLayoutTool = () =>
  tool({
    description: `
        This template represents a 'Three Vertically Tiered Content Layout' designed to present three distinct content blocks in a vertical arrangement. The layout includes:  
        1. A main header at the top for the overall title, with a sub-header below for additional context.  
        2. Three vertically aligned sections, each containing:  
           - An icon inside a circle to visually represent the content.  
           - A title summarizing the content.  
           - One descriptive line providing further details.  
        3. Decorative arrows connecting each circle icon to its corresponding text section, serving as a visual link between the two elements.  
  
        This template is ideal for showcasing independent content blocks, features, or key points in a clear and organized vertical structure.
      `,
    parameters: z.object({
      header: z.string().describe("The main title of the layout."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the layout."
        ),

      // Section 1
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first section."),
      title_1: z.string().describe("The title for the first section."),
      title_1_desc_line_1: z
        .string()
        .describe("The description line for the first section."),

      // Section 2
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second section."),
      title_2: z.string().describe("The title for the second section."),
      title_2_desc_line_1: z
        .string()
        .describe("The description line for the second section."),

      // Section 3
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third section."),
      title_3: z.string().describe("The title for the third section."),
      title_3_desc_line_1: z
        .string()
        .describe("The description line for the third section."),
    }),
    execute: async (input) => {
      return {
        ...input,
        template_name: "three-vertically-tiered-content-layout",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH7UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9CSiQAAAACpdFJOUwAHk/D/kjjH75E3QanyUZ/I8X3tMXGXjZkj3dsBJv7zDi/nRbxqPLqGrVXSSvX3DRj6+xoFOhbNWleqfoSi02z9iL5C4gMf/BN/dCjYT7NzWcRij7ZL2onqv+4JEvYh4ERHuG0iYKGHe6tjnjnpBhnhgBEw0Fh8+RDRmGhpwCnZTVa5y3q1Oy2UyoVdZjMsJQr4rxtOFD4XyeuQciBfz0jW3rE2jsFQim55aIqGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADbUlEQVRYR62XB1cTQRRGX7JfSBCx0SwxKIqdQJBihaAiKqIiNoJgQbEjYu+9F8SOvaH8TM9sNpudN7vLItxzcmbPzPtuZofJ7ELkgs+vwRHN7+P1Cn4ekgnwegUNGbwrTQY03qUA8B4r7qM67iXuozruJe6jOu4l7qM67iXGaJD/cUyMEl8gFMr0qS3pRcFkY4shyBTXmWprJF2nqY+FMC4DIbXVRz0LNLW1CvR14OmUQJ9yQG2tAuOWTbLGZ08wBb7MkBYQi8daWWBJE00EMMkUOOIoyMLkKTnI/X9BHvKpAFNHIpCYNh0zwjMjhbP+UzC7CMAcmoviEQgshfNCmL8AC2kRFns5UBTBkhJES8ti5UsrilCZOtKCRFXVyUuJgHoLy2KIYjmtwEpahdXkCyQPVaqq4WFA3wxMUBtHXTHW0Fqsq1/fEN2Q7AWqalBTlS6zIAs2IrKJZhVGGsOb0URbsDVV5Ji3CnzbmtGwnYimooXysIN2YlfYKFLzqZUzBdN27wHQKi5zkWjb2x7vqN+H/UZxOq//7IKK4MDBOFDdGY0fEkWTcJi6cISO4lgyVJ3+/uT6ccFxoOTEOKLVqBNFhxGkkzjVXRaLnTaTpkD5ANSDM71itBKnuomoLYGzdA7naQUupII2U7cILuJSsuwyzoumBVfoKlppLXrqzW9Wpm4R6PtecA3XRdMYyS4tzY7cCN/ELVPg+AHottj3gtPlkTtrmu8ubkBOogF+uof7ngQVRXhARA8fyW8D8ccXzQewTdAioCfY0vu0WWSeHciqfP6ib31Z78vafpS/EmIPgtfZ4hs1/wy8MQKCt+/em9c2QauATn5oH8BH+mTeM8cmKAmI6CwSLzdE4595VCAtjYEioKC+gxewrA4PS5vKFHzB15YEalh2GKyCthzxPPnGKobBKqCjWr54mljhEzewXURbeNLAu2BYxkYwOsZCwKdF9AbfK3hfxXfph2LgIOj+gZ99yTPdINz3E9PFecdwENAvm/8TtF+8ykVAHV0DcnygSz/yOY4Cr4yNYHS4vGx7IsjnJPiNAt4lKLDvVgn32L8aZaBH2huOOBU6iRUc7sDrPTQNxvhCpYkN/uH1nN08w/nLEzJ/0D9kPOvtuDTUjybeKTGITt4l04lB3iXRzmesUsIzEh72Jdt7/wCk93yWN9fcvQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACcUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5Mg0GQAAAA0dFJOUwDI/8fNFtPG3BTKywNyuhXRURDz/in0vpZO+U3S1SbyLCrUF5OYcSgRBI/buanaTF8C2F5szmQ4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABvElEQVRYR+2V53LCMBCE5cWGVCBACCW9k0La+79bRkL9TiDEv0x2Bo9nb+9DtoqF+FeuKli14lqWagdAXMtS00a7UXeFAEcoBVhCMcAQdgJIQjFADkCOoRSgHkBeCgH6BcjHKALYSZSEuJght4xEUxcsZa+/SH+k3zsPtjsR3BbyFadCNf7hoZZ/tAc3ANRic6rpMbIekHhn2YBEfzYg1Z8LSPZnAmw/nfUsgPt/v38V3wBo6agZP41TJ5AG6Dnn4tRZKxqnzlrRuLxWzKpMiAdw+yKhFMDsTC8qZeZAKTHregSK0Oq4qo74ck2maq5AYqXyceoAibXOx6kjfyyBj1NH3XEEPk6d1R1D4OPU0S4l8HHqGJcQ+Dh1rBsT+Dh1nBsR+Dh1PDck8HHq+G5A4OPU8d2AwMepY12z+2oboZuJOh5gTxfMV5puZ+p0OivA/sHhkThGV7duJ0D0+sCJGAxHp3ExR0CvjzHOhJhgEhdjTWcAZnMxHc6tB5zj4vIK1+JmNBwEcSoegNs7cY8HIbp4DOJ5Uv3iaTR+XrzgNa5mSH8X3vC+BKq4mq8PAMvPRWzn66v6/tmh/Q/qF1ArD8LwrivcAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="128" height="128" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKRUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0QSC70AAADbdFJOUwANFRQGCGG27v/925g4UuS1HgGL7DuG8i9H/uLV1/TYAo8cBE10SVcOyJki+TXNLK1p5/d6g+3vcIolcZebezYWqsUr4PND9hcJHRoT9ULKbgvfMt5lW8lBoSPDfBu4PyTH6aKdH30QoFioIKbP0DGxzGfEk/uubfxPWolonKxeMNZVGJafWX+AXQV3sjMDJtzxakZzbxnS2bk0djmjSrT4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" preserveAspectRatio="none" id="img3"></image>`,
      };
    },
  });
