import { tool } from "ai";
import { z } from "zod";

export const hubAndSpokeContributionVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Hub-and-Spoke Contribution Visualization' designed to highlight multiple elements contributing to a central concept. The layout includes:  
      1. A main header at the top for the overall title, with a sub-header below for additional context.  
      2. A large central circle representing the hub, containing an icon that symbolizes the core concept or idea.  
      3. Six contributing elements, represented as colored circles, symmetrically arranged around the central hub (three on each side).  
      4. All contributing circles (spokes) are connected to the central hub with inward-pointing arrows, emphasizing the aggregation of elements into the core concept.  
      5. Each contributing circle includes:  
         - Two lines of text summarizing the contributing element.  

      This template is ideal for illustrating systems, concepts, or processes where multiple inputs or factors converge into a central idea or outcome.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the hub-and-spoke visualization."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Contributing Elements
      contributing_element_1_line_1: z
        .string()
        .describe("The first line of text for the first contributing element."),
      contributing_element_1_line_2: z
        .string()
        .describe(
          "The second line of text for the first contributing element."
        ),

      contributing_element_2_line_1: z
        .string()
        .describe(
          "The first line of text for the second contributing element."
        ),
      contributing_element_2_line_2: z
        .string()
        .describe(
          "The second line of text for the second contributing element."
        ),

      contributing_element_3_line_1: z
        .string()
        .describe("The first line of text for the third contributing element."),
      contributing_element_3_line_2: z
        .string()
        .describe(
          "The second line of text for the third contributing element."
        ),

      contributing_element_4_line_1: z
        .string()
        .describe(
          "The first line of text for the fourth contributing element."
        ),
      contributing_element_4_line_2: z
        .string()
        .describe(
          "The second line of text for the fourth contributing element."
        ),

      contributing_element_5_line_1: z
        .string()
        .describe("The first line of text for the fifth contributing element."),
      contributing_element_5_line_2: z
        .string()
        .describe(
          "The second line of text for the fifth contributing element."
        ),

      contributing_element_6_line_1: z
        .string()
        .describe("The first line of text for the sixth contributing element."),
      contributing_element_6_line_2: z
        .string()
        .describe(
          "The second line of text for the sixth contributing element."
        ),

      // Icon for the central hub
      icon_1: z
        .string()
        .describe("The name of the Lucide icon to represent the central hub."),
    }),
    execute: async (input) => {
      return {
        ...input,
        template_name: "hub-and-spoke-contribution-visualization",
        fallback_icon_1: `<image width="256" height="256" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACvwSURBVHhe7Z15kCRXfeclI27MZUAYsMHIXGYPHAHm8LL/mMs2Zm2DACvM4Q0Og2Fh8XKsr/ZiMJLFIPXUyxoNYmNAYrreq5merveq1ZKMYQATYHu1sT4Ws5wWEuKQBEhCFiOEmI1fdbWU9cmsynzdlVlZVb9PxCdCofn+fu9VZVV2VdbLzFNOURRFURRFURRFURRFURRFURRFURRFURRFUZSG8P7OJY81Lqwnzt8oyn+3Opc8lrlpkNhwq3H+usSGLyauv5W4cJ5x/sWrbuvBzCqKUjFmrffUxIbvJi6cHNGG78q/Mb9XMuMMNdb/yLjwmcSG1+9z7oGsUxRlyhxw/V/IffPf8aYMN0x7J8Ax8jTW35xY/z7T3Xwo6xVFmQKJDU+Z9Oa/880Ybmhb/zTW7xb2n6j130usf9vBgwfvyj6KouwSefMb62/IvOHGKFlzZHMqnwTYu4zG+isOHO0/hr0URYmk7F9+Oq1PAuxbXn9j2/VewH6KopRkt2/+HaexE2DPGI0NPzSu92r2VBSlgNiP/ePc69cB9otVfi1o2fAq9lUUZQxyJH8ab/4dBzuBXf46cPDgFXddde7B8gtEq+Nfk7jQSVy4iWNM1PrbWh3/fPZWFAXEvPkHb+yY7C53AuTciy6/t3y0314clB0rTxl/tXPsDPZSFGVI0e/8fEOZI4NFQaW/Kkx7ncDx48dPM53wVmP99zlWvv5/rxw/fhr7KMrSs5s3/07tLHcCQrLm/52x/sscK9dOeAvrFWWp2cubf4dZ7wTOX/OnJ87/PceixoabdMWgogyZxpt/hybsBMp8EjDWn8taRVk6pvnm32HWOwHT3XiScQXHBGz4Xntz8wGsVZSloco3avyOZffrBPIw3fAOjkPbzr+OdYqyFET/1Bfx5t+hjjHGsdLt3q34q4D/NOsUZeGJ/+u8+zdmlZ8yijCu/2qOgcf2I1lgxDpFWVhi1vbLG/KCKXw0jx1zr+cO7HDuRRfdW77rc4y0bevPZJ2iLCSz/Gsc/6lj7zseIbHBsf/IWK6/jzWKsnDEvwGn9+bfYRY7IGM3Xsveo/pLWKMoC0UT3vw71L0TkK8T7IvH+wXWKMrCUPcbrgzxO6Tdfx1or68/hD3R/zrWKMpCEHvwbRoH/MoSO7fdHhhcXd26O/uNaP0J1ijK3BPzG3xWf6Ox/phc+599d0vb9R6XuHBs+z4CHK/Yaa8TUJSFZf/h8PjElfvrOknj/HemcbMPefObkn/tJ2rDd6UX+yuKkiJxoZd58+xSY8M6+8eSWPnLn+29G43zG+yvKEqKosUvMRrrb2T/WHb7sT9POZWX/RVFSTG4OUbOm2e3sn8s7Lc3975DUpSFRj4mZ984u5f9Y2G/PWnDMfZXFCWFHAScykG3oewfC/vtVjkoqQcBFaUEgyPvzm/Id2a+kWJl71jYL9bhYzimb35FqQC+4SjzsbAfZV5RlBrhG5IyHwv7UeYVRakRviEp87GwH2VeUZQa4RuSMh8L+1HmFUWpEb4hKfOxsB9lXlGUGuEbkjIfC/tR5hVFqRG+ISnzsbAfZV5RlBrhG5IyHwv7UeaVXbCysvJjcr50y/r/bpw/apz/J+P8dYkNt/IJV9UY+VqLhf2mrg23ymt9+Jo/KjcFkasOyXuCc1k4Drj+wxPX/zNj/b9knhhVnYJ8zcXCfnVprP+aseFseY9wTnNP60PHfqJle+3E+RN84Ko6Tfnai4X9atf6E6bjkwvdZQ/k3OYS4/yLBx/v+UBVtQL5+ouF/WamDde2bP+lnN/csHL8+GnGepN5YKpaoXwdxsJ+M9f22vJe4jwbzT7n7mmcD5kHo6oVy9diLOzXEPvynuJcG8nKyspp+uZXZyVfj7GwX1M0NmzOxSeBxIU2J6+qdcnXYyzs1yitN5xvo0hceElm0pO0/srE9d+TdMJz5OcPuU86eypKmsxrCDIfC/tR5mOR1/jg5/BOeE7bhrMTJ++B7DjjlIPq7NkI9jn3wLJH+40LVxnnf+vMbvcu7KMok+BriTIfC/tR5vdKt9u9i7wXEhu+wrFytf5a+VmdfWbO9u/8OROmNqyZbvc+rFeUMmReT5D5WNiPMj8tzvlA78dNx3c4Xp7y6xrrZ8rgI40ttcjnvFNOnjyV9YpSlpzX1IjMx8J+lPkpc6qx/X0cM6P1J1prvYexeGYk1r8nM0lqw5o8QNYqSgyZ1xVkPhb2o8xPnZMnT02cP8xxM9rwbpbOhMGJPS5clZngqFfqx35lGuS8tkZkPhb2o8xXgXwdSKz/KsdOa2y4qhEnEMlZfZwcbXfneEmj0ij42qLMx8J+lPmqaLtwFsfOaMNTWFc7ckpvZmIjk/RX6tF+ZVpkXl+Q+VjYjzJfFfLrgHxy5vij+rezrnYS549mJ3ancoojaybBeso8YZ4yT5inzCv1wu1BmY+F/SjzVWJc7xyOn9a40GVN7ciFDTixETvhOayZRKYeMk+Yp8wT5inzSr1we1DmY2E/ynyVtGz/uRw/rbHhH1hTO4kN13NiaWN/rmA9ZZ4wT5knzFPmlXrh9qDMx8J+lPkqWV3fegTHH9H6a1lTO6bgMl7dyOW9rKfME+Yp84R5yrxSL9welPlY2I8yXyWrW1t35/gjWn+CNbWTmdQenzDWU+YJ85R5wjxlfhGRG1vKDS7l/vZ8/NPX32isP/b+ziWP5TzyyNaPynws7EeZrxqOT5mvHU6IMl8E6ynzhHnKPGGeMr9oDO7UO8XbdZdVbqfdKrETYB1lPhb2o8xXDcenzNcOJ0SZL4L1lHnCPGWeME+ZXzS2//JnH3cdGhvWOR/CGsp8LOxHma8ajk+Zrx1OiDJfBOsp84R5yjxhnjK/aCQu1PCxP19j/Y2cD2ENZT4W9qPMVw3Hp8zXDidEmVeaDbdf3XI+hHnKfCzsR5mvGo5Pma8dTogyrzQbbr+65XwI85T5WNiPMl81HJ8yXzucEGVeaTbcfnXL+RDmKfOxsB9lvmo4PmW+djghyrzSbLj96pbzIcxT5mNhP8p81XB8ynztcEKUeaXZcPtR5mNhP8o8YZ4yHwv7UearhuNT5muHE6LMK82G248yHwv7UeYJ85T5WNiPMl81HJ8yXzucEGVeaTbcfpT5WNiPMk+Yp8zHwn6U+arh+JT52uGEKPNKs+H2o8zHwn6UecI8ZT4W9qPMVw3Hp8zXDidEmVeaDbcfZT4W9qPME+Yp87GwH2W+ajg+Zb52OCHKvNJsuP0o87GwH2WeME+Zj4X9KPNVw/Ep87XDCVHmlWbD7UeZj4X9KPOEecp8LOxHma8ajk+Zrx1OiDKvNBtuP8p8LOxHmSfMU+ZjYT/KfNVwfMq8ouwJvsAo87GwH2WeME+Zj4X9KPNVw/Ep84qyJ/gCo8zHwn6UecI8ZT4W9qPMVw3Hp8wryp7gC4wyHwv7UeYJ85T5WNiPMl81HJ8yryh7gi8wynws7EeZJ8xT5mNhP8p81XB8yryi7Am+wCjzsbAfZZ4wT5mPhf0o81XD8SnzirIn+AKjzMfCfpR5wjxlPhb2o8xXDcenzCvKnuALjDIfC/tR5gnzlPlY2I8yXzUcnzKvKHuCLzDKfCzsR5knzFPmY2E/ynzVcHzKfO1wQpR5pdlw+1HmY2E/yjxhnjIfC/tR5quG41Pma4cToswrzYbbjzIfC/tR5gnzlPlY2I8yXzUcnzJfO5wQZV5pNtx+lPlY2I8yT5inzMfCfpT5quH4lPna4YQo80qz4fajzMfCfpR5wjxlPhb2o8xXDcenzNcOJ0SZV/Tee5NknjBPmY+F/SjzVcPxKfO1wwlR5pcdvfdetmdMf+Yp87GwH2W+ajg+Zb52OCHK/LKj997L9ozpzzxlPhb2o8xXDcenzNcOJ0SZX3b03nvZnjH9mafMx8J+lPmq4fiU+drhhCjzyw6fn7rlfAjzlPlY2I8yT5inzMfCfpT5quH4lPna4YQo88sOn5+65XwI85T5WNiPMk+Yp8zHwn6U+arh+JT52uGEKPPLDp+fuuV8CPOU+VjYjzJPmKfMx8J+lPmq4fiU+drhhCjzyw6fn7rlfAjzlPlY2I8yT5inzMfCfpT5quH4lPna4YQo88sOnx/KfCzsR5knzFPmY2E/yjxhnjIfC/tR5quG41Pma4cToswvO3x+KPOxsB9lnjBPmY+F/SjzhHnKfCzsR5mvGo5Pma8dTogyv+zw+aHMx8J+lHnCPGU+FvajzBPmKfOxsB9lvmo4PmW+djghyvyyw+eHMh8L+1HmCfOU+VjYjzJPmKfMx8J+lPmq4fiU+drhhCjzyw6fH8p8LOxHmSfMU+ZjYT/KPGGeMh8L+1Hmq4bjU+ZrhxOizC87fH4o87GwH2WeME+Zj4X9KPOEecp8LOxHma8ajk+Zrx1OiDK/7PD5oczHwn6UecI8ZT4W9qPME+Yp87GwH2W+ajg+Zb52OCHK/LLD54cyHwv7UeYJ85T5WNiPMk+Yp8zHwn6U+arh+JT52uGEKPPLDp8fynws7EeZJ8xT5mNhP8o8YZ4yHwv7UearhuNT5muHE6LMLzt8fijzsbAfZZ4wT5mPhf0o84R5ynws7EeZrxqOT5mvHU6IMr/s8PmhzMfCfpR5wjxlPhb2o8wT5inzsbAfZb5qOD5lvnY4Icr8ssPnhzIfC/tR5gnzlPlY2I8yT5inzMfCfpT5quH4lPna4YQo88sOnx/KfCzsR5knzFPmY2E/yjxhnjIfC/tR5quG41Pma4cToswvO3x+KPOxsB9lnjBPmY+F/SjzhHnKfCzsR5mvGo5Pma8dTogyv+zw+aHMx8J+lHnCPGU+FvajzBPmKfOxsB9lvmo4PmW+djghyvyyw+eHMh8L+1HmCfOU+VjYjzJPmKfMx8J+lPmq4fiU+drhhCjzyw6fH8p8LOxHmSfMU+ZjYT/KPGGeMh8L+1Hmq4bjU+ZrhxOizC87fH4o87GwH2WeME+Zj4X9KPOEecp8LOxHma8ajk+Zrx1OiDK/7PD5oczHwn6UecI8ZT4W9qPME+Yp87GwH2W+ajg+Zb52OCHK/LLD54cyHwv7UeYJ85T5WNiPMk+Yp8zHwn6U+arh+JT52uGEKPN1oPfeGy/zhHnKfCzsR5knzFPmY2E/ynzVcHzKfO1wQpT5qtF772V7xvRnnjIfC/tR5gnzlPlY2I8yXzUcnzJfO5wQZb5q9N572Z4x/ZmnzMfCfpR5wjxlPhb2o8xXDcenzNcOJ0SZrxq99162Z0x/5inzsbAfZZ4wT5mPhf0o81XD8SnztcMJUearhuPXLedDmKfMx8J+lHnCPGU+FvajzBPmKfPzDh8fZb52OCHKfNVw/LrlfAjzlPlY2I8yT5inzMfCfpR5wjxlft7h46PM1w4nRJmvGo5ft5wPYZ4yHwv7UeYJ85T5WNiPMk+Yp8zPO3x8lPna4YQo81XD8euW8yHMU+ZjYT/KPGGeMh8L+1HmCfOU+XmHj48yXzucEGW+ajg+ZT4W9qPME+Yp87GwH2WeME+Zj4X9KPPLDp8fynztcEKU+arh+JT5WNiPMk+Yp8zHwn6UecI8ZT4W9qPMLzt8fijztcMJUearhuNT5mNhP8o8YZ4yHwv7UeYJ85T5WNiPMr/s8PmhzNcOJ0SZrxqOT5mPhf0o84R5ynws7EeZJ8xT5mNhP8p8FZw8efLUiy66/N7tw5sPEE23e59TTp48lbkmwOeHMl87nBBlvmo4PmU+FvajzBPmKfOxsB9lnjBPmY+F/Sjzu2W1c+yMluv/hnH+j43zHzLWfzKx4YvG+hsSF37EcRMXbh/+2+dN1388seGQcf4P2q73AvPho49k/7rImWclz9eu4YQo81XD8SnzsbAfZZ4wT5mPhf0o84R5ynws7EeZL4ucA9Ky/o3G+Q1jw7fYd68a67+eWH/E2PDa/c7/DMevCs6DMl87nBBlvmo4PmU+FvajzBPmKfOxsB9lnjBPmY+F/Sjzk1h1vZ9LbHinsf6z7FO1wzH/5IJjW2dwXtOE41Lma4cTosxXDcenzMfCfpR5wjxlPhb2o8wT5inzsbAfZZ7sc+6epuNfaZz/O9bOQmO9fJ34hOmEl62ubt2d890rHI8yXzucEGW+ajg+ZT4W9qPME+Yp87GwH2WeME+Zr4uD3e79Ehf+MHH+Os6pQV7Tcv7tH+j1fpzz3y05Y4zIfO1wQpT5quH4lPlY2I8yT5inzMfCfpR5wjxlvmrkzSQH8uq5uMuUtP76/da/7dDx4/fg44kl0xsyXzucEGW+ajg+ZT4W9qPME+Yp87GwH2WeME+Zrwr5qS7p9l9ubPgm5zA3Wn+lcf0X8bHFkOkJma8dTogyXzUcnzIfC/tR5gnzlPlY2I8yT5inzFeBcf5nExc+xbHnVePCZfKzJB9nGdiLMl87nBBlvmo4PmU+FvajzBPmKfOxsB9lnjBPmZ8mg7/6LrzFOP99jrtLr09cuLTt+vtaNrzKdMIvtW3/35y/5k8/dOj4PcSdRUGttd7Dks7mE1rOP1t+6jOud05iw18a67+T03cX+htlDnzMRWT7jMp87XBClPmq4fiU+VjYjzJPmKfMx8J+lHnCPGV+WrQvWn+Icf5yjhel9ScS5y9JXPhds+afKG9ujhPNyZOnyrUeTaf/hsSFSxIbbsmMG6MNTg5ocphxZOoh87XDCVHmq4bjU+ZjYT/KPGGeMh8L+1HmCfOU+WmQ2PAU48JVHKuM8jOccf5jrU44a5pH38chy4bbrv8K48LHZPUg51PSzyedY09g7zxyakdkvnY4Icp81XB8ynws7EeZJ8xT5mNhP8o8YZ4yv1daNrxwN39VjfXfN84n5x8++hj2rIvhsYqWsf5fOb8ijQ03GOefx56EdZT52uGEKPNVw/Ep87GwH2WeME+Zj4X9KPOEecr8Xmhb/+bYv6KDN77151645k9nv1mx6rYenLjw3u2vINk5j9M4/4PE9l/OfnMFHxRlvmo4PmU+FvajzBPmKfOxsB9lnjBPmd8tbRv+iL2LNM4fbR/efDR7NYUDnY1HtWxwnPckB19hOv4N7DU38AFR5quG41PmY2E/yjxhnjIfC/tR5gnzlPndkHRkRV+29wSvadmN57JPU0lc71cTF67MeRy5bh/H6M/nToAPhjJfNRyfMh8L+1HmCfOU+VjYjzJPmKfMxzL82J/pO05jw8XnbWzcn32ajhzpN9Yf5uOZ4O3GhZexT+PJeSAjMl81HJ8yHwv7UeYJ85T5WNiPMk+Yp8zH0LL+zLLf+Y0Nt8rv8ewRi/y+L9cFGJw16PxRY/3fJs5fM7inows/MDb8MHHhZmP914wNV8jdnYz17zJrvRdJLfvFYpx/XdljA8b625JOeA57NBo+CMp81XB8ynws7EeZJ8xT5mNhP8o8YZ4yXxb5qS/iaP83k87GM9ijLIOx5KCcC/93zMU/ymv954z1+9rWP+2UU07Z1bqC1uHwdFP+JKbvyoIk9mgsOQ9gROarhuNT5mNhP8o8YZ4yHwv7UeYJ85T5Mmwv8in3O79x4V8OHO5H/7R3drd7P/l6Yaz/AntOS2PD/5OViqsXb92X4xfR6hx7rLH+y+yZq/WfO+cD1a9pmAqZyUPmq4bjU+ZjYT/KPGGeMh8L+1HmCfOU+SJkNV7ZFX7G+s+tXrz+CPaYxOA0YRveWefZgvIbvox5sPuR0iv6hAvWL/3JsjsoY71lfSPhxCnzVcPxKfOxsB9lnjBPmY+F/SjzhHnKfBHyF5M98pS//DFv/pWVlR9rdf1rhuv9M/3qUM5UHB64K/3VIOls/FRiw1fYK1fba/4agcykIfNVw/Ep87GwH2WeME+Zj4X9KPOEecr8JPYfDo8veWLPN2M+9jftbEFj/cdjzvaTrLHFxwTkk0bMTnEmcNKU+arh+JT5WNiPMk+Yp8zHwn6UecI8ZX4cwzP7Ct+kcrQ/5oBf4jZ/29hwE/vMWplTy/ZfyvmOY3+n/8zElfp1oMfaRpEz4RGZrxqOT5mPhf0o84R5ynws7EeZJ8xT5sdhuv6VrM2z7E998pE/cf2/YH3TNJ3eOWXPQjSu92rW52rDr7G2MWQmC5kvgvVqs+T2ymNwGa8SV/KRRT6szaPb7d7NWH+M9RFek9iwZlz4L23be9ZqZ+sMOZK/cvz4abJjkQOJF3S2zpB/Szq9NyUufDix/hs5fcppwwelNx9HHnJ6cKY+o//8Srd7N9Y2guxkR2W+CNarzZLbKw9jwwrrqLH+6jIr/A4dOnSP4Tn+mR6TNNZ/21h//gHX/4Wyf5HTDL7CbJ+mvF96sX+hNvTK7ATOO7Rx/1LLhm14PWsbQWaikPkiWK82S24v0vrQsZ8o9ZNciRVv8tdZVu9laid7jfyll8uHs99uOfeiy++dWP/GxIWv54w3Xhs+WOaWY8NzB7L1o14zzcc0NXImOiLzRbBebZbcXsTYXuFff7nDDuvySFw4L1M7zsHSYf8uubwX+0wLuRhIYsO7B6fxcvxxWv8e9snDuLCeqYWyrJh1M4eTpMwXwXq1WXJ7pZG/UHJJbNaklfP5D3QufRRrScuFs1g7TmPDZ01380nsURWmu/EkWbTEeeQ5uHGIDb/OHuT8bvhp48LEn0yN8186s9u9C2tnCidJmS+C9Wqz5PZKY1z/PzNP5WIerCNyDb7Ehu+xNk9je+ume/w+7FE1MmaZv9qDOTr/HblWAHsQY8P5rKWtjn8+62YKJ0iZL4L1arPk9kpTdLsuY/0tRVfyGfzcZ/1fszbPlg1tybNHXaycPCnHKBLOK0+5O3HRwUi5WrFx/mbWjvYJm6ybKZwgZb4I1qvNkttrhwNyo86c/IjWr7KOyBV9M3U5ypuftTNCfi1oc355Gtd/NYtJ8Q7F32a63YeybmZkJzgq88piIgfHuO3Tynfhogt4ym/zxvprWUvlY3/sX345u65ley81LhwcXBNAxrHhVuZ2w/anltDjPDNaf23RCUT7j4bHD284mq3fsdN7E+tmRmZykHllMZFTWLntR7Tho6whxvl3Zerg9gG/8t/55bwB4/yFyZiP1szvlsEvBK7gOdg+HvA/WEuM8x9hHfwEa2ZGzuRGZF5ZPNqu9zhud9p24SzWpZHVg4kN32XdiPJTX8mj/XJjTrm7j7GTf7Jj3V5oH+n9fNF4xvobiq4n0Hb+Fawb7RF++N7D4UGsmwmcHGVeWTxa24tkMtv+Dq0/UXTTDuPCf83UQfmdn3V5yNl2iQt/z/o8WbtXjA1ncwza6vTewro0q1tb9y08i7Kz8RLWzYTMxCDzyuJhnN/gdh/VX8IaYlz452zdiNeUWeSz367/eyOXFMvW58r6vTJcNTjxPAK5slDRNQSM84F18CBrZkLOxEZkXlk8jA3f4naHv8uaNGat99ScmhFleS/ryOA8+4g3v8ge00DmynGoWdt8KuvSDJceZ+ruqLf+s6yZCZwYZV5ZLNpHNx/NbU7lRp2sSyOLg1gzUm/9t/e5T09cBy/f+ct+7E/LPtNAPgXI4h+OlbbV6b2XdWnkwqCsGdXfHnOT0crITmxU5pXFouV6v8FtPqIN1xctgBlevTdbO1TO6mMNGdzOO6e2SPaZFrLmgWONaEPhX3B57jJ1Kfd3Np7JmtrhpNTFktubGOf/mDUj2nApa9K0er2HZWqgnNLLujSDn/oKjr7vaJz/J/lKIsuN5ToD7DUtzJHirzXvu3j9J1mXJrH+r1gz8lhKXkylUjgpdbHk9ibG+Q+xJm3b9fexJk1rreAThAvXFH2C2P6dP1M3olx6rOV6v1fbyTSDqyEXHI/o+N9kWZp28Vejic9tLXBS6mLJ7U2M859kTdqWDa9iTZpWwQpCuZIPa9LICr9xi3x2HNxlqBN+ibVVI3PnXPDY3smaNMWXDPNHWVM72UmpiyS3N0ls+CJr0ha98YwLXdaM1Bcc/Zflvayh8pefdXVQuLah4LoIxvnnZWpSGhc+w5ra4aTUxZLbmwxukpFTt2PLbfxb1qQx1l/BmrRynT7WpEmsfz9r0sp3/to+9oO23XwW5wP/F2vSmCP+iTk1d2rDF1lTO5lJqQslt3eawV1/Ck5caa9f/hDWpUmsv5o1aeVinaxJs32zz2xdyolrEKpEbgeWM587lNulsSaN6W4+lDXwetbUTs6k1AWS2zvNYNVbTk3agyHci3Vpiq7xX7SEeHBWX07djnK0nzV1MbhtWc6c7tCG77EmjSwJztSM1t/CmtrJTEpdKLm907QPbz6AeVr0U1ti/cTbhRddWXdwY5GcurLjV8nBgwfvyvmMaP1trElTov521tROZlKQeWVxGF7SOrPN0xZ9/y66wGbsef9NYnV16+58PGmNCz9gTZqVleOnsWakvmAHUgucFGVeWRzKfAU496KLJp7AY6z/V9akbcRy111y8HB4EB9PWjmAypo08tyxZqTe+e+zpnY4Kcq8sjgM7/838SN8a633MNalkQNhrEkbc9PNpnHgaP8xfDyj+qtZk+ZC70/P1qS0/lrW1E5mUpB5ZbGQC1xwm4/Y2XwCa9Ls9WfAJmPsxq/w8cC/YU0aOYkqpybtl1hTO00+CKNUj9y3jts8bcv5Z7MmjSyGYc2ITbr+XSR7XQg0uFcha1Ia6z/NmtopOmPpgOs/nDXK4mC6/uPc5mnbXf8a1qSRa+SxJq2x/jBr5gVj/cRVjonr/ylr0hQtBZbbprGmdkxncHZVZnJ3WOIecMr8kthwKLPNR16k4RzWpJETYlgzovXfKDoZqIls31x08hqFojsGFV0nQU4WYk3tFN28Ua6RxhplcWh1wh9ym49sf+cvZ00auVFI4sLE1YT7Dx+beDpwE2m58HQ+jpHnxfofFZ0ObFy4jHWjPRpwOrDphndwYiNaf2W34LdgZX5pu94LMtt85EXqv1N0h9yiS4rLLbpZ03SKbhYi5yiwZoTB6cT+Otal3W/9L7KsduRiDZwYNc7/FuuUxeBgN/w0tzctWo4rXxNYM/L6sf7bsuaAdU1lcN9AO/mSYEX3SEw6xyZfEsz62+VeBKyrne17uE/+LTex/qty3jZrlcVALtqR2eYpTaf/BtakWbX+aazJaP0bWddUTKf31sz8YWut92TWpWm58HusGX0+wj+yZmYYF/48M0FoOr5T9FFQmU+Kfsoz1m+xhpS4LPjXG/EXrwA5eanoSkDDy4JPJHGhz7q0Ldtryr0RB18DHi43f+AkM1r/Pt0JLB4t15t8Q08bbil688rNMjJ11IZ3s65pyGs8M29YdJGT4T0SJ94YpGX9maybKYntG04yX9/RrwOLxX7nfya7nUeV212xLs3g1NmCW4PJiUOmu1Hq1mCz4IIjvSfLGX6c98hjsOGG1YsvnnhrMNMJL2PdaA9/23kbG/dn3Uy50F32wMSGyb977mj9V+VecfrrwOJgXPiHzHZOv2hd+BhriFwjj3XUWP+5mJuD1oXc9ddY/2XOl7Y6fuLiH8HY8FHWjVjiRqszoX1k88zMZCfqr5Trubds/7mr61uPkNMn2VOZD1qd8CfZ7Tvi7ecf7k+8PbicXlzq9uAurK+cPNmY04TlmgVF39m35+2vK7oxqJxAVHSVJfnKxbrGkFhf8quAOo9ye+9wwbGtM4peuMb6A6wjsnSYdXka55Oi++vVxKmJDf+T88uzZTcmXiFZkMfFuhFtuHXVuQezrjHI3rDEjQ3VOZXbO43ct575EW24pX3R+sRrBMpf9sT6v87U5mlDe5YXDBn85S/55jcufKpoSfP5a/70ousjFJ1A1Aj2OXdP4/q6E1hAua3TtDobZzGf48R74gmD23vb8L2c2qw29Ip+YagC+c5f5mP/tv7GMtc1SFw4L1s7amtt8tmVjWF776hfBxZNbuc0B6+4Qq5hN3FRkPxcLL8asJbI6tFM7Vj959prvZ9nj6poHek9ucwBvx3lgDd7kPbho482Lkz86W+4fHjip4jGYZx/ceFZUercyO1LTCcUroJLbHCsy0NufZWpHaPcG1BOPKtyybAs8hn8zl/wU9/IvArOhtzBWH+MtbRle7/Durlgn3MPNPJpoMxiIbXRctsS+TieWD/xGhFiq+Ofz1qyfTwgONZO1PpvyEKbae4I5DHJ8t6iFX4ZbThS5hhFa23yCVWifOI4XnCF5MYj14eT1VyyDoAPUJ0PuU3zMLb/+6zL8eoyF/xc6Xbvljh/SU79RI3z35FbdMtdenez+lQO2A1O6bWhXXRiT55yIFy+ErEvGV5afeLNUQb9Ov6VrJ1bZK+Y2PCUxPm3D+4NZ/0/yteEosuLqbOX2zKPlUOH7iGngbOWlr3az2AnEPtJID2O/OW2YU0u0SW365I79shBPLnuvlyy7mAID9r+/b3/K5IZXMlnL19bbXCrW+XWtBTdG3HY7/+U+SShLBCFJ1g16WywHNo2vDAz5xyN869jbR7ydSDmmMCslDmWfbOajn8D6/Ns2V6LtcqCI0d8+UIYeaG53p+zpmkkNlzKeWe0/kTrcHg6a8fRcuGs0j8R1ujwFmcv4XzHYWzvP8qiHvYZp+n03sEeyoJyoHPpo/gCoPL9lHVNw3z46CPlN3DOncoSWflYzvpxyG/qxvpPss+sbDn/CeP8z3Ke42i73uPkIifsU6TuBJYEufgFN/7IC8GGb5X9mDlrWja8ivPPU45yX7B+6cRr5KXZvhBN/9Vlzh2oSmP9t+S6fEUr/NLIFZTMHg6C605gCZALaXLDj2jDIdY0mbIH8Iz1X0g6Gz/F+kkM7k9oe+80BacST9PBWDa8s+i0XjK4fJoNX2S/WHUnsMAMFpu4yeslWja8kHVNZnib7Ik3ELlDG75SZtkskbPs2ta/ObHhs5meU9I4/8/yK8Furmcx/Ni/67/8VHcCC0rh0XPrT8hOgnVNRy5yKRfDyDyeHI311+3v9J/JHmUxa72nyqpAecMWXXK8SDkY27L+L+Rna45TFjngt5vv/EXqTmABMbb3QW7okY1uJ19nv8m0bf+5RbcDv1N/Qu6Mwx6xtNfXH7J98xH/p/JVxDj/d4kLVxrnbx5cqsyGH8qBSmP9VfJvxnnbcv7PTMf/pwvWJ1+3vwyDn/rKH+2/WW6kI/cMzPm3XHUnsEAMT4WdeFBLXlCsmycS23950XUDRrTByfd89mk6ssKv1CKfods7xs1fldrhmYa6E1g2ks7GM7hx6YHOxqNYN28kNrw+Ziew/d25N3hzzAOJDb9WZnnvnY8v/FBOmkv30J3AEjLvq/9iaG9f9/72zGOcoFwKTI6ks1dTGJzSW+KsvtHH5H/AN/8OuhNYMopW/83DZbFjMC68TK5wm3mcE5Rz5o0N58vVc9hvVshc5GIeRefz53jzzsf+cehOYElYlNV/sbScf7axvtSvA2nlIJ5cP2//4fB49qyLwQlEzieFl/EaZ8k7Z+tOYAlYpNV/sSSdzScU3SB0nHIswTj/kZbzryhzevFeGa7T+G25dHfMcYwx/o28uTlGHroTWHAWbfXfJA6GcC/+P1lcY6y3mccdoXH++3IevlwQRHYqHGNXnDx5qqxhGB6z6BfdsWcX6k5g2Smz+i/pbP4m6+YJuUOwsf73E+ePJ87fPG4x037be3nZBUOF2nB9Yv1fyYVI2za8yqz555kj/ommu/nQ1a2t+w6vB3CXgwfDvS70/nSz5p/Ytr1nyfoDuXuvceGyolt0T0ndCSwzZq33Im64Uf2JJt4NZxJndrt3GVxRx/n3GOszy3NlxSNrdpArR8UeTZ93ZRFS2dt9nd3t3s+48Bn2GKexvT9iD6VBGBsmrv5LnL+MNU3HOL+RfRwjL8oPsoa0O/75csVf1s6Ngytd9VqZ/z9GY/3flt0JyCeBlvXlPwk4/wfsoTSA7dNaw7e4wUY23hyu/is6qCkrHsvc3mt4OTBZOPS1TI/meqVcwXfnoK18DM/J5Ko7gSVjUVf/yZz5ODJ2Np7BunFs32zGvy6xvT2fTluVg686NvxO3tV7m7ITSGz/beyhzJBFXv1XtLBJHjtrihgcW+j45xvrNxMXt4ioEuVEH+uPDO/YM/HCIDE7gaoODMpPly3beyl7KDOi6E0yz6v/inZuwzvd7BrT7T406fTeJPck3D6rLztGFQ5WL9rwUblLb+yNOpuxEwg3xV54RamARV/9V+7rzaVT+Xrz3sPhQXJRzsT692//6uCjzjOYqPW3yyexlu21W9afudezExuyE7iY9UrNFB0om/fVf2VOb5bngHXTQK4QZLrhP8g1++RS3cb21hMXPmOs/5KsDzDW3zIcX/6a3zKc55eM9Z9OnD86WAdgw2v3W/+LVdx8dPY7AX+bfgqYMYnt/WV2w6RcgNV/8hgyjyulrIBkzbLQcv7tfD7GWdE6gf/GWqUmlmH1n1B4iTM3n5c4mxZVfRKQnUXR+RXG9bdYp9RE4RvD+hO7ufhk0yizo5u0KnAZqGonsL8Tfjmn/g6NC1exRqmJRVz9N46iE53KrApcdGJ2AmXXCawcP36acWH8NRitP8EapQbKHBybx9V/4yg62Fl2VeCiE7MTKPNJQG5YIm/ynNqd5113ALOgzM9j583h6r9xlPm5M2ZV4CIzzZ3A9slYmZo7tf5q1ig1ULRAZp5X/42jaMHTblYFLiqxO4G8dQlyDoVx4VM5+ZSL8zVzrih6M8zz6r9xFO309roqcNGI2Qls37HIP29lZeU0+dgvf/mL3/yDTwB6XsC0yTzJ6lTl873IxOwExMG9BSZ9509n5VLkRzcfyTGVPcInWp2ufL4XnZjFQnH6wxxLmQLZJ1qdpny+l4EKdgI3Nfn+CnNNzpOtTlE+38vCtHYCcjpw24Wz2F+ZEnzC1enK53uZkIuq7uVS5NuXUA9vZV9livBJV6crn+9lQ24jllh/I5+XEt7U6uhf/srJeeLVKcrnexmRy5onLhyauMx36OBCKTasyX0L2UepAG4Adbry+V5mDjj38Lb1bzY2bCbWXyk/ARobbjXWX22cv0x+59ef+hRFURRFURRFURRFURRFURRFURRFURRF2eH/A+7ApknTcb50AAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img1"></image>`,
      };
    },
  });
