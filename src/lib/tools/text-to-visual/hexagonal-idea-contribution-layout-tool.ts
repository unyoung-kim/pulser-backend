import { tool } from "ai";
import { z } from "zod";

export const hexagonalIdeaContributionLayoutTool = () =>
  tool({
    description: `
      This template represents a 'Hexagonal Idea Contribution Layout' designed to illustrate multiple elements contributing to a central idea or concept. The layout includes:  
      1. A main header at the top for the overall title, with a sub-header below for context.  
      2. A central icon representing the core idea or concept.  
      3. Six surrounding hexagonal shapes arranged symmetrically around the central idea, connected by thin lines to emphasize their contribution.  
      4. Each hexagonal element is paired with a text section, which includes:  
         - A title summarizing the element.  
         - One or two optional descriptive lines providing further detail.  

      This layout is ideal for presenting systems, frameworks, or concepts where multiple factors contribute to a central theme or goal.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the hexagonal idea contribution layout."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the layout."
        ),

      // Hexagonal Elements
      icon_1: z
        .string()
        .describe(
          "The name of the Lucide icon for the first hexagonal element."
        ),
      title_1: z
        .string()
        .describe("The title for the first hexagonal element."),
      title_1_desc_line_1: z
        .string()
        .describe(
          "The first description line for the first hexagonal element."
        ),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the first hexagonal element (optional)."
        ),

      icon_2: z
        .string()
        .describe(
          "The name of the Lucide icon for the second hexagonal element."
        ),
      title_2: z
        .string()
        .describe("The title for the second hexagonal element."),
      title_2_desc_line_1: z
        .string()
        .describe(
          "The first description line for the second hexagonal element."
        ),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the second hexagonal element (optional)."
        ),

      icon_3: z
        .string()
        .describe(
          "The name of the Lucide icon for the third hexagonal element."
        ),
      title_3: z
        .string()
        .describe("The title for the third hexagonal element."),
      title_3_desc_line_1: z
        .string()
        .describe(
          "The first description line for the third hexagonal element."
        ),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the third hexagonal element (optional)."
        ),

      icon_4: z
        .string()
        .describe(
          "The name of the Lucide icon for the fourth hexagonal element."
        ),
      title_4: z
        .string()
        .describe("The title for the fourth hexagonal element."),
      title_4_desc_line_1: z
        .string()
        .describe(
          "The first description line for the fourth hexagonal element."
        ),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the fourth hexagonal element (optional)."
        ),

      icon_5: z
        .string()
        .describe(
          "The name of the Lucide icon for the fifth hexagonal element."
        ),
      title_5: z
        .string()
        .describe("The title for the fifth hexagonal element."),
      title_5_desc_line_1: z
        .string()
        .describe(
          "The first description line for the fifth hexagonal element."
        ),
      title_5_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the fifth hexagonal element (optional)."
        ),

      icon_6: z
        .string()
        .describe(
          "The name of the Lucide icon for the sixth hexagonal element."
        ),
      title_6: z
        .string()
        .describe("The title for the sixth hexagonal element."),
      title_6_desc_line_1: z
        .string()
        .describe(
          "The first description line for the sixth hexagonal element."
        ),
      title_6_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the sixth hexagonal element (optional)."
        ),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_2_desc_line_2: "",
        title_3_desc_line_2: "",
        title_4_desc_line_2: "",
        title_5_desc_line_2: "",
        title_6_desc_line_2: "",
        ...input,
        template_name: "hexagonal-idea-contribution-layout",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI3UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2m75XIAAAC9dFJOUwAHk/D/x5I4bPPKFmsZ9HN0+J5SDANKJ+G3IDPLserGOXfD/NHPT0HxtQoUXar+ilH3pAUGZwJLoIbTh/lNFVjyWa8+Ccl19QhactLnMKeJbjcOZbD65ro7U4jWeQ+L1ci/YiUEHlWs3i5DcRjb30Is7i/EE37O9tiPIa0Rb+LsappH+7tEC6JW6AGhgVtAveUbHxBUKSP9Xp+ZnEjMYChMRrwNo23j62l9zY7gRZvBZFd27zpjruQmToV82i4Ul2AAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANySURBVFhH7ZZnVxNREIYn5k0gwUBWjRSxEQuirgZQDCLEgBLFRjT2LlY0lliwYu+9xYIVe+/9x3k2W+8liYvn+EGPz6edmTtPcu9sci7Rf/7zL2HpYoVZbGQDrHYLI+jCr0pDQgDYGYEVGUz8SzJgZWKACU3AdaQRZDqcWXyuY4ceZjkdXY0VVzaQY0wopBS4AaFb9x5K5MmUptNTX6iRSpCblzhpIT+zgIh6FQK93cn6Uwl69UFfd7/+RV4AAwZme5E3iFmnk1wwuBhDSqSHocOGFwMQR8h7SQyeeRWSC0b6UFqmpspHAU7l2ZwgM1uEfbQhWZGTbH4KSQQOYAyTTEsSgROokAbvrxSEyrEuY9m4hapxWocBKazOkeZVE5DXBcYbyuYECWpEBGvrBmICxBpmBU8KgSuAiURZYn3IjQCzC54UAj+CRDQJ+URB+LWyuTFKVKKWiMZgMlEtGrSyeYGAOqIeUzCVqA4+ZglHOsE0YDpRyW8JpC3MgMPrbWS2QOGZs/Ii3tlz3NrBphD4EZwbEefNx4KQ4RDLFmr/2VX2RWyHgmGMASym0BJM0MfoWgosW76ivGnlqtVerFnLdChoYY2I+nUlJc3QX6T1GxDdqC7c5MTmLUyHjB5qr7La3xRD4VDaum37jkjLzl1k2Y28PekE5PI3+HwNfu209mJfNfVslbXCfrLYcCCtgCPUBxV08BAOHzlqaTwmopZyI4d2dehILTiOQgqfwPSTiWj8rCyiUzjdoUOdUjKaqRlFcj8RnTlLB+W8aUEjncM8deEenKCwnOcETGjgPC7QPlzUYgfCZMUlvuMPCrYjg87hshpeSWxhx0mm42oszu9bouVaExFdZw/xBm5Sm1yPx64qyRjfynJLGuMI2XBbrLpDx9RKTBHEEVaejDRda1HW3aV7Edy/1x7KeCDiofIiEYURV5amPgCJvXhUTW2PZZfvifSTj8ofqPWlvyB5inCrmrY+fVYvLHguffTFKPpKBv2alLii2cimXL+S8OKlqlv7qpEKokpavahZ7NZfCIDXb3JD5QVvg3EU91MM/FUxDWXv3qsioRDFH7RdmKf946eoEPmc37zeUyoZCjpt0JENnf8OOrqhnS+ZRNvFdb5iFtnwBQ6+YBrJ0PYVrXzePJ5Saabf+HQn8Hz/8eOph8/+nfwEi8WeWEahmqcAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK+UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9HSApAAAADqdFJOUwALOkJu8v9vX/y9rthRUgXt7v4I6CAkECVmjp+ZfEgJXusDUMnxkRd348r6E7OWZVh7u/BaRuXqvHkb2eRZH6B9CtK+ElT2S8bIhAaQxcCUNUz993QhIgKMqnEoMoaPB81NFh5k6Y0PGlcvwSozngHbI3ibYNXR0EMZ18xErLaVkg5naZdsHO8R09Qsik9WovP43yvcdQQnq4MMf6FiMLS5nKn0+cIm9WpJGGMxuJPDKTne5sTWiYE84aVTp78NsIJB3fvHRX47cjaFrZrgNK8VSuKdqFs4Vc+AXOdoTss3Li0UYbE+HW1H2l3ER6MAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAWDSURBVFhHrZf7XxRlFMYPok8uossOVwEVVpeEVVM3lxRE8RYrarikeAXFC4rEmiZm4l1ZwmAhaBO1wkBRzPul0vKGRmqUkkap3e//RZ/3nZnd2QFlA59f5rxn3/OdmbPnPe+8RE9BPt18O6VuPmJ89x7opHo8w+J7QuPXq1Py06AnEfmjt+qVvFYf+BNpEaD2ey+doKVABKnd3isIgY8HBIeEhISEKj1hfcMjIvv1H+D2PAkQxfMcrXc5Bg6Scm+IeVb2PQkwGLFxcUYESsMhQ4HYYc/1Hj5ipAam5yVvO4BR5vj4+PgXGGC0OIFrTAISx0pPkzROwHjRbAfQT3xMvScgeQImTnJPmjwFfbnhBryYYrFYLFMZYHBqaoAaMA2DktnjRUyf8VIaEc20pod5AiL5fRMZ4GUiNWCWccpsotChfJIQk0E0B3PVgHnzF8D8GMBCZBJlWbBocfaSpcuwnCjHoFmhAqwkn8cCJiCXZXUVH+SZhFeI8rHUe0CWxmAjWm19VUzhGqwleg3DvAeMwToiHxSI8ZSH9USvo5f3gA14g2gSNkqAJYxXiE3eA7TsFWy6dGlhDMdmVulbvAfQOoSxKVt5/LYEbCfKxI7/AdiJXURFdmwpJsqNw5tZRCXYrQK8VVomAmLS0kwc4CgttYuA/phORL7lqCh4G0gIJqpEFfvBDdjJiyyWaIS8Ft4RjVQ2z2lmhUDv7qkAzNV7iWgr9nkC0iIcDsf+94je/6CmpqZmDtHsAw6HwzFYzFs/fMivWbM22Ng1u7aOFaIC0IGK7dYFynE4IvnVawCtwUF+a1GH6uqLuOE9ILCK174om5+YgXYASYePEDVkHi12uyQVCoYk2d4Bf6lRqQAfHROQnubcDNQf3yA7ZQ3DCadonazXnJKcnoBDRpzYV2EMwunqMzgrB8ryOYfzolGCj2WnJyCnIp3okxmfXiiii/hMnuPS7lphLEvAXHzu6vVKwCWbT7ld/mEULlMyKxiXMo6MM8EaRXQFMB+4KnkVgBUGcyKOy9OzqnCt9rSC0K0EgA6Nk/vCqgNwPU8NiER5QH4gka3yBuu3wXvMQfjCFd9UgZLus235MGrwpa1yXxB0vD25Acn1fnzmzQIAKRzfYEzMkAGXcYvZztvALTbOOYtwT0ATvmKOBfVI2NSMAIbPacZNN0B8Gu35XfxabEG1J+BrAfOIKAXLM0i7H98Q0TE0sj2Ey1eDlJ7Z0iAjtzoazXc8AXRVZ9fTCphZseytNQZSHhLny/FEd1sAoXnkhbXf7rluAoTbYqEp/8Z8hFIuDnI7AQ10Cvfc8URZ9zctEzsEGhctrJS8CkBp+TqinMbyIWwn09j1lNpiPaxYgEwN381svViYJ+/4HgBf9GD1fQGrgunk9zzFTSaUKcPbkxtwkueN7vhD0AFxvITW44Y6QNbeH85MZlfFK5yre1CWTRSa+RAtU5OJwo6OxzKtOlCUc/tDiO1BAXgEoPYus/hKidIActdQ68dzQEoTNxUA58T19xpb5NIbYMBPzWc8PtFk/XwQSOgjpddzOdMxJBEdKvuF6FcMkh5FpZC5AoIOu15NBYjDfX24AKx1jkWV6i/k+i2mDrVXLrkdKsBEvmJHpkMHxEr9a2CU9E1PlDzahMZIj16nAujvbwR20GLAMI0VFOulGph28i1B/3ss8IfYBlxSAdjuVWgjWrlY/potisc1Adj4aNuRAsDyp2ImV1uAp7QpmK6dPycaqANWt7ZNS0eAaYj+iy2klX5C/N/tVZUCMOROWz2A9R9p5hj2ndlWbsAaaamqdEUdoZIb0Oq/uq3+jWivlpTqKAcd6qkAtEIXDl12wdmlY18rSvjhqAsHT3726cLRV9xmOn34PuVaqF3Rf4PAd8f0AFm4AAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJeUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zO6uV4AAADKdFJOUwAFb9D4//K+TAi9hYzWiICT7An0wwcfM1M0eJ9Acf6h3WUCFPkGzj48T6nN9faBCh2m4loBO8uwet/elSq51eD7iZLtbQRFnZ5YE7wt8FExXT1Dg/zCF8aUIHxgXouNC4f64UjlyiPj3HO4OH8wQulfz2ygA/ejP6K3GITmtv3kxXmzIRt9yUmvl7WuzGYMEh5GrPObhg7naVw2dWLunGvx70RNmCckjte/TllWjzl3itIvIitV6nvoGjenyA8NNS6rENoVOsARmnIHRoJUAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEE0lEQVRYR8WX+18UVRiH33X5ooaJ7ipeWEdCcEWB0MpAEhcLhdVABVkxMMEUjDQUpITMO5pdFbxXWml3NbOs7Gr3/qs+Z2bPnHPe2RHol56f5rznfJ85O2fmzCzRMATGBNOQmvSx4/hoL+Pv4zGDDD7ewwTg/omZqZk0GRhuDqEwpkzlRZesyRjLa4xpwHRe05iEdPd4xkw+Q0E2EDEiJpmAPJxl8esjcQWzcx7IdaMOSjAnj+dcpCAfwNyoljYE84ACs88hogTjhc2an6V3K4E20MAULCgEioofVN2jFcwsWWgBix56WHaPWkD0yGIAj8ru/yCggjCQLqfgEZTmlCmWlHsFjy0FUOGuhUewzFjAWIAJKpfHgMefqJJ5r2DFymxFdQ2fgZCWx914CoEHLli12ugelSD3SeTUsu5RCahujefBHl6wFljHaxr1aEge8WVc30hZiQ1ETcBGFtJZhbLkkWcZa+kpsYy0AEXNIRaTxFuATcljvoz1+fT05hrxmLaq+yIFbXNMQQq2PMNDGlu3yWH+AgrVys2uHR3Gfrc96j6W9xIoEniWl1z+f0En8FwkskP85HkRH3a2qZ3EQ+h5+6p2UXwXv9I6u3lOEbENLfEgz+h09/CYRqgzsgfVQaCXT13yQhPPcMKwgBf5WQLT9yb6WM2HMLz5pv6XAKwxi36Eeb6qYN/L9o/v0qv+VJj5kuL9Inzg4IgFfevUvd0z7lCDiC9bTYdHLFAcOdom0gMdGCBdEOgvVufwJffY8Zj4BntlB50wBYFXgTo+nNNXWiZO/trrbxAxgcgn8nnA4c23HE6eEjvQ4NAMp2wKTgOJM2bOIav8rH7DBs+5o0xBpU/+fKGWLszu1LqkYIP9Puu54HkxCGosWEsvvm3zDt41+qQA6ZeMuk7jZbz3vmy0+wmA7UaHRj3wgdvwE1xZhFZ3A2YEsVg1/ARddRb6RaHkqs2H6hOBivCRavgKaBdOENElea0PqTF5aFENf8FW7CWiDCmYq8Z8jE9Uw1ewLYYJ4l789DObzxvVmGuwrrsNLriBL2xBxk1YXxo9iltpaP9KNriAxA3kLKOYQGpmAWlXvt5pc5sLBELQUMk/1DW+cbYth2+Pfqd19dzJtwXfX3VaKW9los594vmXxI5vcc+2Cd3aw7QZP/yo5zR+mha1kB2N3ob9F29JaXIfn4ghTVAPDPgZiCwU2xfx56FBAK2nVohp5P5SpQkCd4EBv+8dV0B05pz9fuu4kVxsbUu7CxwzUhpKQER3qsUekTff3qb1TbWlW/u7YWIIiH7dfVNM47eLv+uCe8EERPTH7CIAaQubRyr4MzPzsnkj/TWmwlnakQjs9xDwNyuv7d0DoJlVU9Fr34+D3j/T8X8q9t/iRcW/Rp793aZzyfsAAAAASUVORK5CYII=" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD/UExURQAAAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////u10PwAAABVdFJOUwABYKWqq7FlAoH/h+7zVSSnlEczMmj5rwj9Q/6WvWs25PsX9sFsSzfmFvApSiUEhaaTSK6eBqhT+uPGy+e0uhouVEQFjtESgqmf9Jkj+NgYX9tQ2tc2c8R/AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABvUlEQVRYR+2WaVeCQBSGr7mUN7XFFsk2bdMybTExS1PcszKz//9bOoAMcJkSyHNaDs8nmPF9ZGbuDAB4zAbfnD8whWCIEpxfYIIwumKRCSK0yx5RJkAMsGs+McQYaQohsmv7gqXw8sqq2sQRxNdYC2UiWN+QH30zITdZBXFB+NSgCraS6uC35SargDNOhtq3g8ndxN4+ptIuBQd4CABHiMc/JVCGcJLBVNalQJvE0zOuIIeYM6UMmJYRMXPOE+QLhbwpZUAvpIvLq2vEIk/wFabh3ZSi4rcEKkZBGW/p/idUEO/IeXCPAhNU2Q51RI0J0tUy7ZyOUHtgAg+NeiOmIDVpjz1abH7bHQAQS7QWNEoijSrUDSvUBYCo4Z6gH+dGGogtdQiIPQAoCjSnIRRpVkGv9uk7g8s/FPTpJD7yV49BBdZl5E8+QzL8dMArpP4TjZhptln+OU47bdHp9tS/GrjLe8wC6WXy7o2EfQAwnJxPVhpDGlXIGkrvFQBG+i1lRLMKb4gVtQ4Q/QAwpjGdMc0q0L0wFOmja4jyJ5YVKnDM7xM43s5U4PhAoctoeS9MO9JoITlHejeVssdf4gM5/UE31L2qwQAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img4"></image>`,
        fallback_icon_5: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH7UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9CSiQAAAACpdFJOUwAhnPFg+v/nCXHGsfuNR8x/Bvgm/h5mmThAgMIKqjPZaVuJGzYUlM45VRHuUgeQVGPmBYgpAdOBSfcXCxDFmgLP9Q/og7/hO/1QVrm7Twzbq8mb6WdZTivzkRLIwQOpN/yWbghtxGEw3/TkNKMYl0Tgioee5WvtotoEV9HweHPe9o5FpfIZQUuYDkJ8vCWt7KTdtnmhfVEj+T8iy2+CerjrcIa6YrU1p7NOps29AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAC/UlEQVRYR9WW+V8SQRjGR9NHzZQ0hErStLBAzaPosNSww4vCg7Is1A40y8SszC5TK9Tuwy4qLTv/zD6zF8vAR3bGn3p+YN55Zt/vvszOzg4hQkpKXpXCehxKSk4F0tJZ26ikdAAZ7IAxSemrM7FGsIQsmp5NTFibJlRCTi5NJ+tgzsvQl2Cx6pUXlROt9Rvo70bkE5u+hE3SrKgq0GfEVSE2E6IvoahYry3RV8dqK1LtJLoEPpUgkzYZ2KY62x16OaOujpWtFGW0Ld9RoVp8c1CJqmrG2mnSaxczysi1G3tYj0t7sa+G9fY7FR1gR+KoFnWsFZmDUnYkVtlITWI9HkD9wTgF8PyFFLgTLrTl1HAIh1lP/xiPsCOsSnDUxno8c9DYhGbS0uqR1Nqi+dpSPhZ1eYyOe9FGSLt6u3Z2PKE60FlDiAlWn8/ns8LEjifSCeAkoQAH7Tm4AV2ncJq2ooBuL87k0EAQUH4WVfISEgP4e+DulUMhgKsOfc1KLAJwnYO5Uu0IAPwdMJ/XevyAC20wX4x0uQH2APr6dX1ewMAlDNIFqIkT0O/G5StRDhegYQgIXCWkIKDsGMN8gOAIzNfoV2RUfYXRwAGwXzfjRrYUFsND94sUwGkYUH1zDLjVLXeK5b3YaRxQ7ygExuXbCwBu37kL3Ltfrhl8gO6JB8DklF1ncQD80w8ngUdZjwlpVLbakHFA+sxsJwDvBP1EDWiPLmQIMPfk6bNJAINDwXrJCCJXWjtuOBIAnk9Xjr7wNtF7vXxVoX15gngttTRheUBALnTszdtev+pxAXpGauffvf/giuRKMg7Qy6PM28ciQYA281ZhwKdwOByeRR0HoKVdftc/f6GAMLVognFAq1q2VxDggZWu2K80QRBgoY2U8N8ChiwWi2VKBizQeFECfKOhZUQC5NPwuwyw0lh3xFlUn8I4IX1qPExCaogysqTFc3EOWTOL8rntx09CFuTQ8+s3sc0r8R8n6fqrxEsk3jFvJaLrdiWKvDyCWjHgH4uP5a2V1FPTAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img5"></image>`,
        fallback_icon_6: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ2UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yo3L/gAAADSdFJOUwA4foBvCO//fwE77qUu6rYi5MMEmf3PCnLrYfYGT/wS3/4hCXAFbEACZkkyUb+7sCdUuagWF43Wa4rELFvCsRpig5OBXiojjubhhhyY++z4DD7lvCjcB1j5NsH1SPdjofP0P07HSl1cn9UU8FqquBs6dIkls3O+ypcmeunAxcgPzETe3dJMlpXY6Kvahxl50PLRbg52hXvO4s18rpC0OZuC2/ppsucvN5wDqR9SnTMTS7VkrB2gkoSU7StGd9fTTVcxC3E1iCQQbUFgPWimyylqPEaNjEoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPHSURBVFhH7Zf7WxRVGMe/BuzXzchiAyFhddGlNeUSliVakVqIumKYRBpqipUhXbRQscCiC+CFdNVQvGDRRe1qpVZ2NVMrM/8jn3dmd+bMaXeZJZ/Hfujzy+553zmffeecOXPOAtecYdelpU56hi3wcCik2wI95Y7hqiDNbrjD+18UXD/iBgCZN44EcNPNWT4jc0u2fufMGZVAkMs8ALdydD5QQP8YIzNW704GChMIxo0fBiBYdBuA0ITbzczEfz4hk4xEHEFqXHVBsV7ooGiCoXB1Bf96DP4XRAVpJQqlZQDuKC8pKZl8p9IxRjzBXc5ZmgLgbuPbPWrPKPEEmJpVYVM+DcD0eysqKu67X5KhzMoHZsyYOetBb2JBEh6qmh2rrHrO3JQFY+aFpWs4b75fPmumLEhN8HAtGVg44REfEJxWlEVy0cS4AscszKuLZR+tJ0fKiER5bDG55PE4Am0W5M0kFITZsNS+Vu4/N8yGOALnLCyL7lxly/nECvtSk5X1rldjqJHZq/Qg8KRrwVPkVD0mPO1S4F3NWmMf0HmmiYvtVlQQWtNcHOPZOc9J6HnyBfs6lbXkOqthCoIvOmbBI9vEWvplKY17qWX9ho0OQZmqNgWt5KaXYxXkkNV1wCtsA9C+WYxLXnUYXmOpJujg6wvsfDr5hhw93gTwFtnZks0ux2h0c4v13RT4uVXJb5NlnEFuB0JNXOhDJbmlxySnFUAV39YEHdyhVLBTKmgnxwMRcpdhtKgBsJv1mmAP2WWNwTtkbwbqyD2AdxP3RrCPbOnrZKCvr5NhAPvZpAnyDyi/QXoOAsjjIQD9pGcseTiIfr4LvMdqAKVcrQkQmt5tPQflW43noJg7RD0gxvc/AD6s/Qg4UlAIeGt5VBfEIY2BY/JAfvzJ5F3mkSPGp+q7MrEgk+zXYyYb6DdqNEgsQCM9n+kx4VgDB+xWEsHn5DI9Jvf0BTkQtJpJBDhAHtdjwHYZ1S8tQzLBti6G1+jBogA72hSDNffVXwErPF8DOKEeEAMn7WplbZ4iv/m2vY3sjsbt0/p3wGnOBvC90p/kDz+aGxKAIz8tIrt+BsQQreHg8OjJaakX+OXMrzJ/6gGxR7aCs6sKI+2/razqlS0mU7qpNSQn/7TjH0UNuf6cxJUaBiNyvtHY1chw8fFI8xAMwLkLlblnfv9DVrzPYWgO6ZcOju+oavhTT7tAqaGDPXrWDbbhrLwihoBluMj5es4dYvjr0qi/s3lRT7lERlJY7txxUsB3ShZM72U9ngIbi1onKf+Arx1XAIIJ103oJIW+AAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img6"></image>`,
      };
    },
  });
