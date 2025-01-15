import { tool } from "ai";
import { z } from "zod";

export const fourDirectionalArrowVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Four-Directional Arrow Visualization' designed to illustrate four distinct elements or concepts branching out symmetrically to the left and right. The layout includes:
      1. A main header at the top for the overall title, with a sub-header below for additional context.
      2. Four bold arrows diverging from the center: 
         - Two arrows extend toward the left, representing the left-side elements.
         - Two arrows extend toward the right, representing the right-side elements.
      3. Each arrow connects to a circular element on its end, emphasizing the associated content or concept.
      4. Each circular element is paired with a text section, which includes:
         - A title summarizing the element.
         - Up to three descriptive lines providing further details.

      This template is ideal for illustrating distinct pathways, branching processes, or directional systems where each arrow represents a unique aspect or focus.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title of the four-directional arrow visualization."
        ),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Left side elements
      icon_1: z
        .string()
        .describe(
          "The name of the Lucide icon for the first circular element (left side, top)."
        ),
      title_1: z
        .string()
        .describe("The title for the first circular element (left side, top)."),
      title_1_desc_line_1: z
        .string()
        .describe("The first description line for the first circular element."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the first circular element (optional)."
        ),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe(
          "The third description line for the first circular element (optional)."
        ),

      icon_2: z
        .string()
        .describe(
          "The name of the Lucide icon for the second circular element (left side, bottom)."
        ),
      title_2: z
        .string()
        .describe(
          "The title for the second circular element (left side, bottom)."
        ),
      title_2_desc_line_1: z
        .string()
        .describe(
          "The first description line for the second circular element."
        ),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the second circular element (optional)."
        ),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe(
          "The third description line for the second circular element (optional)."
        ),

      // Right side elements
      icon_3: z
        .string()
        .describe(
          "The name of the Lucide icon for the third circular element (right side, top)."
        ),
      title_3: z
        .string()
        .describe(
          "The title for the third circular element (right side, top)."
        ),
      title_3_desc_line_1: z
        .string()
        .describe("The first description line for the third circular element."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the third circular element (optional)."
        ),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe(
          "The third description line for the third circular element (optional)."
        ),

      icon_4: z
        .string()
        .describe(
          "The name of the Lucide icon for the fourth circular element (right side, bottom)."
        ),
      title_4: z
        .string()
        .describe(
          "The title for the fourth circular element (right side, bottom)."
        ),
      title_4_desc_line_1: z
        .string()
        .describe(
          "The first description line for the fourth circular element."
        ),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the fourth circular element (optional)."
        ),
      title_4_desc_line_3: z
        .string()
        .optional()
        .describe(
          "The third description line for the fourth circular element (optional)."
        ),
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
        template_name: "four-directional-arrow-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKyUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xDJ/bcAAADmdFJOUwAsWGAuPtD/0T/756qfWST2hwaGmaHhLTX8A+7v/WlqMvLNWgkzUmFjVjkPLx96x/qFHBol6Kut07Cenaz3vXf54LkOl6NMDAdDkU1VtbMV1sULMdyNFstlzBFI9CkhXUojAQjA2hhoRvjk5ZMq5js84wUgK46impy3Iut9eOkC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" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALQUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wPARyEAAADwdFJOUwAkqdTWqCMK4f/gCUi1DrhFVYuOUhRbTAQFWjvtyBIBLJiKjZYryTrynsfNhV9i34TOxaDxeL0tq/z9gTw9gv4Tu3uX5x996PshbAht8H6RjBUYDI8CPsDpRyJ1d/fa2PQg82XsvmvuKGd23CdT49EzYOWvZBA2yjWwcZ/ew/jiY5N0ruQcSgdB9Q3Bm6EXfF0413PLBgO/etkpTzkqGWadifo/9vl/FgtUmpxGpyXCtHDbMdNy3bxZD+smNM+ZpBqUSS6Q76ZNG1e2bjDGTswe6pK6QpWzWGiHXtJqUNCI5lFLMmGtN7GyqrcvotURxElFmvoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAb1SURBVFhHxVf5X1RVFD/owPDFBZdkSQQK0REsBUdwntpDXEDHQSEmAQUJNVKJXFATEgwRBSkSWVxyGwQTEU1ICrXQXDKtrKwsK9MW07Z/oc+9b+ZtoB9+6/vLu+d+7/m+uefed84ZoofCrVdvg8Fg6O3uoWd6BqMnnPDqo+d6hL7o199oNBr7e2OAnusRBmKQNBiMx/Rcj/B/CAzx8fVTrO4F/H0fH6JYWgwNAIYFOo2g4CfwpDQMwfDQIOd04AggYKTLQ4uhJowKQzhXcBvtBeApiXgawJix/DIERiByHMzdKgw1YTwZo5hC9AQLhMiJk1zU5GciRVh6BVNMBKb0odhuFSYxf+IKUy2YFjtdS0+fEYf44dyfulWYaeb+XAEBs6x6nsg6OwCSP1Ow6V5ACQhxjoxz5iphtiYmPSsbQ0KSXXc6GbHytIQEV8hl2J8bOy+FfQm2sORUfx05t4tAmgnz1Xb/BewY0jMs8QszAaSMTlSzC2B+Xm0zPJelUrAvWgxhyQvBdrJlk/3Fpd4WmJYpd2wBTPIJKVApJE0BluewUR+TzcieaRlAmCtu3ftzhZf4IDgXL6cIK/qvnJArAli1Om/NWiFuHVJe4fRAZHXrT7Qe+ewRHYAC6yK8agYsGWEbDIVAZhE2+r8GM1coxia9p4RJYgk7ss2r8GQQlYooLEjlR7hl66gyiAPZ6aewXZSvErtcI45teJyI/DagIoiKBby+WaHemCOIlezwRrDzfBNL1H4ubEeVnYh2oLqGlqFMCoeMviY8Q7V12ElEtbuwVstyFGAje1cWtu3eI2a+padX2LBy7zxk7iOi/Tigp4mMprJyIjqITDiyRF89TVTvSHfAjGR2yw6Zu+bpUrizu5/dMH1HGYbrWYZGpOcfzjK/TUQTkKoi7G6hoaGhB/gOjsCdkgrNrrSkgTFFcKMmHulFaGI+HjxP5VRJ1UNkt/sojtB8zNX7SqjEaGrGMSLycFacqhYiOo51JxjeYWtOioG0Aa16VwkeaKM+jhI2fJe7VGMeEcXHsdOTYLWcopr0AFcGJfJpn/KebNAY4X2KgJIt7B2FRIQxyorTiCI31Mn2UvY7WWwkrMYZ2oQzsk1zWODVAmdgO7sLvWS7SkwtRZtsfoDlZwPQLNsS1AIjeWg+lO2i+KROyyp5i+c4fV6mJagFPsKSpHr0k+0LuJgNRH7kNC/hctJ61Ms0+cwiItFTmUhEG5WLp2TbeqCwcFw14gdJmTUcnbQBp5X1ng08tLF5eXl5G0PZzGKHlQzix8oSPz+qnWWD5x4iWuMoIbu5gX2QwRuZzwxhORFdsUiXIut9IvoE9TQYVxUBjn3uYFn/KVTQNXzKpFiiBRB/hNHRxZWVlZXD8BkR5SOZWpGhXAQnUntfIPoc9TQRjUT0GcKYT3GwaslKXCCi68IX1uiLmKkiZMSgLNrPC7uJ6Eus1LPUKeSy4zqB4xYcr9WzDEFRiP8KdbU5N0pzhTf0LFE7brAazSqjqstQw292NnAqi+++6OtretoH37DHBFToGQWDWLDrCqZeirAAm65rSX9PkYnu68C3WkJGbYiIKF+pTMbM9oKNhV2Fm5jHon/eUsj20hW17lisapas3wmW79U8+d2SKtMPOPSjhnBiMJanaSaONMRrXhX4E4r54AVBuF2jZhj8G8UOrT8rED+vUaxAZ/9CRJezsfCy9jI1nwXuaGYYxrk6QRYVxZ/oej+g7ar8SSTtrwbQLq8lot0r2AsOl2W6foIxXOXPKlEkgIxeB3cuuH2ptwi8XIK7Clt7FJjCjqNJzlc/oE5XK34JWSh9MYDX1Mn+mWblevkdQ66Bt6/Ncvq6jaUueutk1yhx6/ezr/7azLayV9rBli9P/rav5jecavHmBaJczHCuvQHb79JoPHBPH26iATjKHo0ATn6CXR5/oIonmY4y14oZToXxMI2Bo4CnFxV8cY49TuD8fcCQ9gAGVmWJiizykkauMB6mSdad2cDn81vlZGr/c9lP+IuN8lH0YlPdzHbcOixRpouyAFPYM1Hqn8rz/wYQ59zUdt4ujuBS41ByunwbIpzVpRPhigAlAEr/1RobgdvScBDCE1qnOfiJ2ysQ14Z1/zhX+WCqc8Tx0v2jexVL+4ejAvu5ETRHRB1LnxwPulQJFbQCv+Oks9/1uCbf8jOiV7fJS4LuL88DJOhX1FTjaf2cCjqBlkxLqXZBUBO2KZW9K+64Op0PeManb8V0Tevm34QSVSvYFZsbGtq9vb29oxyFnXzipiAOj5Hp1nX4WRXy7uBjlr4lG7v1DHc7YD63lXXfMVdOCPj3ke9nsLbk5OTktCj/fxLPpQOmmZSWDhQtfcQBPBxDbm46nkhr7jVddv2J+Q/6yL6LMhwJVQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACWUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AlxagAAAAydFJOUwBPav5raf/UgE70+fNNGlp6JK/8/SX3s4iyP6UXCeCNzgNovVvuGO0ZvGeO9q6peVmqA0zC8QAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAeZJREFUWEftl1lXwjAQhUMrQ2rLKpvsCCIuoP7/P+dJwzTNLbRpe44PHr+n3KRzO00mMgrxjzONBs6Uw/P9O5wrg+f7tRzU++vkoGOrO3BkVQcTV80hHVXFwY4p74ARqIvIPp+dyaPpU0tKGbAOpJQt8j37qRzuKSZkHWod2U/loN4oJRFrongiyciRtIG94ohtELTtVQdsgzDZEWdsgwqf8fsG7fisYuINK70Hl3JJSsg2aBefwqVckhKyDRzAAFsHxXWYbxAV34R8A6c9sEeoC8EAox2OUHHbwCF9xW2DG+RXHife6fZ63U4qzJBfeTrx/uBBrQ8Ho3TkBYfKa0Q0nkynj2OKrtQRBqAWYhbSfKEGizmFM15NwADUYrmiNU+tabXkMYMBqEWTNlue2m7oiccMBqAWO9rzjBB72hmhwQDU4pkOPCPEgV6M0GAAajGk5AuE2NLQCA0GoLYzOFbIAPbg1QgNBqDGU3jjMYMBqOvXgVWJ9M6rCdm7YGv1O6/vwmRMH6pDgcYZbyNqRf+kb+Np5Pn+Gdoc/Hug24qY1NXrdHufX8e4S6J6jXMz0zin3liEyjCib2jWIvPNRagfFZWB7VAyA9O8u7d7gHY4l2j3EOVQJ4PYodZJlm2Zr1H338C/xA8bvhzIZHXZ0wAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJJUExURf///wAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2hR5AgAAADDdFJOU/8ADvZfumQakyoZ/PgQESmSG9n9rjUBRLytRjTf9+j5SkvezhIXiPHhexZ54IkYzdpFA2mgFZz6N+f7r7Ay8sAlvzF6C92mBEOn1g19zweZYECD9S0sgjpBOZ2ytF58hGV2jWqhjgJn17mLu0KGCO+FD/7w1JoFxtXuSdMkqwx4HEi+pNLLICYhsYzYou1yXU0K5ZZsVSil28c4Iy/zbx2UCcnCTvR3BqriyMTcFDDBUFiAJ+RbrLbrcDvKWROR6lSzkOx7/uQAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASOSURBVFhHzZaLX1NlGMd/P8eYsgHGGYNN2ECZA9MJGyjMNHLggHERSUoySC1MSchRKRZeKLrZzazsRkYmdrGLlWml3f6yPu+5bGdnh8+g6FO/z2c7z/O8z/t9z3n2vs8Z8D8Q/4GWCqD/JMML0NIB/r6WBvDfy3hbi9G/DVhmEeOWZcZ4SlkAOcoz5hjjKWUBWJFL5sJqjKc0D8C2fIW45Nkd+WSBw54nvMKVdxjz5gPYiiA5i10lpXAL14lSj2uVU0JRJsEUYCtCWTngBXwVwq/0yY5ltQnBDGArwpoq/9oAqmv8SmTdnesR2BCs2ohaI8EMsBKrq0jm14VSsVBJAcmqMizXZ+r7gSaSKySLurJRwXJJFFefbQagE2u1GeF6q7U+LP8IJDfAKS4mgHQVI5Avrg2bNit5mzc1CL8ggGJjrinA5UUJycYmRLaEPZ7wXRE0NZIsgddlzNXfSBJUh+oQuXUb7m5WAs33YNt2MlSNurSJxhqoY3mliJItrdgRY1t7R0d7G2M70NpCRlGqlcMASCmeY7XD5yc70dUd6lHyekLdXegk/T7YrTvTzmYGwAI4nJVkzIte7kJf9N7d0T70sxdNMbLC7QAs+vwMAJArtgzvQy39DqlX2PdLDj9rsUfY+bnG/AyAcg1jgDl4QHH24kEOIJyeoXnzADrRz0EMKc4QBrlLFEGfoXkZgIfkR9iH/TyAeiX4MMJ8BPuEafoIw6pEQBRxy8EOpfpARyNdUUnzHj1oXkRNIhDPOWTXx+yH3XoX9hHlZ9SFJFXarT1WjciRUcUePRIBxuSuQrL78Qiq2zJWVkfV4hztSaBrqxZjxTieUPez0PY1SDx5NJUtW0lDlaPmKS3kqpHgjmueUCxanrFw0lB0TO7HsuJuSFHj+Ss8Nj8gmaSo+TgmThhiSS0AUDmGp5+RrXW65qgpK8A1KGHypGyWePv1I4qyAeJO2E/Jjx/ql3Ao8xayAE4fx8QZ2cqbAp6V92i6sgBGn8P088Ko9KIPEy+kRjRlAfDFMvheGnp5GhgJunFWPl9pygZgwyvykXj1tWG2bMRITD8mlBVA2l7vPPXGOWGdfhPn08cWBNBpVR/eMoQWB+DbiYgnPbJIADsx9k5awAAIhbIAXBfwrnjnJyWyxSwVIFyltemT9Bp9D1PKMXfJ7U+ZIXz5y24XrpBj6n3DVJInPyD91egRtqcoeZzFrLQaiMaWgENtWikFu1obyA9n8BEvTqo9UFcDrScrofjHGCvUTT7hIWc/waVu8lPJfv4yZuauyNN0Cycl+67PINZTtcc+XkgGP5ffEHMAJi9mTNO6siQpQ7Nf4Eu1Kcu4q1+RX1/GHDkLyfD/ILWuXsH1uCC3goJG8tw0vrlCfitJ17gTV425+iKmtDuA70QnOzvxPWn7AQMuXvcB49Der2kyAfBMJHGddP2I2ipyP3DpRgJ7b+LmT8ZEITMAD8DxM9nixS+36pGYAcrDHL5tvstMAfwVvxXfbpdrVH4r//drQWNCSuaA0B9ibuDa4OSf6YcoU+YAjh729t3Q76h59RekWrVyVfadjAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img4"></image>`,
      };
    },
  });
