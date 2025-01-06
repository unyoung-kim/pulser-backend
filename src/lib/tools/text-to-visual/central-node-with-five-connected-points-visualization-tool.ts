import { tool } from "ai";
import { z } from "zod";

export const centralNodeWithFiveConnectedPointsVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Central Node with Five Connected Points Visualization' designed to illustrate a central concept with five supporting elements. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for additional context.  
    2. A central circular node in the middle, symbolizing the core idea or concept.  
    3. Five connected points branching outward from the central node, each represented by a marker-style shape containing:  
      - An icon representing the supporting element or feature.  
      - A corresponding text block positioned nearby, including:  
        - A title summarizing the point.  
        - A description of upto three lines providing additional details.  

    This template is ideal for presenting concepts, features, or components connected to a central idea in a clear and visually engaging manner.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title of the central node with five connected points diagram."
        ),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Node 1
      title_1: z.string().describe("The title for the first spoke."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first spoke."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first spoke."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first spoke."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first spoke."),

      // Node 2
      title_2: z.string().describe("The title for the second spoke."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second spoke."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second spoke."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second spoke."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second spoke."),

      // Node 3
      title_3: z.string().describe("The title for the third spoke."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third spoke."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third spoke."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third spoke."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third spoke."),

      // Node 4
      title_4: z.string().describe("The title for the fourth spoke."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the fourth spoke."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth spoke."),
      title_4_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the fourth spoke."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth spoke."),

      // Node 5
      title_5: z.string().describe("The title for the fifth spoke."),
      title_5_desc_line_1: z
        .string()
        .describe("The first line of description for the fifth spoke."),
      title_5_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fifth spoke."),
      title_5_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the fifth spoke."),
      icon_5: z
        .string()
        .describe("The name of the Lucide icon for the fifth spoke."),
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
        ...input,
        template_name: "central-node-with-five-connected-points-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGzUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////w+X5j0AAACRdFJOUwAtVQj2/xHPzA4HDXdmuwJ8531+IyIxlokkSEYP+vV2Ukvg43BlbwGB70DfEATyMjY9GzDs1gkuiJlE19PpP48+ZFe6IPtdlfg6w41sswMKBUeF0jMp8KwU3M0L9wbB5W1enjR1/lQqTv3dDMLkLB1/Ne7myyjbeoaiL5qkrqW5YXFpFr5fr+s5FSa0vB/aEuFEV6Y2AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAC7klEQVRYR+WX6VsSURSHj+JvHBUQEjQtl8wyEtMMSwK1BQwrLUvJUtIWy/aifbW9LFP/5J47A8zcOxvwyZ7eLzNzz5mXO2e4c2aIthoVlQ5UiGfwuKrgQJVLPIdDAqplG6oBSTyHQ3JIcIqrCTWSJLmoVhKpK1YgA3CTR7x6eE0F9T4/n+Yk0OPfVk8+fsj5Enh85EdDIFig0ThFDglo1LIDDfATEOATnAT6eAAgICgmNHnN2a7Em1t27MynB80FrIhmqEVsBdra7QUdHnN2qUXs3A102Qps2APspe59CNUqhyUL9reiJ0zUewB9yrGFoMMTpH7PQRrQTf8QizZHAAwG6HAbjtgJZFTSEKJ0VFdANxGFY4i3DCMyMgp/r52gyXuMjnu7qE93C08Q9Z7EcIIScSSBMTXdQmDBKaTGiajmNHAmN1SS4Gzud5sjmJjMjVkI2GKSpHN0PreIlPSpJC6wbTiGi3X5dAuB+k/UijhNRDNpXKqnfCFKF8xexpU5ltCEeVYIe4HxEjJXsTDA4ovANV26hcDIdbTdYNupJB8vVnATS7fY9nZaeWJpFClYvgMf287eRawsQQ8W7hFR5j4ePCxHULcEVD9SCyHELQSLQwUeE9ETVGXxtL+dFaI4ge6RliWiMTx7/gLzSiGKE7yMFhglold4/eYtgHfdxQoE3mMeQOoD6+tlCeJAcuVj2CxuIZiZ1jP5aeXzFy6uoQpGtF6ltja+L3Az4ltbcEQRCEj0NatHnbsmEDAT2GAqMNTABtMaCIIQdwECIU3wLfvdRJBhrcOWH5lcqgdeRZDCT52AVrlbaMJqPnN2+heNI0W/EVnTNZCSWItggv6si5MshfUEkWtZ10P1RNGp7nQiKsZyLNu+91ZCVndYsy2H/1ewUfjLuDGo7gzCXRjcEPMNbIq3mmdTzDcApMUVpJEGxHwD/OISYIvHiX9dMCDLQFz81tOIA7KsvKpYEBTvmhk2M6Q58UPXDOVlawvxF89gqYfYGSmAAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFKUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2ZxLZ0AAABudFJOUwAWzffLcAjT/9IcC0/XBxAM9s7HyFDB9Yr4bQ8CJn7A6/7qv30krv2sI2OkUx8F9F+oeWowl9n5XiUJmZgir44zqaqa4iwhfyixlu+7sBfm+zTYj7oteOP8IKdruEvwthlz6WUKHWRHt5LKMZGT15JfXAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAvdJREFUWEfll2lTGkEQhhtReCVIQozggqLrEVQulcssJEAiRtDE23hENOaOyf//mlr2mh33AKu0KpW3it3u6e6nmJ7ZZSD6l+QZGPDId+/gkI+P9SKPH/DLBADDAT7qLo8ffn+X8Cg4guEQH3eTXO/pXojo8QiG+AQXqaUaIYhBPsNZWqFmPEGYT3HWUwCjsjEKYICP9qBnACAb8r1L6l8agB/vWU6AsUhU/mpuklMVKxoZY+vH+UwbGQAA40b9GIRYnOHZiJ1CPCYgqEciiDF5tjL3IIaIHgkjrgS0j7XMgDii5ogdQN44ytKbAWwiX2OS0cA7A7TrPQIc9SAAR9YdAVaL1xfAavH6BGhXK4tJ4U3z0P8IcF68HgDOi8dUmKpuQa3KtJSJidtVPQMmE1PTojgzOzd/BwDR/HNRm2FyYbF/wFIYQiqdyWYz6ZSA3HK/gDlgRT+TBFaAVc3R8hjDArCEZJ6oUCyVy6VigSifxFo/gBdh5EmqqE0QqxLlkXvJAbQO3RbRK6yQFIG3Vvf56jUvZiVq4HXvgElRCNAbrDeV9OY6qhQQkhtmgIPeIkUF0dukzVZO9ptesUAppo9ugCmkqY0abW6pmTUUKY1tPYH/zmYRTSNDJdSphXfvuwV1lCiDnV4BEyKyVIaPclDqyYcyZbHLAHTTSjpAl8QBovLPu4Nm1Cno2sO+aQpuB4xZtYm6DtCmNA513+2IM6cto6ojobuMx0aG8yGL5pNCgCr6Rjr6gAoFhJNTA0BBp2Me0YKxlaW9AwEReSufMfVWSqCo24s508NUkegc+Ojyh2EQF4azrDzO7f1yeb9dIDpPih1cOhKuxKjEuKtAw3ihNCB+al47Ez6jxXhfvq7l2FcaOk1yIbTwzXC+R1u00UhqXT05+4FrF4IUFa8MT5nPxur2zu7uzuHxKYUuVcJPtojVBX6xrqmjshTCDTrmYUNVJFg3gSrrqoSbgh2A2UWMzDmhS3nMZgp8qSIuKfR7q/PHtokPqb9IYGnRWFeZrAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKFUExURf///////////////////////////////////////wAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+QNh+8AAADXdFJOU0fu/68H0L/A73kAUbpAErKafG+kAzTGzMg7LPyPBOy38w5jbhoMCRUBMy7WW4ToUKw/AvJDp3VPoxPeXrQG5LkL+elyvv6oKDKUvKot0a0nLzhBSVL9ZNR7DTm7sB6xVk5FPCsYs5LKVZm1fSYgNorjve0I4GXdlm31wsTroDHq50tzWJ1wSveY8CrmWhmOiU3ZkToF5SR2NXdrjZNc9h8iIxcbYYN/2114oXT7U9Uc0sWbas4RMAoPX2AW18di9ETDFGaM+IiX2nGGKaZnth3ch88QomiVCen2FAAAAAlwSFlzAAAOwwAADsMBx2+oZAAABDhJREFUWEftl+tbFGUYxtc7QPZWDgooQuCSikMgC2ylIQsssiJBHtCVNsAQVKw0UbCCcAUjCRXUAkMzKqzsIJZKiYeCsNJOdu7v6XpnZk8Dy67Yh64u7w87+5x+O/PO8z4zq9NNw13oviDdNASHTFXTQ6HXIZhT1wzM1CFE670DhSFEBoRHzCAjZ5Gzo6LlQMycuf4UO88DEBd/PxMSY8n5hiQZ8IB2sSbQAg8AFyaQ4YvI5MXKqUlxKf70oOQJmKpkQGra1LVEAO5OITqkR01dM/+VNbgH+N8DjHNiYzOCtF63/AJCRLdmar1uTQIQm5VZJjz0MB7RxtzyDVhqWPYoOQ/ZXI4cM2nMzcvX5kwGWGoBClYUWrGSRUDikpVi301A8AVYZUHxYwAMJaWk/nEAJn0uVmvT3ADzmrXrytZvMCao/hRbfKm0sfwJu2I+WVFZxRJscpYVPVW9uSamdosbsFWdDqvNaso21InxbN7+9DMZz+4QnmoYdqrBTIOSbXvOBdgF1O/OydiDrQ1KzqJG7CUzn1cSX0imVI8X1frNTWiuzHvJipYqFyBrH0Id5Nr9yEuWkxpaYWSbBeUH2l5ut6AwiMF4Rak/2IFXsyi1ozPFYxGjS7D/EHnoMArltT6CuewKRbf8mCmtx1Eew3G53mjBaxKlYhhe97oLPRHoPUHuqMcb7DuZ0YJTfBMR6kn32ToWR6ej7vRbdqkJuyiuub9MRDxuY0MFGt8m3yl+dyAewOEzbESfCmAO3uP7NgDFXHCK5AewHJQDnn2Q34yzXeLLCSR+uCaL+eiX21noI/Gz9rKPESWbn+DcoBLwaqSkOpwXT7ZP8Zkwg1ovOOups84Wh0FcFIdLVluaGvDuxPBgDH0ubvkXsnnZ2RQkh+XPnisLSV61Wfc6/ZpWvnYdX8YV+dFX8ZBPZyIAzyid40d6d4EWwDaMXJ9cjajzyB8HGEWFhzWRavC1h3UPMAlg7IZeGeZdDodDfvHaUtsjOwIDrEoE0E7yG7GDCiQGLbOid1SEAgM0o7DbhDLG4NuhoaGL5Hfoz4ZpIGBAC67xJi5x0DmJs1Ej5eFKwIBbWM/q8w4OIkPxt2CM2+SpGBhAjxGjOA6i0m63S3cOiI6E7XsZIFTpB5C7c1iW2P6uPjhpww8CcM5kMkWOB0hKyfAsVOqGnLt0z5gLUPUjt1uspb7X4CfX3jbqukpaOmWVJ7kAZzsucx9+9g3oVko6U69S57wcWSqgF+uib2MjN4jrFzqOY+YLODJuDcS89LJUwGnYDBj5hbVWW3p6+m0xlq0jKBCTMTBAw80OpIaRXNEE4FeJWb814XeHCAUGIM1iPIvhPjAwIE/nnj8UR6AAn/rPA/pwy/VAnFhpyPF2eAN66vHnaNgkWt6Kv7wqNACO9rua1IfmO9/EVGkALPp7t/Y/uqc23dDU8x9jPLWF+rwfKAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKLUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////12ZMS4AAADZdFJOUwAjtPf//txlEOTu3+L9bKcEPY5T4Y9QDg+o48sNcvsyWkhCYL8SRLcZM7onN3Pmxqz1UZuhonwMWLOwaz4/AQI20e+USrH886N2auv2hjjx508X+pjwkalWBYucmX4m5WQ8u1efFPQtQ5bBya1tEc5iiWghw9TpXZeBRip7yAaVOUvKTmZM1c/CxwhUQN3tf5JNAwfYaduEY4o7QdArG4I6Wwv5KHTSqrzXnRi1NR3sHMVxWUmAq4N5zR4lh5pS2n2uGoWyjSIxiBOeuIzZ8i8s6l6gLuiQFrkkfe02AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEUklEQVRYR92X+1dUVRTHt/a9IwqjE0ymDiG+Ih5KFpKYDA9zJgVnEhyihyGQpIWh8ipF1EGy1ImSyBTBZCqlFLUSlN6WpL3t/ee0zrn3zsw584JZ/tR3Ldae2Xt/P5x7zrnn3iFimjT5DsQgxTCF2yluKqbFx6AEI1TCdMwwqagJ6k6jgcdEJMmlccqs8HAXZsqVsLqbiGZpf0Tx4EEDzJ4TQZZk3npPylxKVebRfGVBMGBhSgTNWcRb7027j9IzMmlSRlYwIAbdPsDi9Ni0RAfELg2QfX9sWnrb5uD/DHjgwZxly3IfktO6ogKWq2uVJ+d1RQWswMMrV+ZPVZKJrAVyMTKgsKh41SOrbXY2+kdhWLO2pHSdVW6KAHA4wY7Jx9azL2UZClBux4YgQlhAlgu5ZRWPVz6hfc988ilH5hI8LRPCAZJLsFHMMD1ThU1SKhygGjViQlUtnpUy4QCb62zP8Q/WLVuff6F+24tqugHbxb6wANqBnSw0Nqn7wMWHblJK5KUMC2hGOpu6FjS0NpZVv1SOl1m2CbukvjCA3W3YQ0TtzdirPnD2TVP2833p3iTu6tCAWhuMHUR0ABn6snXiFStRuwU4qK8sV2hAA9YVsvgq+NHN9RrmEtGhw24cCWwNDfCAz5W19HX/vunCAR7fwJv+xnAAA46y0I23/LkerOGxAuzifAoNeBvq1Nmd/lU7hnd4rAC/O3SFBlhw/ASLNej15U6ij4j6T3nwbmBrEIBfdJINSiURncYefcpb4SaiATNQL9xPEqB/tbd4h4novffxAREVZONMx9nBDz+ijlJbNRFtx7nz4v0oAoY8uFCKY+yjG/lEdNHDN/LgCkVZy7IWMEygBMCQBzPaG73OSxlJ1IXFrPAxvJ/E1QAJ6tqV2gdEvwBgfhMl17H/ua0YnxLRAqN3PdFlJHar7cMYEf2BANVPV3A1s9NYDpS3aX6H07hba5+JYcEeCBhV/fTZ54voqAvFZ5z4QvW7cEXrLnQhVbD7AF8OFn4V8KbXg5Y+agU0/9dE1vzZTVOyitEVaGbSAETfoN7/pph/to+oLcB/rUE9V/ihIEgHzIdBml/t+l34log2wN1avbB5utjCpAO+Q61YOK37cb2ydrkBF8WyTxpg1FYlHBNEeZo/x8vHniZW/dIAp4LWN25Mu/7vR47fuLHzkFT2SQWYqmyjckWfvyhigJtbLaEe3w4XUubJySDFgzYXAfhBLjD/ZCVBfgwEKUGhNPzYW4KfpILDhct0FdektKxdys9U/ssA/SoTHC500W9L7d00fCuCLgC/Uzb+KKA/RcJ55u/7C21EeXURZC9KJRozM4I4hlXYSH0tqJDfBkJLJQhjmHViAv6QBDb+cftDEfbdmog/iDD0dwquT8QfQEjszM05aIRTfhOJKh+ByTPyj1yPLpXQC3PPln65Nj4xwsC/2Cvnx68xM+w4qf46jE2Nl7znbsrJqPoP5lJGJEL7PCQAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img4"></image>`,
        fallback_icon_5: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJJUExURf///wAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2hR5AgAAADDdFJOU/8ADvZfumQakyoZ/PgQESmSG9n9rjUBRLytRjTf9+j5SkvezhIXiPHhexZ54IkYzdpFA2mgFZz6N+f7r7Ay8sAlvzF6C92mBEOn1g19zweZYECD9S0sgjpBOZ2ytF58hGV2jWqhjgJn17mLu0KGCO+FD/7w1JoFxtXuSdMkqwx4HEi+pNLLICYhsYzYou1yXU0K5ZZsVSil28c4Iy/zbx2UCcnCTvR3BqriyMTcFDDBUFiAJ+RbrLbrcDvKWROR6lSzkOx7/uQAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASOSURBVFhHzZaLX1NlGMd/P8eYsgHGGYNN2ECZA9MJGyjMNHLggHERSUoySC1MSchRKRZeKLrZzazsRkYmdrGLlWml3f6yPu+5bGdnh8+g6FO/z2c7z/O8z/t9z3n2vs8Z8D8Q/4GWCqD/JMML0NIB/r6WBvDfy3hbi9G/DVhmEeOWZcZ4SlkAOcoz5hjjKWUBWJFL5sJqjKc0D8C2fIW45Nkd+WSBw54nvMKVdxjz5gPYiiA5i10lpXAL14lSj2uVU0JRJsEUYCtCWTngBXwVwq/0yY5ltQnBDGArwpoq/9oAqmv8SmTdnesR2BCs2ohaI8EMsBKrq0jm14VSsVBJAcmqMizXZ+r7gSaSKySLurJRwXJJFFefbQagE2u1GeF6q7U+LP8IJDfAKS4mgHQVI5Avrg2bNit5mzc1CL8ggGJjrinA5UUJycYmRLaEPZ7wXRE0NZIsgddlzNXfSBJUh+oQuXUb7m5WAs33YNt2MlSNurSJxhqoY3mliJItrdgRY1t7R0d7G2M70NpCRlGqlcMASCmeY7XD5yc70dUd6lHyekLdXegk/T7YrTvTzmYGwAI4nJVkzIte7kJf9N7d0T70sxdNMbLC7QAs+vwMAJArtgzvQy39DqlX2PdLDj9rsUfY+bnG/AyAcg1jgDl4QHH24kEOIJyeoXnzADrRz0EMKc4QBrlLFEGfoXkZgIfkR9iH/TyAeiX4MMJ8BPuEafoIw6pEQBRxy8EOpfpARyNdUUnzHj1oXkRNIhDPOWTXx+yH3XoX9hHlZ9SFJFXarT1WjciRUcUePRIBxuSuQrL78Qiq2zJWVkfV4hztSaBrqxZjxTieUPez0PY1SDx5NJUtW0lDlaPmKS3kqpHgjmueUCxanrFw0lB0TO7HsuJuSFHj+Ss8Nj8gmaSo+TgmThhiSS0AUDmGp5+RrXW65qgpK8A1KGHypGyWePv1I4qyAeJO2E/Jjx/ql3Ao8xayAE4fx8QZ2cqbAp6V92i6sgBGn8P088Ko9KIPEy+kRjRlAfDFMvheGnp5GhgJunFWPl9pygZgwyvykXj1tWG2bMRITD8mlBVA2l7vPPXGOWGdfhPn08cWBNBpVR/eMoQWB+DbiYgnPbJIADsx9k5awAAIhbIAXBfwrnjnJyWyxSwVIFyltemT9Bp9D1PKMXfJ7U+ZIXz5y24XrpBj6n3DVJInPyD91egRtqcoeZzFrLQaiMaWgENtWikFu1obyA9n8BEvTqo9UFcDrScrofjHGCvUTT7hIWc/waVu8lPJfv4yZuauyNN0Cycl+67PINZTtcc+XkgGP5ffEHMAJi9mTNO6siQpQ7Nf4Eu1Kcu4q1+RX1/GHDkLyfD/ILWuXsH1uCC3goJG8tw0vrlCfitJ17gTV425+iKmtDuA70QnOzvxPWn7AQMuXvcB49Der2kyAfBMJHGddP2I2ipyP3DpRgJ7b+LmT8ZEITMAD8DxM9nixS+36pGYAcrDHL5tvstMAfwVvxXfbpdrVH4r//drQWNCSuaA0B9ibuDa4OSf6YcoU+YAjh729t3Q76h59RekWrVyVfadjAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img5"></image>`,
      };
    },
  });
