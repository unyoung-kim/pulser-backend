import { tool } from "ai";
import { z } from "zod";

export const sixCardInformationVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Six-Card Information Visualization' designed to showcase six distinct informational elements, each represented with text and icons. The layout includes:  
      1. A main header at the top for the overall title, with a sub-header below for additional context.  
      2. Six rectangular cards arranged in two rows of three. Each card includes:  
         - An icon on the left side of the card's border.  
         - A title text followed by one or two lines of descriptive text.  
      3. Each card is color-coded with its border matching the associated icon's color, creating a visually consistent grouping.  

      This template is ideal for presenting categorized information, features, services, or steps in a visually appealing format.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the six-card information visualization."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // First Row
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first card."),
      title_1: z.string().describe("The title for the first card."),
      title_1_desc_line_1: z
        .string()
        .describe("The first description line for the first card."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the first card (optional)."),

      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second card."),
      title_2: z.string().describe("The title for the second card."),
      title_2_desc_line_1: z
        .string()
        .describe("The first description line for the second card."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the second card (optional)."
        ),

      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third card."),
      title_3: z.string().describe("The title for the third card."),
      title_3_desc_line_1: z
        .string()
        .describe("The first description line for the third card."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the third card (optional)."),

      // Second Row
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth card."),
      title_4: z.string().describe("The title for the fourth card."),
      title_4_desc_line_1: z
        .string()
        .describe("The first description line for the fourth card."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the fourth card (optional)."
        ),

      icon_5: z
        .string()
        .describe("The name of the Lucide icon for the fifth card."),
      title_5: z.string().describe("The title for the fifth card."),
      title_5_desc_line_1: z
        .string()
        .describe("The first description line for the fifth card."),
      title_5_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the fifth card (optional)."),

      icon_6: z
        .string()
        .describe("The name of the Lucide icon for the sixth card."),
      title_6: z.string().describe("The title for the sixth card."),
      title_6_desc_line_1: z
        .string()
        .describe("The first description line for the sixth card."),
      title_6_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the sixth card (optional)."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_2_desc_line_2: "",
        title_3_desc_line_2: "",
        title_4_desc_line_2: "",
        title_5_desc_line_2: "",
        title_6_desc_line_2: "",
        ...input,
        template_name: "six-card-information-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ8UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6OvzY8AAADUdFJOUwABPnOAYwIIazZVI8r/TOosFOHiIaQP1I2LE9+8/IMwsU+gCzSySgOTlgVBtAqa7xFOfdDEL2wE3eAHZndTDe1Lhch52+ZddVsJ6HbG8xZEhlzW52lt0kKOvs30WOthwdVq2uXccFm9+oxSDtNiOfcZzHxR7AwGlTj4GknwEKW4qf35H62Qf1ZnHTUzevLRw8kmzyid+z3uRYmm/nvZqyqh9WgSiMCHMkOel7moUDF49k0k47MrPG9y5NhgZXSb8RvO17XCgaJfvxyjkrBGtq+7gh63NQK4cwAAAAlwSFlzAAAOwwAADsMBx2+oZAAABJFJREFUWEfdlvtbFFUYx78r6wLiFwIM5KKAiCwLq4DiAhpKgIRCSJq4IKWFCHJLLpuIImBlYgt2wTA0Sw3zglqpWamU3Syz6z/Uc2Z3lp3Z2WXr6Yfq88M+c97znu+cOe/lLPB/QDcrQC+YbQACg4IBzJHGMxIwSyfWh8ylk1AgiGHAI7JhRuaGAOER8ihyHhAc9igQFa1080FEOOaTMbHqr/KP2BhyPuIYr57wn3jGYQEXqs3+s5ALQOrVZv/Rk/8WgYTEJJFRMYuSASxOWZJqTDMBSM9IB2BKM6YuSVkMwLwoRqROUmKCWmApl2UCWWQ2oFvOFTnkSsCSy7x8YBWZsILRBmA1+RhQsIZL1QJryULgcQqdULLIUswSM9ZR6FhyGWcqJZ9A2XoyOhUbSLFfhQDKWfFkpUitjSjnsihUkaWGp0huMleRm2EuYbHlaeFQVbaJW6QaUAhUk1utrKhh7TaKxDBEs+4Z8lly9XaWBAIryR2RfO551u8kG5zr3aOwi41kUzrZyNpwALvFU11zizAHAMjPE0+tQcJcnKoh0Eay/QXEU6S3iMgekh3oJNnVLQytonRMtjySs+X1ijzIIF8E9pI9+6RxL7n/gKTTtzktcdfB/gEySNKJtGkKJAzWHgLwEl92Tlr5CoDD7sWbUQlLC191rVdm4rwj4tc2JH9g2VEdbK/ZxUL78MixuAHxNJLTLCeRh4AGr79Bsmbnm1LUunvfqiBHi+QQCmYQOP42OTzmZog9MUi+I5LciW+BtgqOb7SIj0nfcbK0IUTYck6R77qiKAnYaXRfNc2RMI5WATj93vuOI2w5YwPOlpPnXD5G2mFllzh9D3QfkK2AaWJ0OgrbzwMHtnD8Q6fPoS5aRe10GdUdX6/XXyAvAuZL5OjlyX2W5CtXc8lrHwEf25nrcDF2SVdB4fQblHzSDcN1suaG832mq43suQl86uZTKCZCrVKwPVgF3CIPlgmfzALx29vDz6JgEukssFtD5Q/2JIVr8hFu5+dSIYyNcvgLHXBbOsE75FG1vxrbNd4FTpKV0lBUEvsM0I1wyowvpc7lm2ByGzDMrxxDQ1Z2BFkEJJG7gXv8Wr1AzTryNKLGpXpykBnNqTIEtnMr0M96hbcGd8gCXJFeJzNJVotNJQJNrHV31iKbTMVxUk4ZkZnkYeAbcZWKG20GbnnuAN9+1+zawX43uyZVHmfgwO8zGFJGwYUchRSV3QNbrSIPZFx50KEwa3FdkYkyrkw8727VZI6yFhy4aqHFva9pY4rzVY23Vd5afO+jH9xza4te0d332pEGqtXOmvxQ560nTqhdvbC3Vrsr9xtgONE03Zq9c1PzXvjRBCSQQ252r2jcTBzvBGC5e2H6hvWFrUh1Nx5rZ+OkNGW6+CBf7a7F2Y56VxAGfxrDw3YOSgpt5M9+KUB348yDX3691PdbVrMYygomq98KKmSF5Pv/hEKGCPNfxl1hg3rSL1wKLTylnvMPoSD+rU6wRz3lJ0KhE8nLWaye8ZeH7Rzfs166rf4mY1Mit1L86Qxe+P3cH5cbDGrrf5E/AfM1OurqoJWiAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALQUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wPARyEAAADwdFJOUwAkqdTWqCMK4f/gCUi1DrhFVYuOUhRbTAQFWjvtyBIBLJiKjZYryTrynsfNhV9i34TOxaDxeL0tq/z9gTw9gv4Tu3uX5x996PshbAht8H6RjBUYDI8CPsDpRyJ1d/fa2PQg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" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACWUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AlxagAAAAydFJOUwBPav5raf/UgE70+fNNGlp6JK/8/SX3s4iyP6UXCeCNzgNovVvuGO0ZvGeO9q6peVmqA0zC8QAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAeZJREFUWEftl1lXwjAQhUMrQ2rLKpvsCCIuoP7/P+dJwzTNLbRpe44PHr+n3KRzO00mMgrxjzONBs6Uw/P9O5wrg+f7tRzU++vkoGOrO3BkVQcTV80hHVXFwY4p74ARqIvIPp+dyaPpU0tKGbAOpJQt8j37qRzuKSZkHWod2U/loN4oJRFrongiyciRtIG94ohtELTtVQdsgzDZEWdsgwqf8fsG7fisYuINK70Hl3JJSsg2aBefwqVckhKyDRzAAFsHxXWYbxAV34R8A6c9sEeoC8EAox2OUHHbwCF9xW2DG+RXHife6fZ63U4qzJBfeTrx/uBBrQ8Ho3TkBYfKa0Q0nkynj2OKrtQRBqAWYhbSfKEGizmFM15NwADUYrmiNU+tabXkMYMBqEWTNlue2m7oiccMBqAWO9rzjBB72hmhwQDU4pkOPCPEgV6M0GAAajGk5AuE2NLQCA0GoLYzOFbIAPbg1QgNBqDGU3jjMYMBqOvXgVWJ9M6rCdm7YGv1O6/vwmRMH6pDgcYZbyNqRf+kb+Np5Pn+Gdoc/Hug24qY1NXrdHufX8e4S6J6jXMz0zin3liEyjCib2jWIvPNRagfFZWB7VAyA9O8u7d7gHY4l2j3EOVQJ4PYodZJlm2Zr1H338C/xA8bvhzIZHXZ0wAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKyUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xDJ/bcAAADmdFJOUwA9xfr/+8dANvj5OrObCwqWuOAjHuXjHEHB8+SPDhfoTvzKBwLiiRAz3GtKLyjhAVyuGrGABSdere7x/cspOd9psj7e9nHGBl0Nmr8gO7ntiEvmYgjrHROpGPC8WVQZwLcbpBGe52ijbDHELjD+tAN36U/Qk2DvW92UjtRz27DY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" preserveAspectRatio="none" id="img4"></image>`,
        fallback_icon_5: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHvUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////x2mzFwAAACldFJOUwB28WcEhej/5XoC/mmLWQPzdCIjgpzuEBIJL5qIMgURVrm7hjanLZG4S7r4Bhnn3hP8qR9kZjgLwbI/YzqUzfv2avr5ySh4dzDg7PDQN3W9nwGwZaxKqKpUgFtwX0AMOwqYhwgxM9X02BdHz+rODnyV246TxOtuRlfvrR0aIX+ZJ/dE4SvHicggKhxTVRZxtq/M1uLKD5cUs0ztG/KmhLTFWL48YRh5qOcAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANjSURBVFhHzZdnVxNBFIZfLLyEgCIggiGBRJGgIhrEhqJiQVFRbGADo6LYsYtd7F3sHRV/qGdmN9nZMRPWeI76fNnJvTtPdnbKzgCSrFGjrcKYsdn0To4v16rmI/15spSv3zMCPlkrTxT94wCML+CEQs8UFTNHCiayhCXMBzCJLLUeyhNFpLyWTQ6wPBgCUEFWoDIccZgi75haNU1ccquVTLQGhbYACLBcXqVgutrIGTMB1M5iXQWA2XPUVMwkqJ/b4DAPwPwFJBeWAVikZBprTQI3i5c0LeWy5c1csbI6qOUMglVZqy1a1gBYS7J1HEavI7kewIYWO9tWaBJsTLayCUAbuald9PBm+rcAqEtmt5oE27Z3WMQ6RWwHuQ3ATnKX+LnbTnZU7TEJdFZyS1f33iyG9YQiiHOfvErB/gM9DrOBJh5cxkO93AgcVjJrQorgyNFuR9CRbCXJYyHZ6hUkj+PEKDUVUAQJpOBka4lDuB19p053h/acqZuCmWeVzLnzJoF3fhWEmnlBC6XjIvv1UIz+fuUx09NPxnVBaVR9TSPhv9SlC4DLSk+NQPCKXvnfcPXa9YBXrhffsGvV5ydK8wr0N5OWmwPWv95i9m1LcIdH75Z75h57RaX7t0hmP5CCZsrl0iMPSdFxcfk0MRkiC4H7jx4LOicLe6csp+DRk8RQD8aruLDPmn9CMCDmmuQp0Ks22c0zZ66UM2A/lBA859pBwQu+BE7KYipeNZoEETbIcg9L7KgJL4L2ChOvvQnCessd3vwdwR83IS0GQQbdeJ47FEEGAyl36hhF8NtDWSWjyaSS0XRWyWxBUclsSfu/uBLUPxhmLuuVga5Lfv1FpSP6y0Y2Tv7G19Rvr6QK/byoh9Jwgc1iR6wih7JnUgxlIXj7Tt3U2LS+ewu873UCHyIfTYI+/VVZ9KHskyvw2SSI8IveXz09XxjBVdIJtHDQLLBWJBcNjLg3UY/NgiEOJvavDoMcwkfSCdzhV5PgW8qx5P8GfHdF8kwCDLfZW3iFtmFxGPrhBLIGjN3oHYOgtlE5ySRprHUfcRrm1psEMVdLk8S0QxanmwQ1UeU0lyRa4z7mRcKVqQVFWiQdpeQkLZTD4iL9SGtmAgvGawKfq5UjIw7ILnJ9Ofo9acgem/iiJfgJLCJrpHwVioEAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img5"></image>`,
        fallback_icon_6: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALQUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wPARyEAAADwdFJOUwAMgMHAf/+9I+1JS+8gAQZQv0137PymU/6folKo63WG9K4tL4MY+/pGIXMNdL5IFj3ZAts6DmcxWVhphMRb3dzGglqU4amq4pJu9mFk92sD3w/zh/BRVe6JrJ3LJ1cpnC6K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" preserveAspectRatio="none" id="img6"></image>`,
      };
    },
  });
