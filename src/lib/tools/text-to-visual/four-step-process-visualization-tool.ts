import { tool } from "ai";
import { z } from "zod";

export const fourStepProcessVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Four-Step Process Visualization' designed to showcase sequential steps or stages in a process. The layout includes:  
      1. A main header at the top for the overall title, with a sub-header below for additional context.  
      2. Four distinct steps, each arranged horizontally in a row and visually represented with:  
         - A colored banner at the top containing the step's label.  
         - A circular icon below the banner symbolizing the step's concept or action.  
         - A text description area beneath the icon that includes a title and up to three optional descriptive lines.  

      This template is ideal for illustrating workflows, procedures, or methodologies with a clear and structured progression.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the four-step process visualization."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Step 1
      label_1: z
        .string()
        .describe("The label displayed in the banner of the first step."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon representing the first step."),
      title_1: z
        .string()
        .describe("The title for the description of the first step."),
      title_1_desc_line_1: z
        .string()
        .describe("The first description line for the first step."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("An optional second description line for the first step."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("An optional third description line for the first step."),

      // Step 2
      label_2: z
        .string()
        .describe("The label displayed in the banner of the second step."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon representing the second step."),
      title_2: z
        .string()
        .describe("The title for the description of the second step."),
      title_2_desc_line_1: z
        .string()
        .describe("The first description line for the second step."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("An optional second description line for the second step."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("An optional third description line for the second step."),

      // Step 3
      label_3: z
        .string()
        .describe("The label displayed in the banner of the third step."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon representing the third step."),
      title_3: z
        .string()
        .describe("The title for the description of the third step."),
      title_3_desc_line_1: z
        .string()
        .describe("The first description line for the third step."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("An optional second description line for the third step."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("An optional third description line for the third step."),

      // Step 4
      label_4: z
        .string()
        .describe("The label displayed in the banner of the fourth step."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon representing the fourth step."),
      title_4: z
        .string()
        .describe("The title for the description of the fourth step."),
      title_4_desc_line_1: z
        .string()
        .describe("The first description line for the fourth step."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("An optional second description line for the fourth step."),
      title_4_desc_line_3: z
        .string()
        .optional()
        .describe("An optional third description line for the fourth step."),
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
        template_name: "four-step-process-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJSUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xecyUsAAADGdFJOUwAJp6gMvf++EMWsq8YBEhTNowSiBvlUGdSYApettvxeFtr2d9u0Pez9aDfwLef+cw4V0vHoxybificDoc7R690dben0WnFs1eo/pNnTW4AcyQvLTcy514pkfIWJeNap5uWBacoX8x+gxCyu9SAhHg37MEaRMdhEGEuSKpNKM6U8G3/hWeCWyOSCuCMk+AfA97AR+tBhQVC6kLKqD2B6BXt942I2TkxW8l/u7Tk+OHaeWEmOUpqbwnVuKy5PKUVqNQpHvyIa31FcsYUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATkSURBVFhHtZf7VxNHGIZfCn3lFqCAihQiharBSCKoFaMGFGyQCJqgeCk1aGlVsEkUFe8I3lsFg6IVLa3aimDVlrZW7c1W+3/1zO6SLJtkE85pnx8yM99885zszGRnAvy/JLyRmKCNTYWkN8lpSdpo/CSnMDWN6cnauD6GjIlaZhbfys7OYVbmRCTDEEyLSm7q9BlybWYeZ+UD+W8zb6YcmTG9IHdScgQSCknjbFEreofFaSVASVox3y0SkdlGsjDGnCZN45y580ylAOYbSZoBM0njfAClpnlz58SY0+R0puViQZnFCmBheXnFImBRRXn5QgBWy+IFyE3jEp05zcxiTjaA95ayUgpkiW+QJVUruXQZANtyrijXDAtiWEnaq6qxanUNuUpEatcAa2pFbRVZs/p9VFfZyZVR16LA4ajjWtTT6VjXIAIZpVZrqbSsDescTtZjLescjgLtODWNkmC90tpAkhuUxnpJ0KhKjsQkgYvupqaNdMmtGAJDw6Zmp7NEEdg2u7cAW7kN2MatwBb3BzZF0OJ0Oj/cviBs/HKayjytO4Rg50euelqY52BrEdDmoSOPFta73DuFYEerx2Pnx1pDA9M/EaUQALu4e097cUfqXhH6NLWjuGDPbu4Cgo9Qy+0awSaTNF4WeNnsA1SLZQB8zfSGBJjnCPVKNC+WS0mQ4PHvEw3D/s7Cws79kumAvzVBJfAcVA0WHPTI5aH0LgCHeQTAUbdYRdJ9FMAxHgfQlX5IzosqkFkvHvGE2XKy2+XqPmkxnwC285Q6I4aghy3w9RpPy63TxjNJaGGPOkNP0HX2HM9noIUXJiIX2IKM8zx3VjyejJ4gkcaLnwEVHb6JiK+jAvj8opGJwSQ9wZJLl8WrzdQX6u0zidDlS0uCEV1Bv/hM5pVQ7xUGRNEfnyBloLYNyO+4Guq92pEPtNUOpAQjeoJKsvgasMki3kASyywXgWvFVN5TAj2BYdBqN+7Ddd6wyQHbDV7HPqPdOhja3XoCaSd+Adzk0C3RuDXEm0CntBODxBCcEjvR10d75+3bnXb2+YChKe3ESn4JYLikTvwU6kqGAXzFr9UZ+oIi/x35gMztvnu3WwwHMu741a9zfUGg33wPgW+alCPk1rdNAdwz90t7QUFfgPt+c+MIOfJANB6IWqPZf1+dEUOA+36O9vSMmR4CD01jjT2jnBh/4jupiCXAo8d7gUE+AZ5wENj7+JHSkeL/XhSRBT8sz1ExPmwb8OTkeAZsw+Oh6Eb6f4wq+El+hSn0t2GzKDejq39Sx89RBdnVXhVi0jO9XnG/CYSiBXwqbgiRBfFwZI50wwgXjB6fEqNhgklPGQdhgpFfpsRImCDeOVAIn4OIgp6qqqqqSefBBGGCrBpxu9Jyobe3tzd4PKjIrpGvXiHG+UwT0eUZxzWRmXWWROuaOLEmWuqU22+I5yu0C6XHiufa8YDhRdOvKq6xL9So4HV1X9OLqDfFEL9xVqihnExT4nfVKYJjPKDui4tnVG4Hgj8o/QOYEvUMnmzAn+rniY/8sjLVRGWPnolj2kK8DAQOsz6gYoh/BQIvtXlR8P5t0S67jGWaV5sbkY182h6Rp3RrcyPxSn01mcwVvtKGIvCau+XTMIzhFL7WxiLRzrF/IjLGdm1uRFzjzdqhMs3jyl+P/5R/AX5QtzzEtq1oAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKjUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4d6flYAAADhdFJOUwABMHCjyeLv8ebQrX1ABh6F4P/u3ur98Jw0G/v4tG01DCpeoe26M2zycRIHWMuTChCz9HZU1SccIwMUDqQ7Gtxb2v7kb3KXjNS+vM2pYaYCXZA8K3mGBdIEmIINX+jDkuf6L9u50xN+jo3PFaXs80rhF8zf6SmbN7D59cJZqOXdGaI/UoFQS3t8XMRDPi2xrGDjljoyVvzO1tG9iMpJbr8RTvcJREW7qwjZyJk9YyFqLjF0tSTG1+tRmnUsZUwPxVO4H2vYC6qAshgWVa859khNIpGfWotnJji2JUFzHXpPQgcBuV0AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAVVSURBVFhH1Zb7X1N1GMefKXcK5DM5M88UTMgQARmgDFBkSpaiw8BERWKShigCAqFo3tC8C6JO00KbmTq7oJikVtjFzHupXUy7/Cm9nrOz7exsY/ij7x/2/T6X73N2vt/nPN+H6BlAM2hwUHBIaFh4RORzz0eprQGJHhIDANqYobECAN2wF9Qe/TJ8mAj9iJFx8SxEjXpxdAKQ+JLayy+aMS8jJGmsUpU8LgVCappS5Z/x6TBkJKu1mswQZE1Qa30xMQvB2U7BODbHtX+5edBOcrn5ZXI+ghyPj58SVCACpqnp04Y7bIWCIWCE+Ai8ouFJzvQwQP/qazNm6gCxaJRknSVoA73FbBSZeSxOgHbO69Lf15SU5kOc+wbPC5HV/06Owzx2KJsP/YKFbrWxfBEqcniWhzcV7l4srLQsZv8iVPGoIOctLFnKOxki9JcPb6Oah2WoWa42la1ABb9FJhLVJjdptSv5KXWm+ga1iagsEUN4R1bB/18oRipnXaPg87CWN1mapW16x6lpWV2p82ANWnU63UoICl3t2nVO/1l4l+NrtXJurRNR2+ibUDQ5p+vh2nfjBnEjEW3CZkncaGhtk1LGB1uw1TVfnI/35Ok2jCSicmyXpMHY5nJSIwXYEaHduYuIdiNSVu/BXiIqQbskpWK3xyIlHKAD4gaTOInIbIqQ1eawfVwfhBpJ6sR+Ik2UF3zYHKDKcoAOSo+0LnEGPiSwNTbcHWAG1y0VGY4AwmEio/V9jwBHwHkyVOcOcPQDL4LbHAHmCR9qujDbI8AxHCeimFB3AD9wgI8E2IAjJ5QBsiz8qYaGSMIcfKxc44F0Cic/KTi1E3vptGmVrI7Sn+GSAbskdeCsxyIlrjyIn1FBOzBMVn+KICKKwyZJSqs3LWue6JtqfOacfv6FwdItB5iDKUQ0EoMd4rlw9f77Rr9DXr9QG8YXxQgMkhXHz7f3eFCFJT09PcdgUej2Hr0gu9MCTCeisfoYf18AnZSSVPMlytUWplufwFUtSSoLvtFctHLRLbEZfNyEy6tQzF9ziCVabXJTjNU8lKPXK0JDDebzmOE6E1+YV+ErHs/D0OFp2V+PojIiyjaslG8Z33ShV/qD5TYkxrnV0ZcEVBv5BYIxRuHuRZ3ehJpcnu2xA/bLLblEp698PUJE/Tes1QQh3e8RUEt0nd6SWYSKb1nSZPZxEtha+bdq2gnWmTuRNV69zMVloUlvuUrJ36Hme4cm+4fRfT8WpJwqjXM89dpPyJ/ouciNsROtQCG/ZhFqr6rNzIEs1ExWK51cS0f+hOuo5MJ/0AT87LiNFTSkisiTWh5f3EiB/SaRFOGWaBuTAuF2nXQdO9DcuXQX628pl3jQ3Ijb0q19HZXnRds9Mk85DGgjM345l/1r972uoPVAU+k19TIXm7W4z4csRYDtHk80ux7Euj9Iw+pxXk2Tm4d6IcklXEeTM9XN3R1zH7RHbvrt95Z++8xS013Fpv/RKvyptAak7Cx677jFm/lc1Z+C+Eco+MstptnRqTQHZONM9EmtjwPjbaTLuzkwSmLQLiW5zH2k+D8rHzwORbXU08kkofGGQgzIY5uVr3sXbYLWK4H7Izfc6pGbd+7qHZ3HQHnCLV3bmbAV0udPF2JND9Uu/VOBv6lEtCxCHks5BfhH7RGA3nBufbuSm/i2P9GHS2qHQCRMJXqII4XiRSJzOx5xzX0q7KYGiuoDLP9yb3tI0VoPkO3YQhS1LqmZ79t6v7XKPznaNXKHccsaekVtHQhbrWu23CSKrrba/lPbBsZWLUz7KoHwx2rLQFm63V4bu/aJdBU9c/wPtNpr3UyKbikAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK7UExURQAAAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////kYbJwAAADpdFJOUwAfTmx4c1stAhW7uSk3k+D/5YQQ0vh7BQFRzP3PMiLA+bBmEQQkxqWSyvuHCD/u6hZh7+xqA3X22Dzz/pANrZ8UJsIMVQ5EQbpHGIOcDyCgEkCqL/pi5i4cSDWCaxqx3AqF9UkxBtRvqRt/E478uM2uv/BnjGCR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" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ8UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6OvzY8AAADUdFJOUwAOVZK70dTFo28mIpv1/04BXNzf+fbKrqu95uW5WQOo/rVMBymF7qICpJ+s2j0RoM6l52fY2Q+vuG397B8S3gSBZL4vQzwciPt46hSZ4YsdgHIhKyf3e9Nd5Jg2glY+RsK0CSB6YbMFT5XJNWxRwHZN/Aqn2/QYfcQlSVRrnEVl6wjM7c8ozdUa8+OXfz/GLZoQczELSmiqW6HSS9bdOTp88YOKFvjQML/icAZjd8eNtxsXKqkZyEGmQmYkkISe7zNgupb6ielHDegykUCG8PJIstcudPAhTQAAAAlwSFlzAAAOwwAADsMBx2+oZAAABBhJREFUWEftlvtfFFUYh98lFEX4tgmCou5MSrItIJuskMtFSQNcCFiJgiTzGlSEqImRGJBFEGUUuibRRbunFXnpYnfT7vf+oT5n5szMOTPjfjDqN59f5j3v+55nbmcuRFf5n/EkXJM4Y2bSrNnJ9sqUmJOSCoOka+1VO97rEuemyaQDmJeROX9BFlMstFXT0uYuWuw15/sUc2cW6vVLlmrV7BuW2Ws6OX5DMBtYeGPAIhdAXr7pp+UFAIJCQyAQuGkFUGg0hLCyyGonbzFws0dIEK0Ko6RUylBZOWbwcLWKNWKpAligH71FIXDL2nW3VgqpKlTzaCmwXih4IsiqEcY6tfp531ZXb2QaAB7ZBFFgMQ/9Gxpv51fKE+GXrukOn565rOBOhPik5hYAd/H0xta7N90T3Qxgy1YtcTnBNmC7Hu3Q9phplRj5IeBebQeugrb2++4HHtDjCCIdCQ/Kt4PI0wnsZIGboCuN7XPXbm2wFtihBd71e8SrX/QQ9na7C/apwN6Mh7VBT8cjwP7eZCLfAaB8jmB4FGhwFfQB/RUDPPkYIsBBPE4DmeyoWp6wBDSIJ90EQ8N4aoPZNKLftBSq04M8s0L0NNQiF0EV8IzV5Mth05TVtBOHgJlqklWiBOBZF0EeNgtN5B8FZrE1U/oc8Hy9uLbbgTGn4LCKfUITkXdVVF9QR4BmqdILVDoF3UBMatPIPpCTOw/D8rNxFP1ep2AgjFapTWOPtjBekHLdTTjmdhfGMSj1abw48VJo/styLgd4xU3wKrBf7nSnFyhmW4dgeT+OM3N82k6oyGIr2SmgrjDSXxPXrJPXKyaAkjEtdgqo+Q0AJfYXuID2UnmTf2hcBPTW2/q6jcM7757k0zSBf11hLNYBFMdisVONRNQYHZFf3xIj7+Xz9xkXlL0vytUPzOJUYAL2wRBJsDfFgwmOY/LD0wZnIjhrb4oHE+ivlq1DQ+fYY/MRJu1N8TAFlQcBJE5DMKayu6MJBrtEzhDRyY/ZR6BniVTQ+cQ8hU/Pn+/7TBPIVPcQfQ5Fe/zc4QIDuyC1lOgLfElU85WtYuAQJH0twh4ZbzJbOTVSnlPrIvh3F9HkCgWtCE9L4D+Ecodg/Jsp03cBOOEQXBnBw9MSDH/rIYegc5vAMSzjUQiTYkGjvo1NsQuki3gWK3nUKX/0BOIKgljEowKsEAsC8QS7L6KOh1HA/LmT4YJL333PNrLgCNDOw43AKaEiwAUTqGIbWVCAph946PvRPBsbXPDT9jK2kQQ1qThqDn5GuMcqCezCJWE0ji3WYA3wiznIVpFilQSCSM1VDC4Av+rpc6OK8hsumhVF+R3pihJwHsUf1dLiajmtpxukrEWtfT5R/p8TfxmMjxq/k39nmEmR4Cbb7Kv8F/wDSLh0D8k9ZTYAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img4"></image>`,
      };
    },
  });
