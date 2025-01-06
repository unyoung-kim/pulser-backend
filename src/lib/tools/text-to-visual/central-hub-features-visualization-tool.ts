import { tool } from "ai";
import { z } from "zod";

export const centralHubFeaturesVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Central Feature with Six Supporting Highlights' visualization. 
    It is designed to present a central element (e.g., a product, feature, or concept) surrounded by six supporting points. The layout includes:  
    1. A main header and sub-header at the top for the overall context.  
    2. A central monitor in the middle of the template.  
    3. Six supporting points distributed evenly on the left and right sides of the central element, each connected by dotted lines.  

    Each supporting point consists of:  
    - An icon contained within a circular shape to represent the feature.  
    - A title positioned below the icon.  
    - A description of up to three lines below the title for additional details.  

    This template is ideal for highlighting key features, benefits, or functionalities related to a central concept.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the central hub features visualization."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Node 1
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

      // Node 2
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

      // Node 3
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

      // Node 4
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

      // Node 5
      title_5: z.string().describe("The title for the fifth feature."),
      title_5_desc_line_1: z
        .string()
        .describe("The first line of description for the fifth feature."),
      title_5_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fifth feature."),
      title_5_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the fifth feature."),
      icon_5: z
        .string()
        .describe("The name of the Lucide icon for the fifth feature."),

      // Node 6
      title_6: z.string().describe("The title for the sixth feature."),
      title_6_desc_line_1: z
        .string()
        .describe("The first line of description for the sixth feature."),
      title_6_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the sixth feature."),
      title_6_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the sixth feature."),
      icon_6: z
        .string()
        .describe("The name of the Lucide icon for the sixth feature."),
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
        title_5_desc_line_2: "",
        title_5_desc_line_3: "",
        title_6_desc_line_2: "",
        title_6_desc_line_3: "",
        ...input,
        template_name: "central-hub-features-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFKUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2ZxLZ0AAABudFJOUwAWzffLcAjT/9IcC0/XBxAM9s7HyFDB9Yr4bQ8CJn7A6/7qv30krv2sI2OkUx8F9F+oeWowl9n5XiUJmZgir44zqaqa4iwhfyixlu+7sBfm+zTYj7oteOP8IKdruEvwthlz6WUKHWRHt5LKMZGT15JfXAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAvdJREFUWEfll2lTGkEQhhtReCVIQozggqLrEVQulcssJEAiRtDE23hENOaOyf//mlr2mh33AKu0KpW3it3u6e6nmJ7ZZSD6l+QZGPDId+/gkI+P9SKPH/DLBADDAT7qLo8ffn+X8Cg4guEQH3eTXO/pXojo8QiG+AQXqaUaIYhBPsNZWqFmPEGYT3HWUwCjsjEKYICP9qBnACAb8r1L6l8agB/vWU6AsUhU/mpuklMVKxoZY+vH+UwbGQAA40b9GIRYnOHZiJ1CPCYgqEciiDF5tjL3IIaIHgkjrgS0j7XMgDii5ogdQN44ytKbAWwiX2OS0cA7A7TrPQIc9SAAR9YdAVaL1xfAavH6BGhXK4tJ4U3z0P8IcF68HgDOi8dUmKpuQa3KtJSJidtVPQMmE1PTojgzOzd/BwDR/HNRm2FyYbF/wFIYQiqdyWYz6ZSA3HK/gDlgRT+TBFaAVc3R8hjDArCEZJ6oUCyVy6VigSifxFo/gBdh5EmqqE0QqxLlkXvJAbQO3RbRK6yQFIG3Vvf56jUvZiVq4HXvgElRCNAbrDeV9OY6qhQQkhtmgIPeIkUF0dukzVZO9ptesUAppo9ugCmkqY0abW6pmTUUKY1tPYH/zmYRTSNDJdSphXfvuwV1lCiDnV4BEyKyVIaPclDqyYcyZbHLAHTTSjpAl8QBovLPu4Nm1Cno2sO+aQpuB4xZtYm6DtCmNA513+2IM6cto6ojobuMx0aG8yGL5pNCgCr6Rjr6gAoFhJNTA0BBp2Me0YKxlaW9AwEReSufMfVWSqCo24s508NUkegc+Ojyh2EQF4azrDzO7f1yeb9dIDpPih1cOhKuxKjEuKtAw3ihNCB+al47Ez6jxXhfvq7l2FcaOk1yIbTwzXC+R1u00UhqXT05+4FrF4IUFa8MT5nPxur2zu7uzuHxKYUuVcJPtojVBX6xrqmjshTCDTrmYUNVJFg3gSrrqoSbgh2A2UWMzDmhS3nMZgp8qSIuKfR7q/PHtokPqb9IYGnRWFeZrAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI3UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2m75XIAAAC9dFJOUwAOxP7/yRFjbAOjrAFE7ezinEiW6mDmRffPWaI/NqVUxkv4CATyTvn914qD3ToCZ+mAJiXxcTyBcwsVcIcs+rKnNFAGIpXjtUO/6BAKqJ4FN3S+Lqu4LcVk5WsrKIng2RfaXIiP861CM3i29rll62+9weTuTxl1/JmGmrSdqgcMe2J8DQk55xSmaNsdpN9hqSevwLwfsRuzW5gY+xyUXx52jthBf/A7yIJAEvQTi5c4Pj26cpMWd9bc4TIw0ZYyC94AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQRSURBVFhH3Zf7XxRlFIfPuk8CuoCtpGSlrqxAZqRB5YIgha5GKhCCcpFAoVLksqLiBS8ZC6V0s6yIyCy7Gnaxe/5xfd6ZnWH2ZQdm+7HnB+ac837Pd2eZ2fci4o5vkR/Af99ifcQjGapdkamPLEhWlvq7xDJYqrJAQFe5k52Tm5klsgzuDwaXQ15AAg+syFup69wI5gMPrnoIeFjkEWD1mrVAflBXpia0zrp18gtEwuvtdF1I16aisAiKHzU7NqjCY2a8sRiKCnX1XB5X/RklT+SyafOTZql08ybKngpnKIendf0cngG2iMji7MhsMRIsF5EKYKtTm5LKKtimF02qofhZvTiXDcBzVlKzfXuNFa8EdtgydyJRWGuG2TvzIX/nLjN7HmpfSJKmZncO7FFBzV7r8e017qIacnbrap26+oYXwd+oXt19Vj/sU69xox+aMhtL9B4nzbWGfr+KDwAtrW1tmS1AhqrsNwaXtetdDg4aEv8qESnpgJc6VbGzCzrU5x4yb+ew3uWgG3permhTYT3wilndBdSr4NUjR3uhO7kniW44lgj7oD/xAw70Q1+ifMyzwQB0WeUuGEiEbgal3YOxWCx2HIbUNRaLdUFVIoxVQVciHILj6jrYXersP9E7+8i80ntitv9kjz7qhZ6TtsEpGD59Ji1OD0ODbXAWztmJR87BWTsZgfNJox44DyN28n83CEciF/RaWgYj0KrX0jG42ENvqtV5QYOLl5qN62uwWpovv66PL2AwuiWPuBEtUtNCnP5T2nQ4r8GFVjWNGQbtfjYGJA6MDRQ4NfMYhDM6gOLqcZUchMsi428MA9E37TViHoOSQ1dU+x5jXpPwGMNXVdA+oSzeejts6VwNlqr2d8x2kUI4mgjfXaIs3rN0rgbXgPc/sLLrsMaKP/wIuGZlrgYfR4GiSdPikynyEt/702m1bxn7zNK5GkhBhVpdiiZviMjncNMoXt2hti3OZ5lkMAkTdiISOZKrLJol8AVUqkqlah+65HybJmDSTuqHyr50jIn4bn2l3oOv4Rsjj0PZt8kr83frh4zFxqTO8YBNvt96O66+mrmgxG8f/kFX1NTpFY3OcZm5c8dnxOXGIunOj9HaxCbCOz+taPnZTrZBLGnUA79Ak53cdD4SjyyHaTu5MNDg2NN5Y/Tu3VG99h/pvJEC46ecTLmuUXSKTOtrpoH/lt5/RpeY/CpTeslEn0h/K9IVJlOiVyysLUmC3/VxC2XQ167TBH8knXBK/oTruqq9L2Ew9yAS0j9Hka2rJOhqkPWX3g1X5h663A0kU2+HA7pmXgP5O6jxj65YwMAThoEfPJ3FUhECv0RhMKTfrzdCgxCVGf2flR4z4run19Lhnk/ENxM1Tvnp44/O+ORfGWkVDOXOqmsAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGnUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////13FQxoAAACNdFJOUwAosfT/77AXFvNP8U7wDozj/scCNNTG0wGb/fY8azKEwOf76MKGM35C/MMK15ztkUUUG0qS7PcYWJQSyfiADAlWCAUulyC1P0PIVXw4WguNkIW4f8zVvxXa5gdJ0ukE+oj5GqBRHEYRS76TgikwdHvEKofet+EdK7uK6i0G2I+hJBmOO7xBtAOVLDE37t+Sx6cAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKiSURBVFhH7Zb5VxJRFMevzhfQcmHCjKw00SSyxA0qk1RKixYqSylUbNPKLG1P2vf1j+68Wd68efFssF86HT7nwMy9797PMJc58Igq/DdUVWsoE626Suj3ycte8DmGavgDjs4bNX74eaCh7H6iAGr5OUC0aXMdf3mDdQmndfV1/OUNSeCioTGoyzNzsWVdQahpq9wg0ywLZLY1hV3OUqgFerCxwVVaGvUteKQi2IAgFHLH5Qm2t+jAjp1iqkyB8YTsElN/ELS27W6PRDo693RZiWhZgr3N7IKxFva+r5tloojs9yzoPgD0xHv7wqH+gcFE8qDZf+iwV8HQEQynjtrRSI3VTymMimVKwVgzgvaNWxj9lD7mSioFxxEcF2NjfhPuDEMlOKEPtwqhef1hnHTn1hFkkBIioz926jQy7qRacAYJPj+DKCJnKZuA9LGUgnM4bxzDFyaNP4uLxvxoEG1OjYlCcAm97BCOA1MBe/5EA5h2akwUAg05sz95GVMBu5/6ccWpMSktyCMWNvtncrOYs/upgHleY1FakEZLiOgqkjNEuVneTwVc4zUWpQXUg+tEGdZPlLtx004veL0F6sQi0S3pUSS6jTtySiFIodEJHJZwV04pBMt6e96JbLIJ3JNzCgFN4r4QWaxgVU4pBa0x7YEQGvQn2WQkhC4N7EfD5iEeLQgho68Dj8eknLjFcW+yCpN40uSERE8D9GxONgTETZawzUuME2WfY35tyF7sXkkWX3DDy1e8VNjmUZW/VhBQ+rUO7c3o25H0u8X3RQCOgQtq/UL/73xY5RfCx0+fBYNnutYy9dCL09FlovyGDGycX6wTy1Diu/AKN3yVV7ySn0DxG32HT17wDDN0/fgLATMAWJLTZZCP//QNbnSIFf5tfgHEfmHjUsjlYAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF9UExURQAAAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////D9UBoAAAB/dFJOUwAHTpXJ6/wRg+z/hFrNej8XAxY+BJm9OTgFrvViE2225fvkFDUJhgoj1P61WyAh5tU2vAxrbL6FN857lMhq6n5/GPoZIuNBXLO3fNL0Es/XDg3WgjrEAdO/CBBk9zu4XQbR9lnw7Zi04sNAfU0bJd4w6MYLqF6WAnCXx2MkbxowiAApAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADT0lEQVRYR+1V6V/aQBR8glEYsSqCB4cKBQuLRVRUqoLW4lVF61Hvq9Tetmq11Z5/e38h9wox1q/Oh2QnOzNJXl52iayjymavFmpqhGq7rYqfs4BahxMqnHW1/PxNcAlA/YOGxqYmd/ODekBw8QpTeLxAS6vG21oAb7teYY52H/wBomBHZ1coFO7seEgU8MNnPcELZ4Si3X6lBP7uRxRxwsvrKsEFf4RicbBEz2OPJ9mTYIjHKOKHxTrUCghQrBepPuVKXwq9MQpAsPYt6tBC0Tj6B0SSHhSPA/2IR2kIDl5bDlVOtNIwUpKfMSkhhWFqhdNKR9lQT0E/y4jjNAOkhAzzB+kJbLy6DOwYoQ4kxGGaiQFSQicGaQSjvLoMxtBMCfQQUYSxLJBlTKxmDxLUgDFeXQY5NFIYSXE4niWAshPiOIkwPUWOV5dBDTwUgtJ1gDxoR4g8COmElVAxYNJigIBnFEZeZmpAHlPUCEEnrIRqTFMCMzJTA2Ywa7GIdkzQIOZkpgbMIU3PLX1GG+YpuMDk1UAJaGMLBVq01EhVTjRQHZZelBhjpdPyClZpDYKVViYHXq5HN7ApJZSwPIT5LdrEql7HQ1o7iGg7hyzlu7CkrmltKwgnaQe5baPFCDWAXNjdo/wG2P5B7PAwfzDH8CpJmSJe8x4j3HE5gLw42qOoY0FZ0hZWtyjzBm95hxHuODbkAI8Pu9l1KqTfTU1Ovp9NF2h9pwifh7cYIPrdykcTl/UPzdrk2ibgteDX2qa0scyPT7uJ3B8/Ld68sUh+PbYdglRU8eh03LCcXveLHXU8KgWM3ri5qn6l7MqrSAGc+jq0+98y4POGIleeX29UzpUDvpzwftOA9RJkoYjTM3wt6LgIY4D6PjqmaZuPsH+uUQlmAawEVXpcxMWhyhTwAcarenwL4fslf5G3GJmhBldM2WiNj2kWoKnEDZxdSaNbBGg1uPyB0IHsN7UYmYrDCxSPVWZmMTKlBuf7ONL96WYWnpVetPATZ6eyuZyoMpNr8Asnv2WvbrK8xcgU/PmrZ6YWI7v2L+gny1t4pvWBDryoMlP7wHrrGJmK/w1Qa2AmMmfyTfnLVpmuBpVFZkyFmciM3dfgvgbSWSZ3w50D/gEIuIlmEIbjOQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img4"></image>`,
        fallback_icon_5: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJGUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9lc8+YAAADCdFJOUwAMOmeNstDp+6kWWJjS/P/6KX3L/ffTs9sVc/W/hlMkAjOk+d+FPgbUsbnqLI4npz1yCfaRHTfYnBwBdsotCqz4dQMxGdYRSUwloAQ0wf7R3j/o44AmDc2XVcC6niuKPHnvKkvzn89CSpAUxQsIeijy6x9czMhII2Eeo22DrzLXa1K3Oe1iXdkTIBub8clxWVRbB6t85jbuV92W5H87ZhBgEomlxtUPlSJBTngajOL0TbuEQ6Kmts57d2y4asSo3Odf0SfhEAAAAAlwSFlzAAAOwwAADsMBx2+oZAAABRNJREFUWEfVlvtfFFUYxo/ILVj34bKLoFxbFcECEWVhJRhWQHFxSQFBrhK4CkEsppCmkmARiKShKaEWSt6CpMzulv1nfc6cM3PODLsk/db3l3nP877Pu/M5O+dCyH9jTcja0LDwiMjXzIlXISrass4KRow5+a/ExsXbmNeesD4REeb8yiRtCFe9G5NTUtPSCVmPcHPJSmS87qDuTZu3ZHJlK7JMNSsQkq26gW1vaFK6HW8ai4KTk0VnLHc7yZM6pAFrTXVB2JHiAPJ37qKx1CEVCDFVBqbACVgLi/hIdEiBdY2hMDCu3TFAcYYQaIe3aJCMdVJdMEpKAaXMLUu8Q+ZGWGQ5MEnFQOIek8g6bAGiTYnllFcA2ZUs3rV3XxWX1Q6bYYuSawORVAHs96hh9QEvgJq9LEE7vI14Y7XOQUv4odrkunpyuAFodKnaEfUrBLy7WU0eHcQZfZycJr7SbKXNQAvzt9qhtLUXHO2AV7wD3jE6GZ1dgL3ZcsxH3xhh7P1JKSKP02dsB2qY4tqkRUZOxMDW3UOjnHcBXy9T+xS0sOg9gM3kdmCDsOn0+5G/j4Vpfgyc5HI98D6LCgCWz4WSxLMSnlOwcr/nNLyDmj4EfMCidkBVz8TgrJaV+BA4x8OjQKiue/w4z6I2eNVFsRO4oKd1erdhmG8WVXZs7ROZQv4KxxUcoM8iO7JFVucj4CIPR2AblTJFl4DzH39yLBKOajouDLySazCWzqJOmBZKyCW+lR6howvWgJtZLMC/M3cCOj4VifFxQiYuTwL20lY1fQWOepHWmQKGyMnBz65mXAPKhN6pKON0JofqP2dCGZAi0oJpDFxPZC+KGyW63KlAbaCzR4FzhyxoDPNFQMnTVdckFP5tMCoTEfOFLOj4ATTktVdVd+iLkJI12SlXeZr1qTLjwM1b9NlP15HUQUR0sB+YNiiCspFY9dkG7wzwJa1qn+021rgagStifgKSPoum8mHW4TZmDTlPC1ARYBEZuAPcJbRDo4t8dbtdTvWGARXlsiLR8/UcC+7BGkW0DgZO+oBTwX6/3In7LPJhXhWWdRgcAJoPy4pEuVPfI/PBJk6bB05fKP1zSvWxEerXisdQe4aJcofRbwD/PGyB1gAhD5zAQ1b6aATAjLlDj8UGnE7L8aLO6OQ81v1PJgGruUNJWQdg/9ZDSDiSTVaGO26K+VMj4bUsLBo6NObdADCSRsf78Z3RaWK8C0+XCCFShxl1bSXw5WDBIaPDRK62E/MOUXeb6NTbr2nH+/fwGQyCyh+eETJuxY98vAjUds/T+6S3A1D3QTqXSrArwVwDvTPWAeqWRQhZ4HfR2rb+anEP6AYOSi7BXANQSEgCijXFAozl++7dSSekSj+WlmxoklwC6n/uJhPAda4sefGTltUOI7KUD3/A74j7STTAz4LBp5h8pKU3APSCl3nOBscJyaaj+ckiFPVcaj3rReQTPf8zxghJvzgM+Ff2kxH4SObo9WIAXdoJRcgt4Je0X8cAxOfIPg3hJzOI8Kk3GetzsY3H3gQGqBjxm+GupyH5icL+uYQ6+RT4nYnhfwTZCF8IP/lT+WtkMXpCS7ni7s8RUubwV0xP9QuHiZfCb8L1EPjbLC6nPpX53ZcjnjGFR9TvVC9Lr4T7vnY34ZHqXzCXBYW6GtQbrRZNAc5g+/dyVJe6qetR3Kp/3+gn7scPzGVBCeRfDf93P7mqu0S0KupfvuAuEa2GfwBAmDhOFonFEQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img5"></image>`,
        fallback_icon_6: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKyUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xDJ/bcAAADmdFJOUwAsWGAuPtD/0T/756qfWST2hwaGmaHhLTX8A+7v/WlqMvLNWgkzUmFjVjkPLx96x/qFHBol6Kut07Cenaz3vXf54LkOl6NMDAdDkU1VtbMV1sULMdyNFstlzBFI9CkhXUojAQjA2hhoRvjk5ZMq5js84wUgK46impy3Iut9eOkC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" preserveAspectRatio="none" id="img6"></image>`,
      };
    },
  });
