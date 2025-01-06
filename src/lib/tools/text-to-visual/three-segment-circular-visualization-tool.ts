import { tool } from "ai";
import { z } from "zod";

export const threeSegmentCircularVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Three-Segment Circular Visualization' designed to illustrate three interconnected elements or processes in a cyclical format. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for additional context.  
    2. A circular diagram divided into three equal segments, each containing:  
      - An icon representing the element or process.  
      - A color-coded segment for visual distinction.  
    3. Three descriptive text blocks positioned around the circle, each connected to the corresponding segment with arrows or lines. Each text block includes:  
      - A title summarizing the element or process.  
      - A description of upto three lines providing additional details.  

    This template is ideal for showcasing cyclical processes, interconnected concepts, or three key components of a system.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the segmented circular diagram."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Segment 1
      title_1: z.string().describe("The title for the first segment."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first segment."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first segment."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first segment."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first segment."),

      // Segment 2
      title_2: z.string().describe("The title for the second segment."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second segment."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second segment."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second segment."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second segment."),

      // Segment 3
      title_3: z.string().describe("The title for the third segment."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third segment."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third segment."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third segment."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third segment."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_1_desc_line_3: "",
        title_2_desc_line_2: "",
        title_2_desc_line_3: "",
        title_3_desc_line_2: "",
        title_3_desc_line_3: "",
        ...input,
        template_name: "three-segment-circular-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGGUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5fTYbkAAACCdFJOUwAHkvD/zhfUONMVx/zXs4FDBpwyESxVjNG3MCiN8Y4JBT18rNDpE/vSJC+X7BYttP4SDbLyCIspBKORI48DN+vYM6Sb77ZCMZpWQYCx1u76EFQmipkUAUjd+cYuNeV4QNoPC6a6As/qIWoKNHmiNtuTifOQKiWIUyvclXs8zQ7mqEeY12YcAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADtElEQVRYR82XaVvTQBSFb+hBLS0o2kLVUlSQVqRVS5BdXHBDBBTtIoILbiiouO/gP/dJMpNMbiahftLzpZl7z32fzJop0X8qoymGMDXv4m6NmniVqt0NEGLYw0NSjREAHnEFxBsgRAJaGiBYgEQy1tq2d197MNUAwQKIIYvtPxBI7UxwAKl0R2cGwMFDLLUzwQHYj4ezXUjmun2pKMKRo8d6eo8rAKK+XB6FE9IgwiGE/pMDouu+mTjQigG5MOQSsQhF1+GodOo0UOjsKJ1hACoPwhQEdZE2ew4iGjqbR1du2H7mABoZxYDTC2NM2SaKg8Z7kZ/oE40AgCYHUfBG0pHPcW4K5y/4Un4AlVuR8wX8jnNdaCv7UwxAF/LJfn9EcYwP4OIIS3EATeCgP+A5ujNoU+v1gD4T1qr2BtBzZHFeef8wAOVwSQ/oT+a98bOlBwxj2rc3XcdlTKjxUAAVcEVtSsdVmHL+1ZQGkMVetSkd15BVwzKlAVzHoNoUjvZpHFbDMqUBlNCqGcQZZLgxDHAG0xrADXRyowBolOQuIppFhxp1UwlebCnBXUR0E2k1qqZ2kHDNIcUzfweYxyTPtPA3tyVeXzYjAC1xf6WQGEDZVLqwEKiP8+OSKGVNoV8hg6ivpzRu8pB+GkPq6RZmeUi7kMLq6Sxu8JAAzKDgxULrqRczPCQA7XNwPgaR9bcxd4TH5Gq55p4n4fW0iDs85AKuwrxrP0TUp2Lop0p1tFafr41WK07QXa+X0WT9RNTTIk7RsLu97nkfQFtLyeT96Pql+XzpionllbRhpFeWYT6wot6O6cTDR1H1j+NYHDaxKs7+8ipM6xDzAN0ZPImof9qDZ90JrIquE1VWca+iAmh8ChH1+/H8RRXL8ttTXKPyMqo+gPVxffLIa6p62YPYKxrFimgX41ijdWz4AfR6Cm9eK21XS3E8f0VUk1uuaPc1jRoDWBeM5FtnPSha2Kyj+YV9ahi0VpT1ZGCeA+wrzrv3H9TQx81p5D8Z1mMdxhriRVFPQ6gHAOKSFc9eL6UmJxc+fN58Bpye/eLkakhbxXKuSviqARAtudc8W1PfSjKzgXXr9eVcBQdRauTod/uieTzT8/2Hcumwp7H486dT/2uLTyNTMFVRF9LTbb6QuDQpZSn/2oZpbSeNS0qXmjGxtZ42hkrrWzDt00nnEtKmvO2cYNs5KH2qUt2o1etfN37zAyWoiJSiCFfE3z5PexDjIVeRfzw9jfE6V747fZhiY/Yu+df6A70mc8wWvg1WAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK7UExURQAAAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////kYbJwAAADpdFJOUwAfTmx4c1stAhW7uSk3k+D/5YQQ0vh7BQFRzP3PMiLA+bBmEQQkxqWSyvuHCD/u6hZh7+xqA3X22Dzz/pANrZ8UJsIMVQ5EQbpHGIOcDyCgEkCqL/pi5i4cSDWCaxqx3AqF9UkxBtRvqRt/E478uM2uv/BnjGCR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" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALHUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4augDUAAADtdFJOUwAMIBkJ6v9aVcripyG64efG3w0L8il+KM9im5UEl0gBkHo57Zo0B2EP1GQI9j+C2b1E6MfL5BFsK43w4LsGXM3mEhrukUFHPiQDEIj0tEK8srWK+/VwF+8coPzawcX++BucFFloLLC3J6+k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" preserveAspectRatio="none" id="img3"></image>`,
      };
    },
  });
