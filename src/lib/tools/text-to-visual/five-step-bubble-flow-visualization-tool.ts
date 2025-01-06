import { tool } from "ai";
import { z } from "zod";

export const fiveStepBubbleFlowVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Five-Step Bubble Flow Visualization' designed to visually depict a sequential process or workflow divided into five stages. The layout includes:  
      1. A main header at the top for the overall title, with a sub-header below for additional context.  
      2. Five bubble-shaped stages connected by curved arrows to indicate progression. Each stage consists of:  
        - A large bubble-shaped circle containing an icon to represent the step.  
        - A smaller circular node at the bottom of the bubble containing the step number ("01" to "05").  
      3. Descriptive text of upto two lines positioned above or below each bubble to provide additional details about the step.  

      This template is ideal for illustrating linear workflows, processes, or strategies that progress through five distinct stages, with visual emphasis on the bubble shapes and their order in the sequence.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the five-step bubble flow diagram."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Step 1
      desc_1_line_1: z
        .string()
        .describe("The first line of description for the first step."),
      desc_1_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first step."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first step."),

      // Step 2
      desc_2_line_1: z
        .string()
        .describe("The first line of description for the second step."),
      desc_2_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second step."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second step."),

      // Step 3
      desc_3_line_1: z
        .string()
        .describe("The first line of description for the third step."),
      desc_3_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third step."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third step."),

      // Step 4
      desc_4_line_1: z
        .string()
        .describe("The first line of description for the fourth step."),
      desc_4_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth step."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth step."),

      // Step 5
      desc_5_line_1: z
        .string()
        .describe("The first line of description for the fifth step."),
      desc_5_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fifth step."),
      icon_5: z
        .string()
        .describe("The name of the Lucide icon for the fifth step."),
    }),
    execute: async (input) => {
      return {
        desc_1_line_2: "",
        desc_2_line_2: "",
        desc_3_line_2: "",
        desc_4_line_2: "",
        desc_5_line_2: "",
        ...input,
        template_name: "five-step-bubble-flow-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALHUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4augDUAAADtdFJOUwAKRHunxeHy9fbl0LGDUxRdtff//cl2GInv3p9ySDAdFxwnY5TL/PutNgRpvtOqPIL02nkmFWK8/rAkBbdoQr8BGVB4mqmghV4uKpwDc/kiSSjW6qNHKcHNccPKDI4JQd2Ld2xvgZ7I+OBrCGDw4+ePEU4jZhqb1zvCinoN5mekqA4QNX99zyUGMQ+R27vpIEWIhOu5QJKmG1TS7iwLk0YS5N+9T7QC7UoymfFLWbp+kLO2gAfcV0MvlpgfanDUpaEWq3XY1VXRl8f6NxPzPXzsK7LOrrgtnYZbjUxaOqJhbR7GX4duNFbMIT7ZZIabzPIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAZ0SURBVFhHnZf5Q1RVHMXPgDWAojHnqYmKQOCCWIFaLygdKERtGBFEBiEkcxmcwMKxAjdAwVwANRQ0FSMbtc0slyI1ss0ot0xpIy1bbPkj6s4McN9j0fr89N4593tm7n333ncf0BWDj2+f2243+vkH9O0X2H+A3r4JhjuCTJRRBg4arG/UM4PvHEIyeOiw4SEjQsPCfe6KiBxJjho9RmoTNTZ63N33SEInhntjyNjxEzTixPvuV8kH4trv4x8U/0t9SNPIw6RgcrKPGUBC4sOPJAWNnpI8dZq4nf7oKJrGWzytUmjyTUyidYa+3JKsMDYVwMzkNLVzCNJnZViA2UFkZoK7nY1ZgHkOs/u46ajPCaL6WC4w935Rljf68XlPzF+wcJGdZP5iB/BkAQtDRMMlFP1/qv0H2uufzqaxCFgaRKqTncs6ch0ZzxjJ/EQg7lkWPAegmCWAI41Jy914263I5sppwCp/jlw9u6Pa66Wkk6VlKI+mcQ2wlmppRSWHaOaH5UEGrMPzs8js9bLuZcNGhZvCkVvF6ppU0SnSuFnTYgtj1iOnisrWKI3ewdwlfGENciIZa2fttu11FfUa20dVE/F8FU07NLJM2E6+uAv11WStQ+9hdz73ALNoatA7Ensr+dJgpKr00TvAVsYa4KTaX29oCG3kyxYsZF/vhOokwY/7MMOfgXpDx3oTUzCggFP1RgmLgVeY3cP4dZBqp7Eeyxnr0uqO/TyAbVQOauUupNo5iq9iw2t8XWu8ISLf5CytKhM/zLYy85Cdtf1pD8Nb7Ke1D9MX4VR3aVWJqLc9s77WYbbxHRykfYNsH4nhdAQyU1wPWBBdNb5MdgVjacq653FyG7CKeWYc5THZPs5gYBxXAQgPED+0STvJgGj6AkjiRqDcynfxHptkex7rEKryfQDZ3HTiZABfkW0Ap7gPQAXrAGQyC2+wr2x/wCwU0d7U1NRM6wgghOqHsg+cZqkZjkpWAFjAJMykNV6ys1mEj7ybw8dCKKDugWaRxY99IuYA8Ck/Q7xCeTvLZwjO8POSkpI9bIkDvuDILyXb/fwFBRniJoRngQCek3w/1qCO58VlMQsfPnSBiyTXXV970TfipKdfI8gopGmmkp3L8BXni8uaPE9PRGfbEfXS+t1LbsAlysvOj/W4m4Pc1ytS+n19YouccMDOy/L6TyAdOMUiSbrAK2jlVkn5pjNBX48JbAEaeVySPuNc3KtdCe6EqBGGrvXIYCNcVl6UpCA+hG8ZKSnuhKACthzuUo/5vIwwqvJ0/44R2EXrbklyJ7jR1yOJW/A982XpB9pgruZwWcMBWr/NbStkskYFLNXMQCBHy1oYlQ/xI4fKGiL4DICrrNSoYuXF7MZAXtOIO3kVDTSukLVHxesLiUyTRffC+RFhCtdpxEMshqXROxO8OLmkBruL2SyLwE8t3IZB2sUI1CjqTJxgtbzNGI7Sf046/adLGoCF/BmWYM+0lfiKrXA0crusLbWRDNC9Q8Yo3IxjjCnXymjjqJko4shJsuhqu56he4aGj3ka8bHu4dFymG8CfbhEv5dpMa9m+jKksGCi3sEEO6+iLJbjntY7MslUMhDn12UEBL40hmNCOi/1ciD8hbyGI5Hkr3pH7PxzmFaO3/Yzr7vjhSCnjlwr5odCdbHeFOfL25lpwMVCmrK6fUM+l0blmuiF+vuZ7hOmGRldhtAqslK7KgQ/tSqsboB5KzkP5qbuE9oKOK4GriwjecMpD6Zr0mormZSAI63kO+JptHafMCad6YnAsiY7aS0OPHbwj4mDZzecLH2B5G3HgbhIqvNEw702dp/w/iWyORSoX7vJuxt4ONv8JxA1LIbq76LZXhuHnO4+wbBdobGiHDBfmd/n0msqaToa9M1mA2A59qyIanV56n/raRzw504y5swYcb4GXDneF1jY+Txy/+KxKltdon4NehxJuKaKv1/46tVdue5784yiX2wKOWTLl4BTZbOnvpcEuFL7uT9Y1PS/Tp1aaXWPwsBfPZuoU6W3vrcEIGdHxA1PJakEl45d2uE4VX7dfsLqLUH8kbC2hn2vn7uoW9FOMQ7ea3MPc7J39Al/6/ybo0touaLzb46c4Lrc2+mwJ+SEuVypc28FKeEPWvXurdCZ8D3z9OYt0Z6Qe4Nv6b1bw6myymdpkY0XOr/v/hvXPVP1gvgO/H9Mn1LoH/vdv9+y/wBuwtYlw/cVjQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIEUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////809/VsAAACsdFJOUwATzwfC/5b0lVf+Vhvtkhqu1AhJ/TcC0ppZFwHQiT75GT2ip6HxRkvrBBgDFI+kfuWE8sXOYgrDd8Eqk2QO2hAv9Q9Q8DFS00NNvSkhu4tus9ZfUaMS+uiCniX8HwxCQC4jjsbElDCsegmRitlUBUh4q5eGebrYkCjz6pu8+CI4cN3etKil5hUGaTxOh6b7MsuAge/farccf2URmGFHIMe5NDvbfVXMHgvVJOFMFqNLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEEklEQVRYR82XaVfTWhSGd1tfK/WiiBjEgkWsIJbJCk5QlVJEECfQaIXivTgjTtcKjoCK84DzAIqi4vgn9SStSTYNiazlWj5fcs67dx7gJDkJRJPicDodPPsdXNOAaS6e/gbT4XZjBk/tkwZPWpoHM3lul3/SMYtoFtJn84pNMjAnkyhzDjJ4xR5zkTVPHOdlYS6v2UHKxnx1NB/ZEq/aIAfuBepogRs5vGqNNxd5yXEenF5j1QYL4ctPjvN9WGSs2qAAi7XJYvj1NTtkLkGhNivEkkx91QZFWFosVmLZMvHXFy9FEe/QEXCUMCQqRRmRq7wCqCh3EZWhlCTe5Qgop0vLg+CsoEpU0cpV6mzVSqpCJa3gXQguF/fHah4DWOPyYS1VI1gTCtUEUU1r4XOt4V0AVhPROpSvDzG8G1AbCPtQJ37FOvjCgVps8PKu9eVYR0QR1PNFIdqIBtqECnVSgU3UgI28h6gekYSgsWkzNW9Jo0DZVrW0DdupETvUyQ400nZsM5yroAlmoIVasZN2ybvV0h5EaS/a2sW4vQ17KYo97GyDINYhkXdfmOjf/9RSJ0qJ9uOAg8hxAPuJStHJT9cLJnBQPEmH3IgcPhyB+5B4ng7yHk3g38o4crQLx8RW0i0uVbfYVo6h6+gR3udPCCZyPA/V4kecOHnq1MkTYlSNvOO8C0gITv/POBOLiztZTxnisTO877T5GtTgrDE4ixpjIJhkEVvRYwx60GoMBOYCVyV84mn+RbEPlRNfceaCXgDn9ME5AL36QMFUUOTBeeNGnIPz8EzYU8wEsy8gehFd+qgLF6O4wF9xJgLpEnpiVcjWZ9moivXgEnu/mAjiuFxPffCUaFGJB31UfxlxfZ+ZoF/GABFd0S9CDq4Q0QDkfn1nakH4Kq6JjbgXg1o4qFwC7zVcDet7Uwqu48ZNcexA5FYyuxVBhzjevIHr+t6UgiBuK8c7wN1kdhe4owxuI6h1mgiiyueE614bcD+Z3Qfa7okbMQNRfW9KQT8e5NNQA/AQtSE1CtXiIdAwRPkPYFjFlALKxaPHMp60SE/hjyv48VRqeQL58SPkGlpTC56JjeL5C6KX2r7xkujFczF4ZmhNLQi7EXwlLuTwiAzn4KAT8sgucRFfBeE2XEUTAb0uUHZzojeQR4lGZbxR5+0Frw2NZoJfvMW7sbGxsXd4yysJLATvtTV4z2sqFoLmD+kJPjTzmoqFwJo/LRjt/qgOPnaP8pqKhWAcn9TBJ4zzmoqFYKYQjIwIgcl/DDYEYSA8ZUEhmmgYGKYm/TenHguBt+6zKvhcZ/KpbSEQfMnK+sIzDRsCGje5AAp2BJPy9wiGeMEuQ4rgKzq/9U2Jb534mtxEp4qyyQ589/DcHp7vP9/CPwB5mxP7Sg2UtAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKFUExURf///////////////////////////////////////wAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+QNh+8AAADXdFJOU0fu/68H0L/A73kAUbpAErKafG+kAzTGzMg7LPyPBOy38w5jbhoMCRUBMy7WW4ToUKw/AvJDp3VPoxPeXrQG5LkL+elyvv6oKDKUvKot0a0nLzhBSVL9ZNR7DTm7sB6xVk5FPCsYs5LKVZm1fSYgNorjve0I4GXdlm31wsTroDHq50tzWJ1wSveY8CrmWhmOiU3ZkToF5SR2NXdrjZNc9h8iIxcbYYN/2114oXT7U9Uc0sWbas4RMAoPX2AW18di9ETDFGaM+IiX2nGGKaZnth3ch88QomiVCen2FAAAAAlwSFlzAAAOwwAADsMBx2+oZAAABDhJREFUWEftl+tbFGUYxtc7QPZWDgooQuCSikMgC2ylIQsssiJBHtCVNsAQVKw0UbCCcAUjCRXUAkMzKqzsIJZKiYeCsNJOdu7v6XpnZk8Dy67Yh64u7w87+5x+O/PO8z4zq9NNw13oviDdNASHTFXTQ6HXIZhT1wzM1CFE670DhSFEBoRHzCAjZ5Gzo6LlQMycuf4UO88DEBd/PxMSY8n5hiQZ8IB2sSbQAg8AFyaQ4YvI5MXKqUlxKf70oOQJmKpkQGra1LVEAO5OITqkR01dM/+VNbgH+N8DjHNiYzOCtF63/AJCRLdmar1uTQIQm5VZJjz0MB7RxtzyDVhqWPYoOQ/ZXI4cM2nMzcvX5kwGWGoBClYUWrGSRUDikpVi301A8AVYZUHxYwAMJaWk/nEAJn0uVmvT3ADzmrXrytZvMCao/hRbfKm0sfwJu2I+WVFZxRJscpYVPVW9uSamdosbsFWdDqvNaso21InxbN7+9DMZz+4QnmoYdqrBTIOSbXvOBdgF1O/OydiDrQ1KzqJG7CUzn1cSX0imVI8X1frNTWiuzHvJipYqFyBrH0Id5Nr9yEuWkxpaYWSbBeUH2l5ut6AwiMF4Rak/2IFXsyi1ozPFYxGjS7D/EHnoMArltT6CuewKRbf8mCmtx1Eew3G53mjBaxKlYhhe97oLPRHoPUHuqMcb7DuZ0YJTfBMR6kn32ToWR6ej7vRbdqkJuyiuub9MRDxuY0MFGt8m3yl+dyAewOEzbESfCmAO3uP7NgDFXHCK5AewHJQDnn2Q34yzXeLLCSR+uCaL+eiX21noI/Gz9rKPESWbn+DcoBLwaqSkOpwXT7ZP8Zkwg1ovOOups84Wh0FcFIdLVluaGvDuxPBgDH0ubvkXsnnZ2RQkh+XPnisLSV61Wfc6/ZpWvnYdX8YV+dFX8ZBPZyIAzyid40d6d4EWwDaMXJ9cjajzyB8HGEWFhzWRavC1h3UPMAlg7IZeGeZdDodDfvHaUtsjOwIDrEoE0E7yG7GDCiQGLbOid1SEAgM0o7DbhDLG4NuhoaGL5Hfoz4ZpIGBAC67xJi5x0DmJs1Ej5eFKwIBbWM/q8w4OIkPxt2CM2+SpGBhAjxGjOA6i0m63S3cOiI6E7XsZIFTpB5C7c1iW2P6uPjhpww8CcM5kMkWOB0hKyfAsVOqGnLt0z5gLUPUjt1uspb7X4CfX3jbqukpaOmWVJ7kAZzsucx9+9g3oVko6U69S57wcWSqgF+uib2MjN4jrFzqOY+YLODJuDcS89LJUwGnYDBj5hbVWW3p6+m0xlq0jKBCTMTBAw80OpIaRXNEE4FeJWb814XeHCAUGIM1iPIvhPjAwIE/nnj8UR6AAn/rPA/pwy/VAnFhpyPF2eAN66vHnaNgkWt6Kv7wqNACO9rua1IfmO9/EVGkALPp7t/Y/uqc23dDU8x9jPLWF+rwfKAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF9UExURQAAAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////D9UBoAAAB/dFJOUwAHTpXJ6/wRg+z/hFrNej8XAxY+BJm9OTgFrvViE2225fvkFDUJhgoj1P61WyAh5tU2vAxrbL6FN857lMhq6n5/GPoZIuNBXLO3fNL0Es/XDg3WgjrEAdO/CBBk9zu4XQbR9lnw7Zi04sNAfU0bJd4w6MYLqF6WAnCXx2MkbxowiAApAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADT0lEQVRYR+1V6V/aQBR8glEYsSqCB4cKBQuLRVRUqoLW4lVF61Hvq9Tetmq11Z5/e38h9wox1q/Oh2QnOzNJXl52iayjymavFmpqhGq7rYqfs4BahxMqnHW1/PxNcAlA/YOGxqYmd/ODekBw8QpTeLxAS6vG21oAb7teYY52H/wBomBHZ1coFO7seEgU8MNnPcELZ4Si3X6lBP7uRxRxwsvrKsEFf4RicbBEz2OPJ9mTYIjHKOKHxTrUCghQrBepPuVKXwq9MQpAsPYt6tBC0Tj6B0SSHhSPA/2IR2kIDl5bDlVOtNIwUpKfMSkhhWFqhdNKR9lQT0E/y4jjNAOkhAzzB+kJbLy6DOwYoQ4kxGGaiQFSQicGaQSjvLoMxtBMCfQQUYSxLJBlTKxmDxLUgDFeXQY5NFIYSXE4niWAshPiOIkwPUWOV5dBDTwUgtJ1gDxoR4g8COmElVAxYNJigIBnFEZeZmpAHlPUCEEnrIRqTFMCMzJTA2Ywa7GIdkzQIOZkpgbMIU3PLX1GG+YpuMDk1UAJaGMLBVq01EhVTjRQHZZelBhjpdPyClZpDYKVViYHXq5HN7ApJZSwPIT5LdrEql7HQ1o7iGg7hyzlu7CkrmltKwgnaQe5baPFCDWAXNjdo/wG2P5B7PAwfzDH8CpJmSJe8x4j3HE5gLw42qOoY0FZ0hZWtyjzBm95hxHuODbkAI8Pu9l1KqTfTU1Ovp9NF2h9pwifh7cYIPrdykcTl/UPzdrk2ibgteDX2qa0scyPT7uJ3B8/Ld68sUh+PbYdglRU8eh03LCcXveLHXU8KgWM3ri5qn6l7MqrSAGc+jq0+98y4POGIleeX29UzpUDvpzwftOA9RJkoYjTM3wt6LgIY4D6PjqmaZuPsH+uUQlmAawEVXpcxMWhyhTwAcarenwL4fslf5G3GJmhBldM2WiNj2kWoKnEDZxdSaNbBGg1uPyB0IHsN7UYmYrDCxSPVWZmMTKlBuf7ONL96WYWnpVetPATZ6eyuZyoMpNr8Asnv2WvbrK8xcgU/PmrZ6YWI7v2L+gny1t4pvWBDryoMlP7wHrrGJmK/w1Qa2AmMmfyTfnLVpmuBpVFZkyFmciM3dfgvgbSWSZ3w50D/gEIuIlmEIbjOQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img4"></image>`,
        fallback_icon_5: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKRUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0QSC70AAADbdFJOUwADXKKuSV0JvP+YtoXOSDEwBwzj+hr7/uAce4MuAVKLZCuCjt8l7EeSv0H4mZvIG/3oXs/AgFGwPxK+j2DYF2fy6ZYF4d33HuoCifao0U0KowQLEQ2Kt5+lV7OaBuf5LSjHJjn0tBaTq0UP5L3Zw1jWIGh3sWMOE1rbHVVTqtxmh/wfKcJEf6CmNu3Sp3O18EtlgToZdOYIuBROQztppOWh4lvecY0hxjfMKpBQl/Xr8e59ynlw09qprEC578TLMyMnFc3UeF8QflmyLNc4VnpybfNudoy6GHzFL8h50LwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASzSURBVFhH7Zf5W1RVGMe/Aw7DF2SHuaggwgwq4jIkSqEiOrKPC6CUgDDhzmCC4EppYJlrlKkYVCYaaiVmWbaZZXuRLbb/NT3nLsOdeYg7iU8/+flhOO957/3MOee+53IGuM89wBQUPEbFDIRo7UAIDjIBllB6CQPCh6JACLVgLCMioxSiY4DYaDUIhMgIjkVcfIL/pAInwRoHKVG0xo2fkAQgeWLKpJihEEBqmm140lJFOlEC7QDSJ5PxU4CpJDNM3hCYluk/ay+Z0wDYqQimc8Z4zsQsR9YDs2nWQgDZnDN3eOYwWyfI4YMPORIRxVzM43wtBLCAebop68njAp1gIfMXcTGcS1jgKCzSQgA2FkcMTzFtOkFJaZnVFQtEL2XcsqEQWL7C6j93FeuK5ToBUC4WH0BFsk8IxFQOj3LBkOAuEYJRAlrto8B6L6bw/whWrgqvqqp6ON2/P2DBI8qKJTr9+o0Fq4Ora1bXYk1dvdvtfpRuv7ShoEH+4oK1xetEtJ6pwIaNmzZ784aCRg+bJoazUNoioul8bOu4ZtK6VcvPzBpR0LIcDR5uQytpFnFRMymxbbvVa9ixcyTBLu7eg7UMBXIVAUo2t9mn1qLdan3ce9UIgifIvdH72AbM55M+mfaOOKXRuX8kQROfIunYDDzNpgPPHJxXr2UOZR5WGkfyRxIc5ZRj2c9GAtiulEGwmnB38ZjS0p5C+jZfnpOzz/OgescB8vi0FyaeQMXJWQDmsVRNaIJq3f6U2SmyFae4T7mu+zSXvigaPdxSCaRxjp8gqdWXXUq6N55t7S8FvVziNZTn8BWgqONMua9gOFa+aj8rKeOZMWTYcUZKEiPOWtIkyloT9Bx1uVyuPjTWiL8u16oSMVHJcW5Z+1TxJHSG83wN6L9gdTBCJ9gkf1EGLqpLUFcpiqdBHslJhnl0hk5ekruTPZJOEHtRUAm8Ljcu9gPIYIt85Rt8M93Dy96VHLiiTNFOgzXQBBvZg3TPZO+zeOuqkvcRvL0my4d3LEOCa3wX2CmfAYTBzfeGEZSWFfpwvQJ4n7kf2PKAD/mRfEPveXkdPuYN8wln66Yx8YsMplCfRfITwHRWuini0+pKkpQKxEIH6QQxbvengOkzt8otcYcl6ubnXAvs4xeNotw9nJ6M7qNNtppE8subcmVqAvHO/Aop3koe+FoZxXaxG0rCeUksR7qHi9X/nN/winy/V/BteNV33yNSvLplakyKoJ+DoiYzuM72Q6zTbPXugTBO8BH8Cxua5UMAnMfL1KGJ7Vl++8feTvVZGAjC2FartPJ+Wt+8+8YFXgOcuSQvZ2XK/QaC9bztE4eIN1sQZ/98hvxF7jEQzJUKzUBDaesGJd7PI8lI4ySxnuKIZSjAQqnQfKiLzHSdEKHzFO+ghwV70PKrUqZGAiyU6sqY8tth/i6i8aSj9NZB7v1DyxsKMP9w/kmguytfBNX8s4sdS8g7WtpYgOQS8Vk8ID7DmZpgOyfV/dWpZQMQKMzk7sHBwbpCUaHlslLBTvWwbUTUdVFGV0P8+xOlgI/73RaLRdkJOsRxfywjzH/fJWbxg0P/k+e/E2oBTH3BOXdJcJ+6a+8zOv4BK8mE8uJCI9sAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img5"></image>`,
      };
    },
  });
