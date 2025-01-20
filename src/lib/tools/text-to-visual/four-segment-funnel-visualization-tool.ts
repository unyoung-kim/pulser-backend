import { tool } from "ai";
import { z } from "zod";

export const fourSegmentFunnelVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Four-Segment Funnel Visualization' designed to illustrate a multi-step process or flow that narrows down progressively toward a final outcome. The layout includes:  
      1. A main header at the top for the overall title, with a sub-header below for additional context.  
      2. A funnel diagram in the center, segmented into four levels to represent the steps or stages of the process.  
      3. Each funnel level contains:  
         - An icon symbolizing the specific step.  
      4. Four text sections, each linked to a corresponding funnel level with arrows, providing:  
         - A title summarizing the step.  
         - One or two optional descriptive lines offering additional details.  
      5. Two decorative arrows at the top of the funnel, visually indicating the inflow or starting point of the process.  

      This template is ideal for visualizing processes like sales funnels, marketing pipelines, or any sequential stages leading to a final result.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the four-segment funnel visualization."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Funnel Level 1
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first funnel level."),
      title_1: z.string().describe("The title for the first funnel level."),
      title_1_desc_line_1: z
        .string()
        .describe("The first description line for the first funnel level."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the first funnel level (optional)."
        ),

      // Funnel Level 2
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second funnel level."),
      title_2: z.string().describe("The title for the second funnel level."),
      title_2_desc_line_1: z
        .string()
        .describe("The first description line for the second funnel level."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the second funnel level (optional)."
        ),

      // Funnel Level 3
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third funnel level."),
      title_3: z.string().describe("The title for the third funnel level."),
      title_3_desc_line_1: z
        .string()
        .describe("The first description line for the third funnel level."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the third funnel level (optional)."
        ),

      // Funnel Level 4
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth funnel level."),
      title_4: z.string().describe("The title for the fourth funnel level."),
      title_4_desc_line_1: z
        .string()
        .describe("The first description line for the fourth funnel level."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the fourth funnel level (optional)."
        ),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_2_desc_line_2: "",
        title_3_desc_line_2: "",
        title_4_desc_line_2: "",
        ...input,
        template_name: "four-segment-funnel-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJGUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9lc8+YAAADCdFJOUwAMOmeNstDp+6kWWJjS/P/6KX3L/ffTs9sVc/W/hlMkAjOk+d+FPgbUsbnqLI4npz1yCfaRHTfYnBwBdsotCqz4dQMxGdYRSUwloAQ0wf7R3j/o44AmDc2XVcC6niuKPHnvKkvzn89CSpAUxQsIeijy6x9czMhII2Eeo22DrzLXa1K3Oe1iXdkTIBub8clxWVRbB6t85jbuV92W5H87ZhBgEomlxtUPlSJBTngajOL0TbuEQ6Kmts57d2y4asSo3Odf0SfhEAAAAAlwSFlzAAAOwwAADsMBx2+oZAAABRNJREFUWEfVlvtfFFUYxo/ILVj34bKLoFxbFcECEWVhJRhWQHFxSQFBrhK4CkEsppCmkmARiKShKaEWSt6CpMzulv1nfc6cM3PODLsk/db3l3nP877Pu/M5O+dCyH9jTcja0LDwiMjXzIlXISrass4KRow5+a/ExsXbmNeesD4REeb8yiRtCFe9G5NTUtPSCVmPcHPJSmS87qDuTZu3ZHJlK7JMNSsQkq26gW1vaFK6HW8ai4KTk0VnLHc7yZM6pAFrTXVB2JHiAPJ37qKx1CEVCDFVBqbACVgLi/hIdEiBdY2hMDCu3TFAcYYQaIe3aJCMdVJdMEpKAaXMLUu8Q+ZGWGQ5MEnFQOIek8g6bAGiTYnllFcA2ZUs3rV3XxWX1Q6bYYuSawORVAHs96hh9QEvgJq9LEE7vI14Y7XOQUv4odrkunpyuAFodKnaEfUrBLy7WU0eHcQZfZycJr7SbKXNQAvzt9qhtLUXHO2AV7wD3jE6GZ1dgL3ZcsxH3xhh7P1JKSKP02dsB2qY4tqkRUZOxMDW3UOjnHcBXy9T+xS0sOg9gM3kdmCDsOn0+5G/j4Vpfgyc5HI98D6LCgCWz4WSxLMSnlOwcr/nNLyDmj4EfMCidkBVz8TgrJaV+BA4x8OjQKiue/w4z6I2eNVFsRO4oKd1erdhmG8WVXZs7ROZQv4KxxUcoM8iO7JFVucj4CIPR2AblTJFl4DzH39yLBKOajouDLySazCWzqJOmBZKyCW+lR6howvWgJtZLMC/M3cCOj4VifFxQiYuTwL20lY1fQWOepHWmQKGyMnBz65mXAPKhN6pKON0JofqP2dCGZAi0oJpDFxPZC+KGyW63KlAbaCzR4FzhyxoDPNFQMnTVdckFP5tMCoTEfOFLOj4ATTktVdVd+iLkJI12SlXeZr1qTLjwM1b9NlP15HUQUR0sB+YNiiCspFY9dkG7wzwJa1qn+021rgagStifgKSPoum8mHW4TZmDTlPC1ARYBEZuAPcJbRDo4t8dbtdTvWGARXlsiLR8/UcC+7BGkW0DgZO+oBTwX6/3In7LPJhXhWWdRgcAJoPy4pEuVPfI/PBJk6bB05fKP1zSvWxEerXisdQe4aJcofRbwD/PGyB1gAhD5zAQ1b6aATAjLlDj8UGnE7L8aLO6OQ81v1PJgGruUNJWQdg/9ZDSDiSTVaGO26K+VMj4bUsLBo6NObdADCSRsf78Z3RaWK8C0+XCCFShxl1bSXw5WDBIaPDRK62E/MOUXeb6NTbr2nH+/fwGQyCyh+eETJuxY98vAjUds/T+6S3A1D3QTqXSrArwVwDvTPWAeqWRQhZ4HfR2rb+anEP6AYOSi7BXANQSEgCijXFAozl++7dSSekSj+WlmxoklwC6n/uJhPAda4sefGTltUOI7KUD3/A74j7STTAz4LBp5h8pKU3APSCl3nOBscJyaaj+ckiFPVcaj3rReQTPf8zxghJvzgM+Ff2kxH4SObo9WIAXdoJRcgt4Je0X8cAxOfIPg3hJzOI8Kk3GetzsY3H3gQGqBjxm+GupyH5icL+uYQ6+RT4nYnhfwTZCF8IP/lT+WtkMXpCS7ni7s8RUubwV0xP9QuHiZfCb8L1EPjbLC6nPpX53ZcjnjGFR9TvVC9Lr4T7vnY34ZHqXzCXBYW6GtQbrRZNAc5g+/dyVJe6qetR3Kp/3+gn7scPzGVBCeRfDf93P7mqu0S0KupfvuAuEa2GfwBAmDhOFonFEQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKRUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0QSC70AAADbdFJOUwADXKKuSV0JvP+YtoXOSDEwBwzj+hr7/uAce4MuAVKLZCuCjt8l7EeSv0H4mZvIG/3oXs/AgFGwPxK+j2DYF2fy6ZYF4d33HuoCifao0U0KowQLEQ2Kt5+lV7OaBuf5LSjHJjn0tBaTq0UP5L3Zw1jWIGh3sWMOE1rbHVVTqtxmh/wfKcJEf6CmNu3Sp3O18EtlgToZdOYIuBROQztppOWh4lvecY0hxjfMKpBQl/Xr8e59ynlw09qprEC578TLMyMnFc3UeF8QflmyLNc4VnpybfNudoy6GHzFL8h50LwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASzSURBVFhH7Zf5W1RVGMe/Aw7DF2SHuaggwgwq4jIkSqEiOrKPC6CUgDDhzmCC4EppYJlrlKkYVCYaaiVmWbaZZXuRLbb/NT3nLsOdeYg7iU8/+flhOO957/3MOee+53IGuM89wBQUPEbFDIRo7UAIDjIBllB6CQPCh6JACLVgLCMioxSiY4DYaDUIhMgIjkVcfIL/pAInwRoHKVG0xo2fkAQgeWLKpJihEEBqmm140lJFOlEC7QDSJ5PxU4CpJDNM3hCYluk/ay+Z0wDYqQimc8Z4zsQsR9YDs2nWQgDZnDN3eOYwWyfI4YMPORIRxVzM43wtBLCAebop68njAp1gIfMXcTGcS1jgKCzSQgA2FkcMTzFtOkFJaZnVFQtEL2XcsqEQWL7C6j93FeuK5ToBUC4WH0BFsk8IxFQOj3LBkOAuEYJRAlrto8B6L6bw/whWrgqvqqp6ON2/P2DBI8qKJTr9+o0Fq4Ora1bXYk1dvdvtfpRuv7ShoEH+4oK1xetEtJ6pwIaNmzZ784aCRg+bJoazUNoioul8bOu4ZtK6VcvPzBpR0LIcDR5uQytpFnFRMymxbbvVa9ixcyTBLu7eg7UMBXIVAUo2t9mn1qLdan3ce9UIgifIvdH72AbM55M+mfaOOKXRuX8kQROfIunYDDzNpgPPHJxXr2UOZR5WGkfyRxIc5ZRj2c9GAtiulEGwmnB38ZjS0p5C+jZfnpOzz/OgescB8vi0FyaeQMXJWQDmsVRNaIJq3f6U2SmyFae4T7mu+zSXvigaPdxSCaRxjp8gqdWXXUq6N55t7S8FvVziNZTn8BWgqONMua9gOFa+aj8rKeOZMWTYcUZKEiPOWtIkyloT9Bx1uVyuPjTWiL8u16oSMVHJcW5Z+1TxJHSG83wN6L9gdTBCJ9gkf1EGLqpLUFcpiqdBHslJhnl0hk5ekruTPZJOEHtRUAm8Ljcu9gPIYIt85Rt8M93Dy96VHLiiTNFOgzXQBBvZg3TPZO+zeOuqkvcRvL0my4d3LEOCa3wX2CmfAYTBzfeGEZSWFfpwvQJ4n7kf2PKAD/mRfEPveXkdPuYN8wln66Yx8YsMplCfRfITwHRWuini0+pKkpQKxEIH6QQxbvengOkzt8otcYcl6ubnXAvs4xeNotw9nJ6M7qNNtppE8subcmVqAvHO/Aop3koe+FoZxXaxG0rCeUksR7qHi9X/nN/winy/V/BteNV33yNSvLplakyKoJ+DoiYzuM72Q6zTbPXugTBO8BH8Cxua5UMAnMfL1KGJ7Vl++8feTvVZGAjC2FartPJ+Wt+8+8YFXgOcuSQvZ2XK/QaC9bztE4eIN1sQZ/98hvxF7jEQzJUKzUBDaesGJd7PI8lI4ySxnuKIZSjAQqnQfKiLzHSdEKHzFO+ghwV70PKrUqZGAiyU6sqY8tth/i6i8aSj9NZB7v1DyxsKMP9w/kmguytfBNX8s4sdS8g7WtpYgOQS8Vk8ID7DmZpgOyfV/dWpZQMQKMzk7sHBwbpCUaHlslLBTvWwbUTUdVFGV0P8+xOlgI/73RaLRdkJOsRxfywjzH/fJWbxg0P/k+e/E2oBTH3BOXdJcJ+6a+8zOv4BK8mE8uJCI9sAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKpUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////z0UFbkAAADjdFJOUwAIeCsEsP/pJwcCpPLiH2H7fpbgHqDaGFP8cYfnJa3REUf5hPX+Y+0tuccMPGJWaYM58LwyVEkN/WQp6n8+aIrL+PQVM00S48m7+vGN82vuNhb2L12rF8om6IVMUKoDlB3hWUQBnZ/ZomeO5JEQz9cUBanvs3Yxcz06oazFwmA7ZSAczTU0zFWypaO0Ib59JEinmOao3sichpvG5dwPZvd7BnVuP+zQXJdXww43OCqBkt3f0wuJS1KCwdJ5QihbSkO4CRrEQUZ0CpqetrF8vy5Yr4BtLKaM69uZb9ZOGbdAenATk8HpAgAAAAlwSFlzAAAOwwAADsMBx2+oZAAABTpJREFUWEfNl/lflEUcx7/K9lFX0Q1SWQVdl30ib9lQNiQVJNF18QDzyALFlcOjFQGhFM88U5JABO8jSYS8UlPbQFHRMssss0O7/pJe8zz77M4Mh/BTvX+Z+R7zeeaZeeZ4iP5HdOkaJLs6heEFdOsuO3V6yI6WGHuiF4J7y26NPqYXZVcLQhD6Ul/06y/7GWFmYIDslBiI8AgyDMJgixwhGmI1R9qUl2W3QFdEvcJedSiGDZdjI2zKSCYySg5wjAbGGFkl2o5Xu4ixGLva/bFm6zgxwBHrAKCGowC8JsTixiNerfRRbK8LEZ4JEydhLKskJE6MnKy6kt5QiynJUKZOYbM8zYnpEWIzHpdPINxnR6dgBiv7zwQwi4hmA0hNE9oISAJpM2FyzGE1o+FNVWAu5hnUYWoDUWD+Ary10Gl6WzXe0QV8qekZIYZAQx1BYNFiZBBlOhKWMEsScC8FstxCYwYvMDcbOay3uUpidEuBZVgejBVSc0Fg5bvwrGJG3mrkp8kC8Rgf170bxkjteYEMAAXMKAQwWBIYAHsM0Zp8FEkChSjWBd57fy3WMWMgSnLWiwIjFdsIFtqQqGwUBYyb1EIbxM26QCYrOIEwM7Z8wHxbt8G8XRDw8RyBHQB2Mt8uAB8KLUctjmtdwL17D0rHfeRWBWbvHYAyFtqJor2zBQHhOwgIJH1cDpVuFdogRusCG4TmbQnsA5yV+6uqqg9YgYOsj50S2A8cGu3boQ4fycbR3M4JxMN57Hggw3AiAVWdETiJ/E/EnOhTKOy4wCxnKlsIAkkp5sKOCqTX4IiUQkSfIlUTOA22B/PIArU403LJEg2FJlBXL0dkgRKoe4HMZz6BlvgFzvY55zqPC46LrXWA6HNNYIJHPsI0gUtO7bsDcFpK8HG53UG8kgylsmr9F3OuXnNekRJ81OL6l7neutYFShWUfeWz06W4Tr3aPdP01gRKYdcOk/YwNozOLa0IB/o1igEX+ir2JNHXNsYbN4GQPN7lApSFvON5LAzHzSbOdgE9ObMD3BqMQdxUu6DM58MdYFU2TgQsF27zwbo7zbdYudnr9XrZlkjUo75xq/DWFJR6dLffcOEqF7prA5SbQUSh6qzdILo30A4gKl64rpWir141fo2GQGA7bGXfhCLfTXZrVlZWhoWmbEHqjpD7Vpzhb0DDo6zaZcISWQ5w8/otu64YTj4gsudrngLsYa/UuxK7AmlE57U137wApu8iuTkp0O475BcoRvYltbIyWfk+kEdLsJodCSYs3cx5iR7C/MNe9TZhtzc1NRlpBfRLXhEecYl18BDFJJi419f4MRwIzXUTsZGDh+7jJ19kBB7ziVEp5N6Gk7xL43jtNAe7ZNjNHo+ngnYgxhfwIofPC3ZQIypb3zpiypGmj0Gk/5Opwl0+6ZSNclDLexjG5nus+BkNusBZxxNtlCJ6WRdxmbFKP/pFOcx5VBpRGUTU+yLW+KdxBfZ5idxXluMcn3kHaylhAe9RiT0DJXuSlR3kdnNNTc26TZT3GEgeVg78Klz1lmEGmQ7yHo28334HnjzKI5rHZsHJ7hSjDphhuvZUyGsab3pGwSZ+VfuJ7a8+Kt1isVjUESFqeib/t6jH1CD+G+4cEYnW7kSZuC8HOsjK62A/QscvIEwOdYjJU/GHuncPUVLa/g9omz8Xo8S3tAth/avVgWyH+rUKdvkb5R7Fk+oJD2vbYZybduv1hr+rDwHJ/Ac8vyJwJrZBMd3mLKXyiPRn9U/YscsT2+FBF1qi16uKns4VW/+3/Av6QHYJ5INqJQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALKUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9eyzlkAAADudFJOUwAQZazd9/3uyo89AQ2J9P/749zvz0Y24JY/CBtixpoHSPaoGE7lvgsy9f5xF8yxCdl4Em55uFyTn4A0MfET6ihP6LIUmX22VvqQPCtZ0w4qFfBEBa2U2B7AMHcRo0ws7DqhZsEth9IE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" preserveAspectRatio="none" id="img4"></image>`,
      };
    },
  });
