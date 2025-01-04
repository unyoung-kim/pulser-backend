import { tool } from "ai";
import { z } from "zod";

export const flowchartWorkflowVisualizationTool = () =>
  tool({
    description: `
        This tool collects parameters for a 'Flowchart Workflow Visualization' template and outputs them with the template name.

        Purpose:
        - Visualizes a sequence of tasks, steps, or actions along a linear flowchart-like structure, emphasizing progression or a workflow.

        Structure:
        - A main header and sub-header at the top summarizing the workflow.
        - A horizontal flow connecting circular nodes with arrows pointing to corresponding description blocks below.
        - Each node represents a task or step and contains:
        - An icon visualizing the step or action.
        - A title summarizing the step.
        - A description block positioned below each node with up to three lines for additional details.

        Parameters:
        - Main header and sub-header summarize the workflow.
        - Each node includes an icon, title, and corresponding description lines.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the flowchart workflow diagram."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the workflow."
        ),

      // Step 1
      title_1: z.string().describe("The title for the first step."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first step."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first step."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first step."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first step."),

      // Step 2
      title_2: z.string().describe("The title for the second step."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second step."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second step."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second step."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second step."),

      // Step 3
      title_3: z.string().describe("The title for the third step."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third step."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third step."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third step."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third step."),

      // Step 4
      title_4: z.string().describe("The title for the fourth step."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the fourth step."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth step."),
      title_4_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the fourth step."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth step."),
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
        template_name: "flowchart-workflow-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJGUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9lc8+YAAADCdFJOUwA5iJ06Apj/mXP0YuRLIKa9VTCwuEFCSgES79D9Pun2N/foCSqEhl3uExcL+8/t3Zosn/wH5xjINuPzL+IhdXdOGa9IJ6GpJvJx8fWO0urs5YngoGdm1oyN11rBGyI9vytwNYB4HR6t4RYIi8rCBQZMkLxNy5Z2lTTU0X1HLTvwRV7+qATNqwNDe85PDBxo3FSKUzgReZNgknqjt7ZJm7Mo+oW0amRsbQ8KsRBrxRXa23JWtY/AvlcaW1yBfw6i+DyDPGNWtwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAA8hJREFUWEftlulXU0cYh18i4QcUN9CCGERBq6A02kQxARcEBUEQkVxUaAVcg7uCGheiUXEFV0ShYLUG9xUVW+r2n/XMvTfJZEJGck7PqR98vrxnZn7z5M7cmzlD9J1viSjDqBFjiBZnkzEGERFrFARxiDf8MGIM8YgTBAkYTTRm7LjxlJg0YSL9OCEpUUgEkYyElKCOSUglosmAKW0KkD51GpCRSdNn/DQcM4loFrKCBNnIIJqNOTmIxc9mzIV5FubRL+LKNSxWovlYECqgXMCy0AbY8+xAvpUWLV4yHEspnKAgZlkhFS1fsZCmrlheHBQQCRWUrIyI0hBBxIiCslURER8iYHsQAaF78P8J0sorKioqVsPEikqlIfgr9ZOyptIfMmE1K+VpVCXuLoBCcapGoZgDUEVAlsBaVItTNRxYK2YBAsRcTHhBjNilCaIVc4AauWAdF10frQs28IuqlQtq+ewGXUB1vwawygVWLlrnW4KAVCDAC9JqVJLlgmQt9ZvexQs2autS5AJFS23Uu3hBfYP6R2+UCxrVUEO93vVf7IEFmzg2b/maYOtmPo85tI1/scB2p1zg3B6c30ZNDmbaAbtq3Ildu/2CPXv37S8v37/vwB6/YHctmtWgHTtYcTTpct95kG1Diy6wLs7w/UzGQasuOASbdg6EPVAOp6NSFdS7gCNHjx0/fuzoZMDFtt2BBExr1HJhBTQTgIOo1Q3lhG/0hAJ3KxMAJ/Wu8AJaB08rFaXiVGZgOPMUUouo1YNVvh6JwLg0ik6fQdtZdoidO3/+HLsJGNtw4TRFXfTfCiQCRjXMl4ioPZdtYW47EV0yo4NPyAUpl3GFiJpcsF29aoOLvYNruMyftXLBdVSxZ3VAuUF0Q2GbSsYqRHERuaATN1lpQxcrXWhj5RZucxG5oFub2cOuPUSj0cNKF7q5iFzwO3pZqcFcVvpQw0qv5tGRC+7gACt/3PXca2+/57lbxFp78ScXkQv6cF+tXhN7jSav2riPPi4iF/Rry83rzGGCnM481urGAy4iCh7Czr48nWK4H5HzceBf/9hJj1LB3ZrO2vEk0GIoeMq1niHu+Qu4Wzq8Xq+3o8WNl85XeMYFnmI912K8hmfgjf8C8xal79Bc4BssaMa7Urz1D78Z8GAweD5Rf3rgiVVK3gcG35cIg+n8fug4/9LOdQ0F+erL0yjOh8INNvzt5GcOS50LZUP6dTjrnzK46sTE1/jwEfjUM1RdPdTzCfj4QRwfAZ8HLNqCLQOfxbER8nzwS2zsl8Fssf873xr/AmVwLIgM4DxYAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKaUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2vp5pEAAADedFJOUwAtXGAGp/+G4YuE5/seAREdH+RandD20Z5eFOMEsHwHtXUJsmk6qvjv08XS7bFECumtD6QV8p8quFUbF0+WxDYCCwN7+dxkBVj9jnbuyhr61SnG67wOqeW7CBh61I8oObSvSi47ock1S6K2mXiJrLpSU/XzDF2SkddfRuIZJkUkPis4JXBzFhMS/t4vz/whECzCoEdylWiAdDQN9OYcg2Vqw7nf4EPqfWPdTaXwyPdBUNhmQGszVEgjMknZx7O/zr7Wy3fxeVknIJqjcYGNMDHAmzfbQiK36G6mvdquW/xgeoQAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUESURBVFhHzZaLV1RVFMY/FD5RcAZRRgTGKTKREUNHU7TEAUfpmsgkIWL4qnyb8VAxGRXF1yCIViQxWiQ+skTTpCy1snz0fpjZ+39pnXtnxnvPMCPYWq1+a7HWud/Z55t7D/vsfYD/AVF9+t4nfaIARMfwXxATjX6M7T/gPukfy36Iix8of1MQk3lggtkkqzoGxceBibKqYR48JMki3tIyNHlYijwbIJFgKpBmHQ7bAw8i/aER/omHR2aQHJVpt4/OIhk/5hFppZ9UzSB77Dg4ssZjwqMTVXlSDjkqefIULeixx6eOJXOnGZdq+A0Q7QRsJiDPCSB/uoszZqbr4wqeGEpllk0vaQQM9DhyaHkyWhLhnDmbhXNkVTUoSjISR/dTcpwgYS6LpdCkpCJCTg3y6RJ5rYZtnhwpAEvNOlJyOb9MXhkgfx5HL9BHm82l8h48w/Iwvy+w2bnQqMibuMhl6fb7AyTMVhYbBNlgCZc+q+c5AM/rhWVcbkhtyWCFvEPxJZgmaysjGKzi6jUG1gLpLxiUdXyxW4OoisrKyslV1ev1s92Rn6hsqBRUiGISNBjuf70YOT6UWcFvGa47TK7qjTU1NZv4khweymbW1gg2VruygwYeFoo5O7dg4FZgWx2wfQfq6oGtCcBKT9nOQcjbtRt7du1FibdBcyqkRzYozsiHlfvQ2LTfFJvRrGTigPcg6vjyKxyPV9mCAXwNqFW0UxlqYGMDsJaHtpCtrzMXmaw/RGXOQo5o840qsPOwM9O7DZhLrQaGGuxhEnCkqXEtvfY3+CZa2Tray/aGDDNWcZji4ga+BeAot0cywFF2FMcoxywOLIhvYLKvgSOB4zzBkzzBt9WASWEMbDwFYDC55h3yXTWxWRejpp4zlqdtm1glDlonE8IYIOuME0jP4llbFkURrWCq8z0mpgE4yWT1TxRiRStXeoPdPOdoa2srZL0oyOeB9/uKENP5xXBe6BLDgg+aUTa5DUCzt6NN4DjH3UEDk9ufXMNU74h8GMzEctPdVL64tNztdp/qSSrXMNYtKF96MeQ05lX5xEtGJO2w4tE9Ssd5GY8OuQdW5ujWywYfeYMfGJ6PIxjAyjGbI5LMzkglDfVnMkQZDEvCbGWHQZAN0MpLzfpnI7bLnGVUQgycV/iJoa3qSVvHTqnBhhig5FN+5jAoQcrGkcau0J0BJjTyqnbcJPYvZxU/v+cbACWrafkipL3nX7hG+5RcTjXK3RnAed3FhvPZesm24So5PxpHTvCGXu/eALh5hby26saX2r98TsVXxeTloowuYLNSvahAFxnGAFjxtbihVZ8r7HSfJllkPYtveKoZ+JYupu4SNyGVsAbA+sqW5WItq4ZOVK95pnG0mvYuoXKsid8FoiIYqKz3THEEU9cxgy3HeOl7HMjyVvq1exkY+eEMOU+UxZXe09s0qXcG+ancqY36sVHL11TCW2qMikAUD/pHaT/yJ3VQ6sUM7y1DVATuGsATp9bPW96f0U5LjjWE5DyktcjiFTKwebjd5LNacyxsB6775JpDUrmJFHHdlglsHjBdPPqui2H2vq4QfhHVQxa7uhYGNg9w3uGdfYZ87wnBzRPH1lclelYv8fx6t/lcpdk42SNuN/m07o7bSq082SOmc5N6lfvNpTb73uO8w99NKBlJV7s81UNSavlH/w52rJAnesyBP0n+tVeWe0HB8b8jtp//mH8A3/BuQzZPvlkAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALWUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xPx75UAAADydFJOUwAoYZK51+z6/vm6k2MqAT+W4//mnEYDDHDc56l1SysUBnSo5OF4EAkHc+uEMS1/2/B+C7JXQ9rETwJFu+JQoAiU1Eg9y8gfzvh5BTjP1dFs9DM06DCwEmmke/EP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" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJSUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xecyUsAAADGdFJOUwAJp6gMvf++EMWsq8YBEhTNowSiBvlUGdSYApettvxeFtr2d9u0Pez9aDfwLef+cw4V0vHoxybificDoc7R690dben0WnFs1eo/pNnTW4AcyQvLTcy514pkfIWJeNap5uWBacoX8x+gxCyu9SAhHg37MEaRMdhEGEuSKpNKM6U8G3/hWeCWyOSCuCMk+AfA97AR+tBhQVC6kLKqD2B6BXt942I2TkxW8l/u7Tk+OHaeWEmOUpqbwnVuKy5PKUVqNQpHvyIa31FcsYUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATkSURBVFhHtZf7VxNHGIZfCn3lFqCAihQiharBSCKoFaMGFGyQCJqgeCk1aGlVsEkUFe8I3lsFg6IVLa3aimDVlrZW7c1W+3/1zO6SLJtkE85pnx8yM99885zszGRnAvy/JLyRmKCNTYWkN8lpSdpo/CSnMDWN6cnauD6GjIlaZhbfys7OYVbmRCTDEEyLSm7q9BlybWYeZ+UD+W8zb6YcmTG9IHdScgQSCknjbFEreofFaSVASVox3y0SkdlGsjDGnCZN45y580ylAOYbSZoBM0njfAClpnlz58SY0+R0puViQZnFCmBheXnFImBRRXn5QgBWy+IFyE3jEp05zcxiTjaA95ayUgpkiW+QJVUruXQZANtyrijXDAtiWEnaq6qxanUNuUpEatcAa2pFbRVZs/p9VFfZyZVR16LA4ajjWtTT6VjXIAIZpVZrqbSsDescTtZjLescjgLtODWNkmC90tpAkhuUxnpJ0KhKjsQkgYvupqaNdMmtGAJDw6Zmp7NEEdg2u7cAW7kN2MatwBb3BzZF0OJ0Oj/cviBs/HKayjytO4Rg50euelqY52BrEdDmoSOPFta73DuFYEerx2Pnx1pDA9M/EaUQALu4e097cUfqXhH6NLWjuGDPbu4Cgo9Qy+0awSaTNF4WeNnsA1SLZQB8zfSGBJjnCPVKNC+WS0mQ4PHvEw3D/s7Cws79kumAvzVBJfAcVA0WHPTI5aH0LgCHeQTAUbdYRdJ9FMAxHgfQlX5IzosqkFkvHvGE2XKy2+XqPmkxnwC285Q6I4aghy3w9RpPy63TxjNJaGGPOkNP0HX2HM9noIUXJiIX2IKM8zx3VjyejJ4gkcaLnwEVHb6JiK+jAvj8opGJwSQ9wZJLl8WrzdQX6u0zidDlS0uCEV1Bv/hM5pVQ7xUGRNEfnyBloLYNyO+4Guq92pEPtNUOpAQjeoJKsvgasMki3kASyywXgWvFVN5TAj2BYdBqN+7Ddd6wyQHbDV7HPqPdOhja3XoCaSd+Adzk0C3RuDXEm0CntBODxBCcEjvR10d75+3bnXb2+YChKe3ESn4JYLikTvwU6kqGAXzFr9UZ+oIi/x35gMztvnu3WwwHMu741a9zfUGg33wPgW+alCPk1rdNAdwz90t7QUFfgPt+c+MIOfJANB6IWqPZf1+dEUOA+36O9vSMmR4CD01jjT2jnBh/4jupiCXAo8d7gUE+AZ5wENj7+JHSkeL/XhSRBT8sz1ExPmwb8OTkeAZsw+Oh6Eb6f4wq+El+hSn0t2GzKDejq39Sx89RBdnVXhVi0jO9XnG/CYSiBXwqbgiRBfFwZI50wwgXjB6fEqNhgklPGQdhgpFfpsRImCDeOVAIn4OIgp6qqqqqSefBBGGCrBpxu9Jyobe3tzd4PKjIrpGvXiHG+UwT0eUZxzWRmXWWROuaOLEmWuqU22+I5yu0C6XHiufa8YDhRdOvKq6xL9So4HV1X9OLqDfFEL9xVqihnExT4nfVKYJjPKDui4tnVG4Hgj8o/QOYEvUMnmzAn+rniY/8sjLVRGWPnolj2kK8DAQOsz6gYoh/BQIvtXlR8P5t0S67jGWaV5sbkY182h6Rp3RrcyPxSn01mcwVvtKGIvCau+XTMIzhFL7WxiLRzrF/IjLGdm1uRFzjzdqhMs3jyl+P/5R/AX5QtzzEtq1oAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img4"></image>`,
      };
    },
  });
