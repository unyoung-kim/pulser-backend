import { tool } from "ai";
import { z } from "zod";

export const fiveStepAscendingProgressionVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Five-Step Ascending Progression Visualization' designed to depict a sequential or step-by-step process with an ascending layout. The layout includes:
      1. A main header at the top for the overall title, with a sub-header below for additional context.
      2. Five circular elements arranged in an ascending diagonal path, each representing a specific step in the progression.
      3. Each circular element includes:
         - A step number for sequential representation.
         - An icon symbolizing the concept of the step.
         - An associated text section that provides upto two descriptive lines offering additional detail.
      4. Directional arrows connecting each step, emphasizing the flow and order of progression.

      This template is ideal for illustrating linear workflows, step-by-step instructions, or sequential processes in a visually intuitive format.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title of the five-step ascending progression visualization."
        ),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Step 1
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first step."),
      title_1_desc_line_1: z
        .string()
        .describe("The first description line for the first step."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the first step (optional)."),

      // Step 2
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second step."),
      title_2_desc_line_1: z
        .string()
        .describe("The first description line for the second step."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the second step (optional)."
        ),

      // Step 3
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third step."),
      title_3_desc_line_1: z
        .string()
        .describe("The first description line for the third step."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the third step (optional)."),

      // Step 4
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth step."),
      title_4_desc_line_1: z
        .string()
        .describe("The first description line for the fourth step."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the fourth step (optional)."
        ),

      // Step 5
      icon_5: z
        .string()
        .describe("The name of the Lucide icon for the fifth step."),
      title_5_desc_line_1: z
        .string()
        .describe("The first description line for the fifth step."),
      title_5_desc_line_2: z
        .string()
        .optional()
        .describe("The second description line for the fifth step (optional)."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_2_desc_line_2: "",
        title_3_desc_line_2: "",
        title_4_desc_line_2: "",
        title_5_desc_line_2: "",
        ...input,
        template_name: "five-step-ascending-progression-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALHUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4augDUAAADtdFJOUwAMPmaBjY6GcU4ZE27C+//6NAo3NZb2/fLx+UMSLj3s3U8hBDvcVAJeuM+pQNPOQQHbVar+cw8VKqhK7bQQAx0RL2XltfOtV8mC5Pee4jxF0WvG7uCJkdd38J9Wpd6k2rvrgCNEq5z87yaw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" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKpUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////z0UFbkAAADjdFJOUwAIeCsEsP/pJwcCpPLiH2H7fpbgHqDaGFP8cYfnJa3REUf5hPX+Y+0tuccMPGJWaYM58LwyVEkN/WQp6n8+aIrL+PQVM00S48m7+vGN82vuNhb2L12rF8om6IVMUKoDlB3hWUQBnZ/ZomeO5JEQz9cUBanvs3Yxcz06oazFwmA7ZSAczTU0zFWypaO0Ib59JEinmOao3sichpvG5dwPZvd7BnVuP+zQXJdXww43OCqBkt3f0wuJS1KCwdJ5QihbSkO4CRrEQUZ0CpqetrF8vy5Yr4BtLKaM69uZb9ZOGbdAenATk8HpAgAAAAlwSFlzAAAOwwAADsMBx2+oZAAABTpJREFUWEfNl/lflEUcx7/K9lFX0Q1SWQVdl30ib9lQNiQVJNF18QDzyALFlcOjFQGhFM88U5JABO8jSYS8UlPbQFHRMssss0O7/pJe8zz77M4Mh/BTvX+Z+R7zeeaZeeZ4iP5HdOkaJLs6heEFdOsuO3V6yI6WGHuiF4J7y26NPqYXZVcLQhD6Ul/06y/7GWFmYIDslBiI8AgyDMJgixwhGmI1R9qUl2W3QFdEvcJedSiGDZdjI2zKSCYySg5wjAbGGFkl2o5Xu4ixGLva/bFm6zgxwBHrAKCGowC8JsTixiNerfRRbK8LEZ4JEydhLKskJE6MnKy6kt5QiynJUKZOYbM8zYnpEWIzHpdPINxnR6dgBiv7zwQwi4hmA0hNE9oISAJpM2FyzGE1o+FNVWAu5hnUYWoDUWD+Ary10Gl6WzXe0QV8qekZIYZAQx1BYNFiZBBlOhKWMEsScC8FstxCYwYvMDcbOay3uUpidEuBZVgejBVSc0Fg5bvwrGJG3mrkp8kC8Rgf170bxkjteYEMAAXMKAQwWBIYAHsM0Zp8FEkChSjWBd57fy3WMWMgSnLWiwIjFdsIFtqQqGwUBYyb1EIbxM26QCYrOIEwM7Z8wHxbt8G8XRDw8RyBHQB2Mt8uAB8KLUctjmtdwL17D0rHfeRWBWbvHYAyFtqJor2zBQHhOwgIJH1cDpVuFdogRusCG4TmbQnsA5yV+6uqqg9YgYOsj50S2A8cGu3boQ4fycbR3M4JxMN57Hggw3AiAVWdETiJ/E/EnOhTKOy4wCxnKlsIAkkp5sKOCqTX4IiUQkSfIlUTOA22B/PIArU403LJEg2FJlBXL0dkgRKoe4HMZz6BlvgFzvY55zqPC46LrXWA6HNNYIJHPsI0gUtO7bsDcFpK8HG53UG8kgylsmr9F3OuXnNekRJ81OL6l7neutYFShWUfeWz06W4Tr3aPdP01gRKYdcOk/YwNozOLa0IB/o1igEX+ir2JNHXNsYbN4GQPN7lApSFvON5LAzHzSbOdgE9ObMD3BqMQdxUu6DM58MdYFU2TgQsF27zwbo7zbdYudnr9XrZlkjUo75xq/DWFJR6dLffcOEqF7prA5SbQUSh6qzdILo30A4gKl64rpWir141fo2GQGA7bGXfhCLfTXZrVlZWhoWmbEHqjpD7Vpzhb0DDo6zaZcISWQ5w8/otu64YTj4gsudrngLsYa/UuxK7AmlE57U137wApu8iuTkp0O475BcoRvYltbIyWfk+kEdLsJodCSYs3cx5iR7C/MNe9TZhtzc1NRlpBfRLXhEecYl18BDFJJi419f4MRwIzXUTsZGDh+7jJ19kBB7ziVEp5N6Gk7xL43jtNAe7ZNjNHo+ngnYgxhfwIofPC3ZQIypb3zpiypGmj0Gk/5Opwl0+6ZSNclDLexjG5nus+BkNusBZxxNtlCJ6WRdxmbFKP/pFOcx5VBpRGUTU+yLW+KdxBfZ5idxXluMcn3kHaylhAe9RiT0DJXuSlR3kdnNNTc26TZT3GEgeVg78Klz1lmEGmQ7yHo28334HnjzKI5rHZsHJ7hSjDphhuvZUyGsab3pGwSZ+VfuJ7a8+Kt1isVjUESFqeib/t6jH1CD+G+4cEYnW7kSZuC8HOsjK62A/QscvIEwOdYjJU/GHuncPUVLa/g9omz8Xo8S3tAth/avVgWyH+rUKdvkb5R7Fk+oJD2vbYZybduv1hr+rDwHJ/Ac8vyJwJrZBMd3mLKXyiPRn9U/YscsT2+FBF1qi16uKns4VW/+3/Av6QHYJ5INqJQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG8UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6rY6ZQAAACUdFJOUwAb3tgVgf913QHUWU4/MxlUkYpTFp2S39UK8dvj6wZbfYdQNFVJELn9ICmuN/70afy/yvkUUhhgbJV8CFe1+w36sQe69juZ73F79+2Wrxraw2UPZ8Z64IAjJoTW4aTyT8IEo3IFpYZcnLscSHgCQkOioeKFJ58o8yy+0NEvjujBMLxWIZoJ8JsxLloDdO60qs6rcyWRIz9WAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAC8klEQVRYR+2W518TQRCGl6CvBBDQGLGLohgkiaGIXaNiA3tDVEA0gjQ7RRAQFFCw+w/723J3c7d3l0v44gffD8vszszD1rkwpqkgVLjKOZaTVgNrnGNZVVBk/tdwCCh2uLOrBChV5loAKHP4s6i8Yh2wPrJBdKIcsNEZ4qtwJc8BNvHO5i3Yug3bdziD/GQD7ASqdgG7had6j6/21igCXcI+xGr3A3Xcjick2VPJA8YkzE0sSKGesQY0NgUBAAcVwDjG5ihwiLHDwBE+nyxLOJpCgzEFrmPHT5wEkqcYa2oE0qcrzlCvm86ixbTD585f4HNquch7l1q53XY5TsN1XUFaWVerrvGMxPUbN+VAza3bYo2Fd+TtcJcJCN/lwaH2e9TbcV+MPqBjDjkARU7AQwXo7OqmDkv6Eh65LaEHeEzTLFkAsolPeM+2iRngKckisgCZ3t6MdowRdYxBAH1AH//b/Mx2kaSCAPqBfmHYrrJSAMBADIgNCJM+JiUboHywx/KYgCG+ZUPCtD1nKQoIV6Ld8ijA8PMQkkmEXgy7FxQKsC9HAOSFe/kKwOs3b91Kmj9gRNyX4tHRYmGMGEWVrFUldXaVugHGeHz9OGPj77g1pso6XatMkvdRB0QmxB2uiIjqMxlRHxZ92rSlAMbeT00DMzPA9NQHPiqqUy4AxnpmkUhgNmN5jMC56McgAF5TgRLLYQQOt+JTIMD8ArAwbznckmwAVSGst7AILNJ8lyTaGhXCAsRjMbN+CrqepLcUwMrM7zE9b//WBuCq/sxbPdCrdQLiidSXFQGW5CPWA71aD4DX2eutB4DNRWvdwvXWCyCkh9NWznIFADnLAABZFVwASlkBrHxweWUAYucIoB/UvACyhErJJHo/DPkBiFQSuR+GcgNodl4A+4+NPAB0b/ID2PQfEBhgvH5dAQHG69cVFOCpfw3QDXwl3QBansQ30m1qRfr7j1z0E/hFAOy3+J2Wk9r+UABbmkg5I3w1VtfB/gJkpx9ccovEbAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJGUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9lc8+YAAADCdFJOUwAMOmeNstDp+6kWWJjS/P/6KX3L/ffTs9sVc/W/hlMkAjOk+d+FPgbUsbnqLI4npz1yCfaRHTfYnBwBdsotCqz4dQMxGdYRSUwloAQ0wf7R3j/o44AmDc2XVcC6niuKPHnvKkvzn89CSpAUxQsIeijy6x9czMhII2Eeo22DrzLXa1K3Oe1iXdkTIBub8clxWVRbB6t85jbuV92W5H87ZhBgEomlxtUPlSJBTngajOL0TbuEQ6Kmts57d2y4asSo3Odf0SfhEAAAAAlwSFlzAAAOwwAADsMBx2+oZAAABRNJREFUWEfVlvtfFFUYxo/ILVj34bKLoFxbFcECEWVhJRhWQHFxSQFBrhK4CkEsppCmkmARiKShKaEWSt6CpMzulv1nfc6cM3PODLsk/db3l3nP877Pu/M5O+dCyH9jTcja0LDwiMjXzIlXISrass4KRow5+a/ExsXbmNeesD4REeb8yiRtCFe9G5NTUtPSCVmPcHPJSmS87qDuTZu3ZHJlK7JMNSsQkq26gW1vaFK6HW8ai4KTk0VnLHc7yZM6pAFrTXVB2JHiAPJ37qKx1CEVCDFVBqbACVgLi/hIdEiBdY2hMDCu3TFAcYYQaIe3aJCMdVJdMEpKAaXMLUu8Q+ZGWGQ5MEnFQOIek8g6bAGiTYnllFcA2ZUs3rV3XxWX1Q6bYYuSawORVAHs96hh9QEvgJq9LEE7vI14Y7XOQUv4odrkunpyuAFodKnaEfUrBLy7WU0eHcQZfZycJr7SbKXNQAvzt9qhtLUXHO2AV7wD3jE6GZ1dgL3ZcsxH3xhh7P1JKSKP02dsB2qY4tqkRUZOxMDW3UOjnHcBXy9T+xS0sOg9gM3kdmCDsOn0+5G/j4Vpfgyc5HI98D6LCgCWz4WSxLMSnlOwcr/nNLyDmj4EfMCidkBVz8TgrJaV+BA4x8OjQKiue/w4z6I2eNVFsRO4oKd1erdhmG8WVXZs7ROZQv4KxxUcoM8iO7JFVucj4CIPR2AblTJFl4DzH39yLBKOajouDLySazCWzqJOmBZKyCW+lR6howvWgJtZLMC/M3cCOj4VifFxQiYuTwL20lY1fQWOepHWmQKGyMnBz65mXAPKhN6pKON0JofqP2dCGZAi0oJpDFxPZC+KGyW63KlAbaCzR4FzhyxoDPNFQMnTVdckFP5tMCoTEfOFLOj4ATTktVdVd+iLkJI12SlXeZr1qTLjwM1b9NlP15HUQUR0sB+YNiiCspFY9dkG7wzwJa1qn+021rgagStifgKSPoum8mHW4TZmDTlPC1ARYBEZuAPcJbRDo4t8dbtdTvWGARXlsiLR8/UcC+7BGkW0DgZO+oBTwX6/3In7LPJhXhWWdRgcAJoPy4pEuVPfI/PBJk6bB05fKP1zSvWxEerXisdQe4aJcofRbwD/PGyB1gAhD5zAQ1b6aATAjLlDj8UGnE7L8aLO6OQ81v1PJgGruUNJWQdg/9ZDSDiSTVaGO26K+VMj4bUsLBo6NObdADCSRsf78Z3RaWK8C0+XCCFShxl1bSXw5WDBIaPDRK62E/MOUXeb6NTbr2nH+/fwGQyCyh+eETJuxY98vAjUds/T+6S3A1D3QTqXSrArwVwDvTPWAeqWRQhZ4HfR2rb+anEP6AYOSi7BXANQSEgCijXFAozl++7dSSekSj+WlmxoklwC6n/uJhPAda4sefGTltUOI7KUD3/A74j7STTAz4LBp5h8pKU3APSCl3nOBscJyaaj+ckiFPVcaj3rReQTPf8zxghJvzgM+Ff2kxH4SObo9WIAXdoJRcgt4Je0X8cAxOfIPg3hJzOI8Kk3GetzsY3H3gQGqBjxm+GupyH5icL+uYQ6+RT4nYnhfwTZCF8IP/lT+WtkMXpCS7ni7s8RUubwV0xP9QuHiZfCb8L1EPjbLC6nPpX53ZcjnjGFR9TvVC9Lr4T7vnY34ZHqXzCXBYW6GtQbrRZNAc5g+/dyVJe6qetR3Kp/3+gn7scPzGVBCeRfDf93P7mqu0S0KupfvuAuEa2GfwBAmDhOFonFEQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img4"></image>`,
        fallback_icon_5: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALHUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4augDUAAADtdFJOUwAMPmaBjY6GcU4ZE27C+//6NAo3NZb2/fLx+UMSLj3s3U8hBDvcVAJeuM+pQNPOQQHbVar+cw8VKqhK7bQQAx0RL2XltfOtV8mC5Pee4jxF0WvG7uCJkdd38J9Wpd6k2rvrgCNEq5z87yaw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" preserveAspectRatio="none" id="img1"></image>`,
      };
    },
  });
