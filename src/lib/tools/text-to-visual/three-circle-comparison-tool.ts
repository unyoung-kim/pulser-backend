import { tool } from "ai";
import { z } from "zod";

export const threeCircleComparisonTool = () =>
  tool({
    description: `
        This tool collects parameters based on a "Three-Part Circle Comparison" template and outputs them with the template name.

        Purpose:
        - Visualizes three interconnected themes or ideas side-by-side in circular sections.

        Structure:
        - A section title and sub-header at the top.
        - Three circular sections, each containing:
          - A title summarizing the idea.
          - Three optional description lines for additional context.
          - An associated Lucide icon.

        Parameters:
        - Section title and sub-header summarize the overall theme.
        - Each circle includes a title, icon, and up to three description lines.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title summarizing the three-part comparison."),
      sub_header: z
        .string()
        .describe("The sub-header providing additional context."),

      // Circle 1
      title_1: z.string().describe("The title for the first circle."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first circle."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first circle."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first circle."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first circle."),

      // Circle 2
      title_2: z.string().describe("The title for the second circle."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second circle."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second circle."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second circle."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second circle."),

      // Circle 3
      title_3: z.string().describe("The title for the third circle."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third circle."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third circle."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third circle."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third circle."),
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
        template_name: "three-circle-comparison",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJGUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9lc8+YAAADCdFJOUwAMOmeNstDp+6kWWJjS/P/6KX3L/ffTs9sVc/W/hlMkAjOk+d+FPgbUsbnqLI4npz1yCfaRHTfYnBwBdsotCqz4dQMxGdYRSUwloAQ0wf7R3j/o44AmDc2XVcC6niuKPHnvKkvzn89CSpAUxQsIeijy6x9czMhII2Eeo22DrzLXa1K3Oe1iXdkTIBub8clxWVRbB6t85jbuV92W5H87ZhBgEomlxtUPlSJBTngajOL0TbuEQ6Kmts57d2y4asSo3Odf0SfhEAAAAAlwSFlzAAAOwwAADsMBx2+oZAAABRNJREFUWEfVlvtfFFUYxo/ILVj34bKLoFxbFcECEWVhJRhWQHFxSQFBrhK4CkEsppCmkmARiKShKaEWSt6CpMzulv1nfc6cM3PODLsk/db3l3nP877Pu/M5O+dCyH9jTcja0LDwiMjXzIlXISrass4KRow5+a/ExsXbmNeesD4REeb8yiRtCFe9G5NTUtPSCVmPcHPJSmS87qDuTZu3ZHJlK7JMNSsQkq26gW1vaFK6HW8ai4KTk0VnLHc7yZM6pAFrTXVB2JHiAPJ37qKx1CEVCDFVBqbACVgLi/hIdEiBdY2hMDCu3TFAcYYQaIe3aJCMdVJdMEpKAaXMLUu8Q+ZGWGQ5MEnFQOIek8g6bAGiTYnllFcA2ZUs3rV3XxWX1Q6bYYuSawORVAHs96hh9QEvgJq9LEE7vI14Y7XOQUv4odrkunpyuAFodKnaEfUrBLy7WU0eHcQZfZycJr7SbKXNQAvzt9qhtLUXHO2AV7wD3jE6GZ1dgL3ZcsxH3xhh7P1JKSKP02dsB2qY4tqkRUZOxMDW3UOjnHcBXy9T+xS0sOg9gM3kdmCDsOn0+5G/j4Vpfgyc5HI98D6LCgCWz4WSxLMSnlOwcr/nNLyDmj4EfMCidkBVz8TgrJaV+BA4x8OjQKiue/w4z6I2eNVFsRO4oKd1erdhmG8WVXZs7ROZQv4KxxUcoM8iO7JFVucj4CIPR2AblTJFl4DzH39yLBKOajouDLySazCWzqJOmBZKyCW+lR6howvWgJtZLMC/M3cCOj4VifFxQiYuTwL20lY1fQWOepHWmQKGyMnBz65mXAPKhN6pKON0JofqP2dCGZAi0oJpDFxPZC+KGyW63KlAbaCzR4FzhyxoDPNFQMnTVdckFP5tMCoTEfOFLOj4ATTktVdVd+iLkJI12SlXeZr1qTLjwM1b9NlP15HUQUR0sB+YNiiCspFY9dkG7wzwJa1qn+021rgagStifgKSPoum8mHW4TZmDTlPC1ARYBEZuAPcJbRDo4t8dbtdTvWGARXlsiLR8/UcC+7BGkW0DgZO+oBTwX6/3In7LPJhXhWWdRgcAJoPy4pEuVPfI/PBJk6bB05fKP1zSvWxEerXisdQe4aJcofRbwD/PGyB1gAhD5zAQ1b6aATAjLlDj8UGnE7L8aLO6OQ81v1PJgGruUNJWQdg/9ZDSDiSTVaGO26K+VMj4bUsLBo6NObdADCSRsf78Z3RaWK8C0+XCCFShxl1bSXw5WDBIaPDRK62E/MOUXeb6NTbr2nH+/fwGQyCyh+eETJuxY98vAjUds/T+6S3A1D3QTqXSrArwVwDvTPWAeqWRQhZ4HfR2rb+anEP6AYOSi7BXANQSEgCijXFAozl++7dSSekSj+WlmxoklwC6n/uJhPAda4sefGTltUOI7KUD3/A74j7STTAz4LBp5h8pKU3APSCl3nOBscJyaaj+ckiFPVcaj3rReQTPf8zxghJvzgM+Ff2kxH4SObo9WIAXdoJRcgt4Je0X8cAxOfIPg3hJzOI8Kk3GetzsY3H3gQGqBjxm+GupyH5icL+uYQ6+RT4nYnhfwTZCF8IP/lT+WtkMXpCS7ni7s8RUubwV0xP9QuHiZfCb8L1EPjbLC6nPpX53ZcjnjGFR9TvVC9Lr4T7vnY34ZHqXzCXBYW6GtQbrRZNAc5g+/dyVJe6qetR3Kp/3+gn7scPzGVBCeRfDf93P7mqu0S0KupfvuAuEa2GfwBAmDhOFonFEQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKRUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0QSC70AAADbdFJOUwADXKKuSV0JvP+YtoXOSDEwBwzj+hr7/uAce4MuAVKLZCuCjt8l7EeSv0H4mZvIG/3oXs/AgFGwPxK+j2DYF2fy6ZYF4d33HuoCifao0U0KowQLEQ2Kt5+lV7OaBuf5LSjHJjn0tBaTq0UP5L3Zw1jWIGh3sWMOE1rbHVVTqtxmh/wfKcJEf6CmNu3Sp3O18EtlgToZdOYIuBROQztppOWh4lvecY0hxjfMKpBQl/Xr8e59ynlw09qprEC578TLMyMnFc3UeF8QflmyLNc4VnpybfNudoy6GHzFL8h50LwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASzSURBVFhH7Zf5W1RVGMe/Aw7DF2SHuaggwgwq4jIkSqEiOrKPC6CUgDDhzmCC4EppYJlrlKkYVCYaaiVmWbaZZXuRLbb/NT3nLsOdeYg7iU8/+flhOO957/3MOee+53IGuM89wBQUPEbFDIRo7UAIDjIBllB6CQPCh6JACLVgLCMioxSiY4DYaDUIhMgIjkVcfIL/pAInwRoHKVG0xo2fkAQgeWLKpJihEEBqmm140lJFOlEC7QDSJ5PxU4CpJDNM3hCYluk/ay+Z0wDYqQimc8Z4zsQsR9YDs2nWQgDZnDN3eOYwWyfI4YMPORIRxVzM43wtBLCAebop68njAp1gIfMXcTGcS1jgKCzSQgA2FkcMTzFtOkFJaZnVFQtEL2XcsqEQWL7C6j93FeuK5ToBUC4WH0BFsk8IxFQOj3LBkOAuEYJRAlrto8B6L6bw/whWrgqvqqp6ON2/P2DBI8qKJTr9+o0Fq4Ora1bXYk1dvdvtfpRuv7ShoEH+4oK1xetEtJ6pwIaNmzZ784aCRg+bJoazUNoioul8bOu4ZtK6VcvPzBpR0LIcDR5uQytpFnFRMymxbbvVa9ixcyTBLu7eg7UMBXIVAUo2t9mn1qLdan3ce9UIgifIvdH72AbM55M+mfaOOKXRuX8kQROfIunYDDzNpgPPHJxXr2UOZR5WGkfyRxIc5ZRj2c9GAtiulEGwmnB38ZjS0p5C+jZfnpOzz/OgescB8vi0FyaeQMXJWQDmsVRNaIJq3f6U2SmyFae4T7mu+zSXvigaPdxSCaRxjp8gqdWXXUq6N55t7S8FvVziNZTn8BWgqONMua9gOFa+aj8rKeOZMWTYcUZKEiPOWtIkyloT9Bx1uVyuPjTWiL8u16oSMVHJcW5Z+1TxJHSG83wN6L9gdTBCJ9gkf1EGLqpLUFcpiqdBHslJhnl0hk5ekruTPZJOEHtRUAm8Ljcu9gPIYIt85Rt8M93Dy96VHLiiTNFOgzXQBBvZg3TPZO+zeOuqkvcRvL0my4d3LEOCa3wX2CmfAYTBzfeGEZSWFfpwvQJ4n7kf2PKAD/mRfEPveXkdPuYN8wln66Yx8YsMplCfRfITwHRWuini0+pKkpQKxEIH6QQxbvengOkzt8otcYcl6ubnXAvs4xeNotw9nJ6M7qNNtppE8subcmVqAvHO/Aop3koe+FoZxXaxG0rCeUksR7qHi9X/nN/winy/V/BteNV33yNSvLplakyKoJ+DoiYzuM72Q6zTbPXugTBO8BH8Cxua5UMAnMfL1KGJ7Vl++8feTvVZGAjC2FartPJ+Wt+8+8YFXgOcuSQvZ2XK/QaC9bztE4eIN1sQZ/98hvxF7jEQzJUKzUBDaesGJd7PI8lI4ySxnuKIZSjAQqnQfKiLzHSdEKHzFO+ghwV70PKrUqZGAiyU6sqY8tth/i6i8aSj9NZB7v1DyxsKMP9w/kmguytfBNX8s4sdS8g7WtpYgOQS8Vk8ID7DmZpgOyfV/dWpZQMQKMzk7sHBwbpCUaHlslLBTvWwbUTUdVFGV0P8+xOlgI/73RaLRdkJOsRxfywjzH/fJWbxg0P/k+e/E2oBTH3BOXdJcJ+6a+8zOv4BK8mE8uJCI9sAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAITUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wl/jeAAAACxdFJOUwABSKPd+vkpx/8Hk/BC8uV4LEGSpg2lOObG114E2nmi2d7cpEnYyCoLy5/RX/RgygnrG7oKoDfuNlv3vRNSqBArAoeVDrJoZLgSI1aK79Ai1ECplAjb7PtXJLsFiO1PKGwu03YRkc9E8RgDas6wnb7hL6f94lNY6Q8Vb7Fpw4yv6I0tlzKP6q1NFxZ9tc1tFP71Ho7Srk4f9jzjSj3g1R3WyV1+/HvfiYC5WsDzg8FQ+Of+u+4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQtSURBVFhHxZbrX1RFGMdnF3b3/JaNZYUNVMDcLIT15CWUFJSIxDJIUxSVYrXSUsFryuqmWBa5XXCJCrqX3S+Cf6KfmTPnnJnZmT286dP3zc7M8zy/M89cnllC/htC4arqSLS6KhxSLcsjZoFjxYTheE3CHackauKCUeSRWiTrUvF4qi6J2hX+eI0YTqkXo3xitWhIO830o6j155BAo+9FSCMSYtcjZKHBSz3UAMvrAJ6Tts8JoylNyMpVq5tpL51E2LXwALYUllmgCnXMiBYm0Yo1rsWiUXwpKghUI8WMjzkSKVQrDt5SGASioLsDNK9uoR+KI6o4eHEGgYhRgKXAjoiTCxfwDg23rFVTyLgCLKBcQIynQ48bF9ELMPR5ex2SaUKsJ/g2NpVtY5BA6En5IK1UD5JewGKJsXabcJQbxKPMA/hxMAuwy9RKL1Nrk3SZxLkKfTUF3XVe306/arhMGgESWkcLSmaNW1A6kDVfZxrkbq46Sc4G2G30FtXLBaXeKSjBAm02nlLHBHQpyGTRoQ6JBAtYG9fTeWTd7VOolMKmqs00ecoGG+2y0aWCwJaNwNOs1dkBbKXz0GBOYVsSmS48Q5vtsI3raBTYvgPdPTt39dK2lX1WsMiIWysI9D0H9LMLKRLSPFVqQXF4fjciA6y154UX2W9o70uD3UMvaxR07NuPza84zQM4SH+GD7EvLFNgxWHs38fbqZERWuOGDw11Dx45urz4gQh284pACDmIY5JVg78MiRgho/3Aq32+tec1jIneGvxFTORITzd2bJfMx5Fh9878vIvbfyKDpm1+l9L8Ot6gv4Z6IAm8eXIEp7a4PZe38PZpc0USBM6cPQxgXMifM4Fz6jmV+ryVywLnGy9gj+hFuXgJl/cGC6TfwdorhFzFZF50u3b9FD2iedctV7DtAqu1qsC7sDrpkb2Bm1706NhUBLj13vueW26I7QBVUAVu87l/cDl6zRm/+OE0EP3oDr9TzK2AqeLHEyhoBE5i0Ol+8ukwm/o4gM9m7rpejpuNIiFF2GUCm7aWMPu5OzI6NhUFJudOeNEaAe+NY5Ya2F/gktO/OzcJRL/8apQQ0t8vCxQwUSw6KfhQyzRi8wulr+nXr3cByPKpoyS5kRhbxKGcH80t3+Db777HDz+S8E/Az/ciJX6e/UR5M0a3kcXLKfxChUv4lX69lCJz7h/MMgEfeRH7fsv8/sfRAyPo+vM2/iL5SfyteAUIcNLzzaR3GnfIAH8RBFvwZXIZQEv6Hv5Rbcu5zg5nxrFQwlnVZnjeNQJk/nzp3/tli2hG49TpvikaWzmVnCrZHKSXSY/hjwFH9dahxkgEmIM9FiBVsHLymFWHJBZxnP74N8PHGZvBomqQWMKDGa9iytCx/MwDLKkGmUF1yVR4pTOztDirxvjMLgZ8///mIR8Lo6c+g5iOAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img3"></image>`,
      };
    },
  });
