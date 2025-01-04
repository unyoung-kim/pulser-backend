import { tool } from "ai";
import { z } from "zod";

export const coreMechanismFeaturesTool = () =>
  tool({
    description: `
  This tool collects parameters for a 'Core Mechanism with Features Visualization' template and outputs them with the template name.

  Purpose:  
  - Visualizes a central gear representing a core mechanism or process, surrounded by connected features or components.  
  - Highlights the interplay between the core mechanism and its supporting features.  

  Structure:  
  - A main header and sub-header summarizing the visualization.  
  - A central gear symbolizing the main process/system.  
  - Four surrounding features, represented by colored segments of a circular ring around the gear.  
  - Each feature includes:  
    - An icon representing the feature.  
    - A title summarizing the feature.  
    - A description block positioned externally with up to three lines for details.  

  Parameters:  
  - Main header and sub-header summarize the overall system or process.  
  - The central gear represents the core mechanism.  
  - Each surrounding feature includes an icon, title, and description lines.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title of the core mechanism features visualization."
        ),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Feature 1
      title_1: z.string().describe("The title for the first feature."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first feature."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first feature."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first feature."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first feature."),

      // Feature 2
      title_2: z.string().describe("The title for the second feature."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second feature."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second feature."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second feature."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second feature."),

      // Feature 3
      title_3: z.string().describe("The title for the third feature."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third feature."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third feature."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third feature."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third feature."),

      // Feature 4
      title_4: z.string().describe("The title for the fourth feature."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the fourth feature."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth feature."),
      title_4_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the fourth feature."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth feature."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_1_desc_line_3: "",
        title_2_desc_line_2: "",
        title_2_desc_line_3: "",
        title_3_desc_line_2: "",
        title_3_desc_line_3: "",
        title_4_desc_line_2: "",
        title_4_desc_line_3: "",
        ...input,
        template_name: "core-mechanism-features-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAITUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wl/jeAAAACxdFJOUwABSKPd+vkpx/8Hk/BC8uV4LEGSpg2lOObG114E2nmi2d7cpEnYyCoLy5/RX/RgygnrG7oKoDfuNlv3vRNSqBArAoeVDrJoZLgSI1aK79Ai1ECplAjb7PtXJLsFiO1PKGwu03YRkc9E8RgDas6wnb7hL6f94lNY6Q8Vb7Fpw4yv6I0tlzKP6q1NFxZ9tc1tFP71Ho7Srk4f9jzjSj3g1R3WyV1+/HvfiYC5WsDzg8FQ+Of+u+4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQtSURBVFhHxZbrX1RFGMdnF3b3/JaNZYUNVMDcLIT15CWUFJSIxDJIUxSVYrXSUsFryuqmWBa5XXCJCrqX3S+Cf6KfmTPnnJnZmT286dP3zc7M8zy/M89cnllC/htC4arqSLS6KhxSLcsjZoFjxYTheE3CHackauKCUeSRWiTrUvF4qi6J2hX+eI0YTqkXo3xitWhIO830o6j155BAo+9FSCMSYtcjZKHBSz3UAMvrAJ6Tts8JoylNyMpVq5tpL51E2LXwALYUllmgCnXMiBYm0Yo1rsWiUXwpKghUI8WMjzkSKVQrDt5SGASioLsDNK9uoR+KI6o4eHEGgYhRgKXAjoiTCxfwDg23rFVTyLgCLKBcQIynQ48bF9ELMPR5ex2SaUKsJ/g2NpVtY5BA6En5IK1UD5JewGKJsXabcJQbxKPMA/hxMAuwy9RKL1Nrk3SZxLkKfTUF3XVe306/arhMGgESWkcLSmaNW1A6kDVfZxrkbq46Sc4G2G30FtXLBaXeKSjBAm02nlLHBHQpyGTRoQ6JBAtYG9fTeWTd7VOolMKmqs00ecoGG+2y0aWCwJaNwNOs1dkBbKXz0GBOYVsSmS48Q5vtsI3raBTYvgPdPTt39dK2lX1WsMiIWysI9D0H9LMLKRLSPFVqQXF4fjciA6y154UX2W9o70uD3UMvaxR07NuPza84zQM4SH+GD7EvLFNgxWHs38fbqZERWuOGDw11Dx45urz4gQh284pACDmIY5JVg78MiRgho/3Aq32+tec1jIneGvxFTORITzd2bJfMx5Fh9878vIvbfyKDpm1+l9L8Ot6gv4Z6IAm8eXIEp7a4PZe38PZpc0USBM6cPQxgXMifM4Fz6jmV+ryVywLnGy9gj+hFuXgJl/cGC6TfwdorhFzFZF50u3b9FD2iedctV7DtAqu1qsC7sDrpkb2Bm1706NhUBLj13vueW26I7QBVUAVu87l/cDl6zRm/+OE0EP3oDr9TzK2AqeLHEyhoBE5i0Ol+8ukwm/o4gM9m7rpejpuNIiFF2GUCm7aWMPu5OzI6NhUFJudOeNEaAe+NY5Ya2F/gktO/OzcJRL/8apQQ0t8vCxQwUSw6KfhQyzRi8wulr+nXr3cByPKpoyS5kRhbxKGcH80t3+Db777HDz+S8E/Az/ciJX6e/UR5M0a3kcXLKfxChUv4lX69lCJz7h/MMgEfeRH7fsv8/sfRAyPo+vM2/iL5SfyteAUIcNLzzaR3GnfIAH8RBFvwZXIZQEv6Hv5Rbcu5zg5nxrFQwlnVZnjeNQJk/nzp3/tli2hG49TpvikaWzmVnCrZHKSXSY/hjwFH9dahxkgEmIM9FiBVsHLymFWHJBZxnP74N8PHGZvBomqQWMKDGa9iytCx/MwDLKkGmUF1yVR4pTOztDirxvjMLgZ8///mIR8Lo6c+g5iOAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFKUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2ZxLZ0AAABudFJOUwAju/r/BttB2BBumAHDQ23n+7gkE+0Zg/7yYQhevfzsvl9gWhKmqRp26flUVfhd8f3MYg8OyyLGzkdGx1kENwPmGGOhz6Jkt0CztLFqNhQVa/Nc7nzvgWdSUaUHk/A4wplvRNm6fbZoW3WyP6BWRcnKCQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAA6RJREFUWEfdl2dTGzEQhhfz0gPmAFMCHNW0YGowBmJTg+nG9CSQkNBCyv//mlnpik7o4AKfkmeG0UorLT6tdrUi+q8piZUCQGmsRNdEo6yclzPlZbouEhWorOK2qhIVui4S1aiRQg2qdV0kvHWepSi88sVa1EmhDrX+qDLBQLzeamh05KYEmqXUjESTM9jYYNXH3dkPaQFa0faaiNo7Om10ueNdsLt72omotw2tQEtwlU8LrL7+JDAwODQMjMTeuIrRWAoYHhocAJL9fVaYhRZYo0Q0No4JYHJqWtW9nZoBJjDeweZCLMTleqL0LDJzupZoPoOFtJBGLZj2oR7vHCmbW9R0gsVc1pH6sKTp2D1Wa39wZHlldS1h24m19+uOO1z6Wy2DN/NIqt2NTdsNBcDe2lB1SeTVrkNjG8a8TkkeSG3v7O4tZgu5/e0UkPdDcgxF97AE6MW43CSigyIOj/Z8VdPRMYoHTic9jl5fpTKABblNJ0BSWc4UksCJkLKzGAjqPAYnkOP2BNapriM6taSFHCYGdZ3DEDLsvwNYZ7qK+WCBv2IxgyFdJWkfxjzvXxGG/8+cosg7OY9hjouH9GCGmzw+EtGn8wvfiz7CfZPo0dcKujHF/sch79+5vtSBz8MUOvW1TJOd4vjZwhH3LvBZn0BER9gioumU7eYHh7KKeM2XBGJ8fu2UUALBKZK9lL1MRDEc1l5+rfBydYnM310c/+vYFmNsYGHB/3PYxgqHY5dYUO4ezhgqL6u/SeeuYucxA/tYFe1yXXXNlfjJTClE/hesYVe05k+gHNY8uQqljqROTkCe4RADBST8jjdHnWxDJhPNez62PzfEgIwnfZ3HUwYSKDwYUzB/QnATRUCGGcgh48n+JsZwpbhxX7QhBoJuvHZG3YPEWV09SAbMB0k7ysKPZgMhR1kSDCazgRtscjCN6MEkccP5mP1gNFA4FuG8Yg5n6sEkN/J+MBpI4pabsITipLR0EXdmA6coct6fC0tpgaRqMHBm4btMqve6ykFJ63cPDURI6+rFohuIcrEErzbc6Fcb/34m7GoLXK7pWyD1Yz9XyGYLu+JyvXWNh16uDcHr/effXu+mAuOXLDBW1/n8KpgLjHr0OdLzSpyXF1lc5v32y7yVQJk3HaHMUwrN5ntRaMof5BWa981PFJqPlrqdUUpdoviSlX+82M5bS8bv93hhuR/geQ8OhRc/ebxH19UzH10vfvZ5D8/rZz48/xX+ABnxflX79E7WAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJhUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4dus+oAAADLdFJOUwAhODkiTtb/12n++eLhJZEOGQgEGwEGGiSIub7wUebSHUHqyxa4Zn7uBdChHm9xR92SZ7e/W5nKEOu8qPwK+K0++7CNXqZ7mlA6kHACY0xoRXUoDxHlAwns9cQ/SxN/2mHv3M3tXM9f04qE/XkXUmWAfEBipGrOKdS2PaLG9BTZM/c1jKNs5KrAw21NLDToSfEqMGQLDUYcH+Dy2IfBJ1OzmC5rLb0M46lEQ/PI6XqywncxtUisNlpV+qCrEvZWmweVj1mUuoVdx3I7TuUpdQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAA7dJREFUWEftlmlbE1cYhh+D+MCMhUAMqEVUBEWkSmQtxAgKWCiCSgiiIqCiVKQqtSJoBTeUprVWpZvYunaRVmu1dalt7WJdflWvScbJmSGZkM/l/nTOe55zXzNnkpkXmGACgUmWqAiwTDZsj57CCImJFvfHSpSnvhIBU2VKsYH9cTLjrUBCIgDbNLuoDkpSst0aT3m6VpjBmYD1VabMgiWVs+fo0mOZm8Z56ZjJGVolg/OBBZSYuTCLEhcByH5tcTCWKPEcSnRgKXM1QR7zgQIWkkWvs5DFAEqMh+bHuQyAi4Vcjnzm6QWlZeQKrCRZDqC0oiQYlUp8FSm9MVaAquo3E1Gz2lGr1UNgq4tfA4Ng7bpw1ANuXWGtThCeBk/jekNJFDSlhKPYbtugKzSNOYMIGXuIwUjeuKk0wVj0Mw5B8+YW373GVLqNS+MStLaRzi1bc5zktnbjYniB3UFuz7cCKNrRQb5lXA8r2MnOXR50vb17VjpseyTuNQbCCLolvoPkEifJsn3L8C6dUYaEucC+nwXoSSUP9B4g+4CDPGSImAv6+N7hxH52DAAYKK8BEo7wqD5iLjjG4zjBwcP+mW3HZJzkTn3EXHCKrRji++rMy2LEMkMfMRf0cy7a+IE6+5Cn8RFn6yPmghZ24ww/VmdnmYYl7NBHzAVDbMc8nlNnsRzCOd+bTsBc4OAq7GLLed9kOIeLcdD4YzQXfMLM4foGnvoUwGcb+Pl59xfKr0HEXFBzgSOIOkNXb0GGzLYBVHN9kj5iJnBbEE1nLXou+l9dX+KrTvKS8uEKYCJIj2EfLtNVDly5uvnqNWC3zN4jvP61mAotcGfxmy7YviVzu2sAeL4rJvd5bozyUJEQCykY/p4/rFOO4aZMbrt468dM0nXbDlS1cXt6IBdK0JjHzLO+kVemrL7AL3mUwk9pjJmmBUMIku5w1OIb3XXx58Zf8pfeG7j/gA+Ve0HPIHO01iS4wP4rufeRMrrxG1csVKu/O/mH0jU89ro4GKcWgwuyfVfc0oyNTbzzWAu0d/JPO/4qUxb3qLXgAvz9z/UGibVVo3wiPvbWTlbjNJv2V1Q2q6UQAoXlrEhhntIJBJgv8TI5rscI/EtyyP8/CnBCIlPFgongKflsWCz4eC5+js0Fca5C8Vpfcls7Px+iIFdpsgQevXx+erp0DaDYZI0obV6kPOGINp4u01GvWw2L1SE2mqiLpNXNysbR/geU6kShN4JmW3qBcnKKV9wfUbvfo7zoJxm2T/A/5z8YGObUCbA6TgAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ8UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6OvzY8AAADUdFJOUwABPnOAYwIIazZVI8r/TOosFOHiIaQP1I2LE9+8/IMwsU+gCzSySgOTlgVBtAqa7xFOfdDEL2wE3eAHZndTDe1Lhch52+ZddVsJ6HbG8xZEhlzW52lt0kKOvs30WOthwdVq2uXccFm9+oxSDtNiOfcZzHxR7AwGlTj4GknwEKW4qf35H62Qf1ZnHTUzevLRw8kmzyid+z3uRYmm/nvZqyqh9WgSiMCHMkOel7moUDF49k0k47MrPG9y5NhgZXSb8RvO17XCgaJfvxyjkrBGtq+7gh63NQK4cwAAAAlwSFlzAAAOwwAADsMBx2+oZAAABJFJREFUWEfdlvtbFFUYx78r6wLiFwIM5KKAiCwLq4DiAhpKgIRCSJq4IKWFCHJLLpuIImBlYgt2wTA0Sw3zglqpWamU3Syz6z/Uc2Z3lp3Z2WXr6Yfq88M+c97znu+cOe/lLPB/QDcrQC+YbQACg4IBzJHGMxIwSyfWh8ylk1AgiGHAI7JhRuaGAOER8ihyHhAc9igQFa1080FEOOaTMbHqr/KP2BhyPuIYr57wn3jGYQEXqs3+s5ALQOrVZv/Rk/8WgYTEJJFRMYuSASxOWZJqTDMBSM9IB2BKM6YuSVkMwLwoRqROUmKCWmApl2UCWWQ2oFvOFTnkSsCSy7x8YBWZsILRBmA1+RhQsIZL1QJryULgcQqdULLIUswSM9ZR6FhyGWcqJZ9A2XoyOhUbSLFfhQDKWfFkpUitjSjnsihUkaWGp0huMleRm2EuYbHlaeFQVbaJW6QaUAhUk1utrKhh7TaKxDBEs+4Z8lly9XaWBAIryR2RfO551u8kG5zr3aOwi41kUzrZyNpwALvFU11zizAHAMjPE0+tQcJcnKoh0Eay/QXEU6S3iMgekh3oJNnVLQytonRMtjySs+X1ijzIIF8E9pI9+6RxL7n/gKTTtzktcdfB/gEySNKJtGkKJAzWHgLwEl92Tlr5CoDD7sWbUQlLC191rVdm4rwj4tc2JH9g2VEdbK/ZxUL78MixuAHxNJLTLCeRh4AGr79Bsmbnm1LUunvfqiBHi+QQCmYQOP42OTzmZog9MUi+I5LciW+BtgqOb7SIj0nfcbK0IUTYck6R77qiKAnYaXRfNc2RMI5WATj93vuOI2w5YwPOlpPnXD5G2mFllzh9D3QfkK2AaWJ0OgrbzwMHtnD8Q6fPoS5aRe10GdUdX6/XXyAvAuZL5OjlyX2W5CtXc8lrHwEf25nrcDF2SVdB4fQblHzSDcN1suaG832mq43suQl86uZTKCZCrVKwPVgF3CIPlgmfzALx29vDz6JgEukssFtD5Q/2JIVr8hFu5+dSIYyNcvgLHXBbOsE75FG1vxrbNd4FTpKV0lBUEvsM0I1wyowvpc7lm2ByGzDMrxxDQ1Z2BFkEJJG7gXv8Wr1AzTryNKLGpXpykBnNqTIEtnMr0M96hbcGd8gCXJFeJzNJVotNJQJNrHV31iKbTMVxUk4ZkZnkYeAbcZWKG20GbnnuAN9+1+zawX43uyZVHmfgwO8zGFJGwYUchRSV3QNbrSIPZFx50KEwa3FdkYkyrkw8727VZI6yFhy4aqHFva9pY4rzVY23Vd5afO+jH9xza4te0d332pEGqtXOmvxQ560nTqhdvbC3Vrsr9xtgONE03Zq9c1PzXvjRBCSQQ252r2jcTBzvBGC5e2H6hvWFrUh1Nx5rZ+OkNGW6+CBf7a7F2Y56VxAGfxrDw3YOSgpt5M9+KUB348yDX3691PdbVrMYygomq98KKmSF5Pv/hEKGCPNfxl1hg3rSL1wKLTylnvMPoSD+rU6wRz3lJ0KhE8nLWaye8ZeH7Rzfs166rf4mY1Mit1L86Qxe+P3cH5cbDGrrf5E/AfM1OurqoJWiAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img4"></image>`,
      };
    },
  });
