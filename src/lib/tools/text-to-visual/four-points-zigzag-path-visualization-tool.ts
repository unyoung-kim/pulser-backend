import { tool } from "ai";
import { z } from "zod";

export const fourPointsZigzagPathVisualizationTool = () =>
  tool({
    description: `
    This template represents a 'Four-Points Zigzag Path Visualization' designed to showcase a sequential process or timeline along a dynamic path. The layout includes:  
    1. A main header at the top for the overall title, with a sub-header below for additional context.  
    2. Four circular nodes arranged along a zigzagging line to indicate progression. Each node contains:  
      - An icon to represent the stage or step.  
      - A text block below the node, including:  
        - A title summarizing the stage.  
        - A brief description providing additional details.  
    3. The connecting zigzag line dips downward for the second node and then rises upward toward the third and fourth nodes, creating a visually dynamic progression.  

    This template is ideal for illustrating processes, timelines, or workflows with distinct steps arranged along a path that emphasizes variation in progression.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe("The main title of the linear milestone diagram."),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Milestone 1
      title_1: z.string().describe("The title for the first milestone."),
      title_1_desc_line_1: z
        .string()
        .describe("The first line of description for the first milestone."),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the first milestone."),
      title_1_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the first milestone."),
      title_1_desc_line_4: z
        .string()
        .optional()
        .describe("The fourth line of description for the first milestone."),
      icon_1: z
        .string()
        .describe("The name of the Lucide icon for the first milestone."),

      // Milestone 2
      title_2: z.string().describe("The title for the second milestone."),
      title_2_desc_line_1: z
        .string()
        .describe("The first line of description for the second milestone."),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the second milestone."),
      title_2_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the second milestone."),
      title_2_desc_line_4: z
        .string()
        .optional()
        .describe("The fourth line of description for the second milestone."),
      icon_2: z
        .string()
        .describe("The name of the Lucide icon for the second milestone."),

      // Milestone 3
      title_3: z.string().describe("The title for the third milestone."),
      title_3_desc_line_1: z
        .string()
        .describe("The first line of description for the third milestone."),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the third milestone."),
      title_3_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the third milestone."),
      title_3_desc_line_4: z
        .string()
        .optional()
        .describe("The fourth line of description for the third milestone."),
      icon_3: z
        .string()
        .describe("The name of the Lucide icon for the third milestone."),

      // Milestone 4
      title_4: z.string().describe("The title for the fourth milestone."),
      title_4_desc_line_1: z
        .string()
        .describe("The first line of description for the fourth milestone."),
      title_4_desc_line_2: z
        .string()
        .optional()
        .describe("The second line of description for the fourth milestone."),
      title_4_desc_line_3: z
        .string()
        .optional()
        .describe("The third line of description for the fourth milestone."),
      title_4_desc_line_4: z
        .string()
        .optional()
        .describe("The fourth line of description for the fourth milestone."),
      icon_4: z
        .string()
        .describe("The name of the Lucide icon for the fourth milestone."),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_1_desc_line_3: "",
        title_1_desc_line_4: "",
        title_2_desc_line_2: "",
        title_2_desc_line_3: "",
        title_2_desc_line_4: "",
        title_3_desc_line_2: "",
        title_3_desc_line_3: "",
        title_3_desc_line_4: "",
        title_4_desc_line_2: "",
        title_4_desc_line_3: "",
        title_4_desc_line_4: "",
        ...input,
        template_name: "four-points-zigzag-path-visualization",
        fallback_icon_1: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKRUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0QSC70AAADbdFJOUwAOHhcVCgaf/P/QJzvS3SJ46cTWy/TX4yO2NAHeC5iD8OEgug/BqMOg3Bu1CQLZGXyIfgxrUeBBSNRMWVAD0RPOEhAkociRuMUNKOXsTaTY/fK8Jeo+N0I2OKWZ/pKTRZ5hsQTbM+cyXrRurgfkL1u5aayqlXWHqe4uBVirJjUd0y1xd4HamoLV6CxTKettShTvWpQfY4VA9q/MfbJVbAhE+zzNXImKt8l2TvffnEdzZBwwcPONkIxLv8e++vX4P8YRZ/loGH8qORqOeWJPynqjp0OirYuXPcBgMYM/hy8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUSSURBVFhH3Zf7XxRVGIdfVlC+AYJc3GJdW6EWKxY0kouwCSgYQrrEgqKbWQiomElcRNTV0ChQSFASoULURMOS8FJKFwELumf3+mv6vGd2dmaHhcD6qeeXc973zDycOe/O4QzRf4SPTqfTzVJiX4694ae+y83sOf5g7guQ4sAgEXpjbrD2ZiYE80JDQ0PDEC7CgAjM59gL/tDfr72biB5AJDeGBTByuxAPaq+QMQGLorRJomhIcw/CQ9w8DK/zZEwwY4FOm9UKYjDxEhcmGBfjkUe16Wg8ZmZM0xDEWhYjLl6TjnYvsiLwW7JUw+MJQkCWxQhTVVwSPLGMSVQJkjyqJ0iWBGxI8dUIJq6BYXmqhjSrS8CGJ1f8k8A7koAN6Rmq9IwFbAjPVNLTFyRipdSxrkKWjzs9fUE2VruWz7oKT+XIaW+CNbkmU97TRGtNMvMCiTLWweYK84FnphIU6LUCeyERZWQnuhP+mD2FYBrE/O8FRetVbCCizCQlTuIKqgUTX6ZCzxepmGijOt7kIVgtpx0JboHPs3NUbPYhek4Vb+GSKoLnkZednZ0dhBdEOPM1KNnqKCWKLXOUuwZmKqBt2E60AxXywIwF1jgU7XzRsUsemLGAXsLuSrzsHuA9cVOVYGMB7ayWukwNEdVWVe1J0gisYaiz7VULChyuyqRSsE0p3wKi+ggA1RoB7QP2y33pEQ44BWwtkLoMb8cHnc5I3pg8BJZDtleIfBoOHz5cdC9rQKTjpzrCs3z13gSCMDS+9jqa7kHQfNRKRMfQUk+tAHRkWP6GGIj19cpxjcDZhvnt1tgT/I7oHMDJtHQ4OojIr04pgAdvegicbchyIK4FOEVE4YAeKOu0tROVnO7ySni7WpBQh24q3w7bW29zGLC0DIve6TnT2XtWnqF33IJ6PUqJqHyNPOKXzCPnIHyTozyC+zVSk4w4XtgpUASxTbZmzSBRKM5rUxpUVXgXF0Sb1mc3XWzo4e5K5EoTyLnULRBlfU/qdy/hTVQlSIeTj4t7gP58IIV/R7MvO46JsWWuwl3mIFcu4/sqQcb5/ejiTiPWfWClvbuRwnMIwaErfFqrTx0Q8J+gIqk/0PGhW1ByuhfQHyWiQYde/OcticZVfue2AugKlCfpBUmgw7XqQgvHtWiVBnbhIjeGDddzccPzHg9kQYwrrpDOq0SUb3J1Kqcl6CqRYjN4s+dn6Le7LmmdhiAeaFl4ip+hBh9JAx+jj5uTV2/2opYCbqWrGMqg9eHp6ef2KVU43/cJcIJVn372OSfi5yKNiIptcNy+kklnpU8BF/1R1MFtrfp3MLwtP48LN4LR64XOhjLs4ewNbJbOxMZhFbwX+gwPixOa6ofUiBFuRni/haOR88fzI9QnQW+oBEdwR7Rf1JgragdFN6q3TjnGeUcRZLY1TfwWWosQbUqDIvgSlzRjRDRms/sRBY+Pj38lYotzXKGY18wtiG1DAdHBr7+RD6+RR/jtvo1vKWcUQJNIDqiLIcrmFliGEDbeOAp0buHfw3ffA7aK0m7UNZPhgtls/kFcdeBH8VEicfcnj0cw3gTQ+/MvvbypWvSw/WoHYJdWc3JUVTAOjTYGE93Bb0S/AzhjrLHnjnlePpFbqHf3raJks/ztJVSNLNwl6pHO9VMwOJqoTdEf6Aq91jlmm/TDU0XWKHZo76dKXuAq+rPNY8UnobPboL2fDH85nU4jUc+gciKYjHJxJPzX/A0BUoGd7pj+4wAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKCUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3GMjQ0AAADWdFJOUwAKbsXy//Mne/7404caM97v3x9n6Fst8a4xHIj7XQPRgUj69B1QwQGEjZ1TF/3awg/gBMoWYflg1wnkDOOiVzm5i6poRpviQKsOCDBeS0I9EIX2b/A+BSAU0O2YIZacn6wpGTWz903uxL/J5yR3BiPD5p5+3elw5ZpDB9S3P2NJIpkCxs1xT1rcGM71kfxzl62UKBt5k5BRgHTWuH1ELsAlsHJrE9t4OCYSyIJtfGpBpcySu4we6kW67DdSo89KLFWD2KRMNAuP0n8q62RZVoqxVGli4XX7Jc1zAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEn0lEQVRYR52X/V8URRzHh+QD7gHCJT4BQXcmF+jBiXEg4BOBPPhQ3iHqCWgPB2aCmolghyh6diV4eRWUz4rhE1pqVj6gmZWWPVjp/9NrZ3ePmbkH7nz/sq/vZ+beuzs7M3tLSDhinhsXC5a4eELIeAnQJSQmib0DmZAMpOhZEp4nhExM1utTgbhJYn+RyVMwdZoYaqSlZ0gviCFPZhZeFDMWg3H6S2LGMQPZJjHjeBk5YsSRi5lixDPLnCdGHPmQR4zDYuHK2eYCrhaYg1eEpNBqLWLrYsxlS5FAQUmGMaWUqaMVFBjL5mE+E0QrWICFk7CICaIVlOPVClQyQZSCQiyOKUIik0QnqDAaq0g1ZjBRhIIai8ViqV0SKy0lSUbrsuXLq157XekRmWAFXce2VIwnxK6u6rqVtAcjqE9bJbJaFZQjb80aB7CWENLQWNmUm7tuPebwgjfKbdy2oSDhTUXwFiHr8DY7a52pnKDZhpYN74hkmbFRvldVUMX8njjfZQWbpptb29hmlc1bMDWEQLeVHlTBe9jGNo5S+j4mBBdYOcF2HbtAWNpldVDBDnpQBG0IuS1UoCO4wMgK5qKYbWPpRFMEgp3SB6MtS12lpCu7Qa1CCrhbILu6R1vysZvswTK1YgUr2A3WyQ0ii8PWQ7Zgs1qpgr0uVwmwz72/WeVDs4e2Bwo+wseEOA70qCUV9NJp2ZfFzdKDtJ0XFHm93k+g9zahzus9tMkvKIj3+Xy+T00LPuv9XKV/QPlJMWrlwxeFtJrNneJLvyAM23XywNTiMK0aDAbDERw1dKDSYDhG5/YYguPYKB/YeXACJ4kX+7VyDMEptMsHTbDSbre3SKftxUi32wfPyFFYQeYifEXHUBOUcGMwJEedSG09Kw+hyjnl8Zz3+XzTdu2D4zgtNUGX270HF9wXoXe73cPqFQhcktP56p+WcSeVS2HG4DIuka/xjVaSThw5Wu3ycwWNhLRdRd81l+vUt/65zQgOYYAMypunX8CNQTcayfUL+O57NuQEPyCe9EKdJVTAvodkQfcNbEhjM14wkGgiNxtHt5cAQZlZyqlnI5nacPtBB1t2A3W32EDBZHNoi4fl2MLUljjoWlQW3z5HzmKELhGRa2gWI0IuS3DWMWQg9iaZTNdOAHew9a6YrbLafuSuK+Yefgp2oZSr0N0/aNf4WY5ycFHslY1fxEjD5K5jZptUQ369DwSMVv/oIguktHnYrVKGM/EJAPc/gPIgMArKFUycAtc82nt17o68obX6h6flu49cAPNvPbR3/QisZsAM9EcluGFQe8/EidK7sSOW3x/1zYpcMOS6rp1uG/4gJKmGkNvoIuRPj/yxESlUMKw9y2woW0cUUMHujBSfXPwFT8g5FArlhu/hUTPJHMroqxDbx0QRmP6W8HgEB/6hWVRXoQ35nWQgn94H+de5ROgUDv8zqx28pb6WI32MCjmBa6E33FoIoB3pYrQXIT8Bg5Dm1P23kw3OP8DD8N9wAkV9kMwUW5fJbTMDjmjGUP48We95IpOCoWronhz2yjP8WXgKIzxRnpzjKfBY/Tx4NrpjW8MO3v+86EtbidpdgAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ2UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yo3L/gAAADSdFJOUwABLBYDSiUUft//4Qpw0mQFAvP98LFU9NMrI5Ag7nMdg5ni/gugtkiybOUOtW0Gp5pfqc4RS2VcL4FaUociOBuh+NlbD/KvkSg87K2M16IEFYjA+2bL8ZRP6Zecpm/Dhe9BNPa92jpot5I1k3UJ+nb1eb5Dxi3nTO356y4w9x+fmw2GwUnd3I7VRqoQqwgTEsrYJGB96B49YbA/MlCEeCcaqHG4ndZ624lYggw2HLRyWZXIVVe7pH93awdiMUdE1GMzQPyYyea6OeDjrsQYXXvFwgbr9GoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQVSURBVFhH1ZfrWxRlGMbvReRw71ouu8aGUcAShWGmeErBIoeD1bqoJJZJiC2CtooGFHgsbOUQUepmmSFgltjBzpZSkZRpJ/U/6prdmd2Z1xlguPzS78s8h3vua96ZnWfeBcbDljANQOL0JLExOZJTUml3ADPIO+6cKXYnxJmSRpebs5LuSne5SM/domAiMuiafU9CJknee19WGrNFwYTkeHOBjPs9eQ8AeJD5Yn8iEufwoXhWwLna5kQ8PO+R+QtYCGDhosVLltqAR5mzbHlRsSg0I0VeefoKPPZ4iRw9sRLJqXKQJwpNkEo5r6y8AqueZOlTT2f7yNX+yjVr89ZxhSg1porPyIeK9ayW5GDDs3xOPm7k86LUmFncJB9q+IJSqKjlZgB13JKrV5rwIgPFQD19frWylQ2As5HcpleaIG1noRNFfClWCabvcGAnm3Yl6oTm7GY9yvhyvNDMFrTyFa1GR/3uV91a2tjkXse0eEFOyPWxvL1gj/b8vfvkp2yN2v0agwM8GNSkk+C1Mr6uSTu4V5NNikNcoMlq2AIEa97QE9K+P4dDi4FNoSygpbMmCHSxWzTocYvLnK2RNLAIqOabwGZXbY+hAXrf0tNn00gS++QZ2eeU198LYwNLiAaety3yDst0BlOgQWew6IhFjt7ue/B/MDgWflebGhkcz9fznu57+D5PaFMjg1bxQXVFmvmhD+SDYnAi9aipwckP9fRHX/FjbD8FYEbnAIAEt/KJMjIwwTnIbti2VQ0tyQBO86No1YIB/Dvrpp+JrKmjbtWQMqmtGAAfe/lJ9tnBWrYNqyUjg7UuPaUJGDg3XAwMs6RKfo8/beSOzzDzeH/154YGX8SHcIQ5FThP8lwwzC8V4WE24yuSw4YGBuRWHfj6m2/ZoebBMCtWfrfmkHOyBhEao5/KCBs5PxpYMfiey2PxBZ6PBkYGXT/o+fFitFvOrTHldl6KBkYGJj9lDLNAFToDHIlGRgY/7dIzV7kCR7v3Z0U4xF+UUW1kYMooM3+NBJdcXuWqrBmgnK3ypvnymDf2PIwMbEE98XFgG+RvgPMML8RKRga/C/ewZGlMMG1fkwOXGYjteQwNuq/oCRyJK/7ghoGzzIoXjAzGY3XkmkbjBasGyzp9Pl+hZstv1eAWbqOBX5KkZl6VRHrkXYBCUGxK0kmWSZLkB5zXhIcXo1beUkSoLBV7Ktec6OWY3W7Psd/CGJNVg1NsE7t2u/tPWdOLXoZjV6ojlZVquIfN+p5KeDyDv3hamQv9f7Na7EYZ1yDpSnypgX/EbhTZwO/NFMsKC0fVwfCv2b+ETK8fCKkzxjojDAG4To9222yB/R5eB3DxBttuNkyBm228ERl6ueVN2t/G5NnSqN4bx8jVKTDikM/9D4Xd1U40h0UnAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img3"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKUUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yI0OoQAAADcdFJOUwAQT29zbhENkvf/kw4Y1fCdcmwCxbUTtMRbyQYDVSV7JFZrWrpBL/iWlAT5Le7zUDwXXz30/uDGj4LXx+MaCN8rMygUARxjn9HNmRUMZ+rKq6y3/LyAnkwbU6/lcWDpomiImv1NH9oeKrA45tbo+hJJ2CeYYTBmjaezpYkpeLLtOfttO0I0v4MsJu8jZHzkf90Fy+t2whapfiLcINte7N6qGfaooIUHtsyHCUO+MXSV8fXnYtlS0j8yPkZZXHV9oTYL1FTTS/KmRK2bhuGj0IvOUSHiCg+9apy5gXD4WPa7AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEWUlEQVRYR+2X+VtUVRjHX0YR5pvKMqHAjCaLjQpDjDCQgcgypsSqBI0auNxCBpWR0iIRkLJMxRJFS8oQaGUpLNMy27R9tcVs+Wd6zr0z99x7ZGYc+qXnqc8v73m/532/85x779x7DtH/yIQZpk0PmXDDDG97RKQRU8J4y0zWP2s2oqJjYkMmJjoKs2cRmW5F3Bz9im6WOXMRb6IEJJrJEjuPaP5tC4iSki1inX/MiUihVCwkuh1WEy3CYlqShnSxLAALkUq2DBMR3ZFJZF9qJ8oyiEWBsGTbyJEjqqGQ4yBYc0PiTqJlPLOCxJsbjLuI8rQ5IX95SBQQmXmWD8IKcV2hkBPYwGQvLCoqLnGKOieAwcq7V622KsvMLr0noUycV/BnUF6R6wBQWRVXvWZtqQ1Azb0JZrHKr8HMWtZSd5/6q6516wFsuL9AX+fHwFnfgLSNa7BJK27GlvUSVjyg1RiTGNjXQlr1IGUhVas2OrZSkxvYGKFVJzNo3obtzewG7GjxcDUdVSzszEfrQ5riSQwMRmxRVvowdu1+5NG2uY/taa/fW4sOWZzRia592nrRYF239Lh3WAGJP68SdiqqqR0ZT2gaBIP9aTUJyujJVKDlqQNJ+55Oz0poz5MgVR9UZjpwqJB36A0Od6FHGR2R0JisuQbLO55B2rNL5PEBHOUzOoPeY2j3Dt3He4Q3W0FfNk6cZCPnc3Crss7gecTLXS4XWSZ56k5Vof8FNih/Ead9otbgsBG2JCJqemlAbdJRcAYDg0TO2CFUhnk1rcEw8iS8HOEZwCuaLi2WNiS+an8Naa/jDa+kMSiWto2M5uPoGIb9/n3NJ9DZgO3jg0MZ3uuoMViEN4k81UB/ua5Jh6sLjrdGiBajTxG4wcjEWbau3rcxqu/R8w5KWSh2nFNybvAu2lg4jTht/Q2YzuMCi3l4T865QR3mKRPv6xpkLkZ/oI4vYZiFD/GRnHKDAYl97U+hVS314fkYwCe+rODQ0KfEvoVjcqoalOAyC8k33sIrO7DhM/A3yR58zpbyxQT7InKDC/hSmf2KtzIGv4bjm7DVGFSVHnzLQi62sqAaLMUyFs5Dt1WwTLMBlZfKa77jWhE6WfheuZiqQR+SWYiK4pVEpmpIl88BYzjDRQ9+YOFH5aKrBrW46na73Y5+Xkm0CY2FRJkNwHQuOrvPsspW1LNMNWgeUl49m3klW9A4Cz8BmRq1Tans+pkl/DaWjTPmawrJIv0iR7PU8qtGdjaxyt3X5ET3PhBxWo/Lf6trvud2EgIa0G9g7wfqQ7Q4oxLYYNSRff2k60i3ca84oxLYgMJr2OUauiLqnCAGNP771WORC0RVQzCDoPwrDP7xRtOWEcLuWoRtdeXN9lTZjz8ohW33p4i5CilkikdciThzc5TIBw525Jmo8x55rpdR7y7xbOOHmDrlyKM/dP1JF9VxUIyRvi1XmCFcOcr9ZSdzhXi+80O4wfeJ/s/zN4gGEe5L2ZkZAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img4"></image>`,
      };
    },
  });
