import { tool } from "ai";
import { z } from "zod";

export const threeElementContributionVisualizationTool = () =>
  tool({
    description: `
      This template represents a 'Three-Element Contribution Visualization' designed to depict three elements contributing to or connecting with a central concept. The layout includes:  
      1. A main header at the top for the overall title, with a sub-header below for additional context.  
      2. A central element at the top center, represented by a text label with an icon above it.  
      3. Three contributing elements symmetrically arranged below the central element in a semicircular layout. Each element is represented by:  
         - A circular icon.  
         - A title text block followed by upto two description lines.  
      4. Light curved connectors visually linking the contributing elements to the central concept.  

      This template is ideal for illustrating frameworks, processes, or strategies where three distinct components connect to or support a central idea.
    `,
    parameters: z.object({
      header: z
        .string()
        .describe(
          "The main title of the three-element contribution visualization."
        ),
      sub_header: z
        .string()
        .describe(
          "The sub-header providing additional context for the visualization."
        ),

      // Central Element
      central_label: z
        .string()
        .describe("The label text representing the central concept."),
      icon_1: z
        .string()
        .describe(
          "The name of the Lucide icon representing the central concept."
        ),

      // Contributing Element 1 (Left)
      title_1: z
        .string()
        .describe("The title for the first contributing element (left)."),
      title_1_desc_line_1: z
        .string()
        .describe(
          "The first description line for the first contributing element."
        ),
      title_1_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the first contributing element (optional)."
        ),
      icon_2: z
        .string()
        .describe(
          "The name of the Lucide icon for the first contributing element."
        ),

      // Contributing Element 2 (Bottom)
      title_2: z
        .string()
        .describe("The title for the second contributing element (bottom)."),
      title_2_desc_line_1: z
        .string()
        .describe(
          "The first description line for the second contributing element."
        ),
      title_2_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the second contributing element (optional)."
        ),
      icon_3: z
        .string()
        .describe(
          "The name of the Lucide icon for the second contributing element."
        ),

      // Contributing Element 3 (Right)
      title_3: z
        .string()
        .describe("The title for the third contributing element (right)."),
      title_3_desc_line_1: z
        .string()
        .describe(
          "The first description line for the third contributing element."
        ),
      title_3_desc_line_2: z
        .string()
        .optional()
        .describe(
          "The second description line for the third contributing element (optional)."
        ),
      icon_4: z
        .string()
        .describe(
          "The name of the Lucide icon for the third contributing element."
        ),
    }),
    execute: async (input) => {
      return {
        title_1_desc_line_2: "",
        title_2_desc_line_2: "",
        title_3_desc_line_2: "",
        ...input,
        template_name: "three-element-contribution-visualization",
        fallback_icon_1: `<path d="M645.525 277.542C608.55 277.542 608.55 277.542 608.55 277.542 608.55 252.419 608.55 252.419 608.55 252.419 662.95 252.419 662.95 252.419 662.95 252.419 662.95 254.974 662.95 254.974 662.95 254.974 663.8 255.826 663.8 255.826 663.8 255.826 664.65 255.826 664.65 254.974 664.65 254.974 664.65 251.568 664.65 251.568 664.65 251.568 664.65 250.716 664.65 250.716 663.8 250.716 607.7 250.716 607.7 250.716 607.7 250.716 606.85 250.716 606 250.716 606 251.568 606 278.819 606 278.819 606 278.819 606 279.671 606.85 279.671 607.7 279.671 645.525 279.671 645.525 279.671 645.525 279.671 646.375 279.671 646.375 279.671 646.375 278.819 646.375 277.542 646.375 277.542 645.525 277.542ZM609.825 247.735C609.825 247.735 611.1 247.735 611.1 246.884 612.8 237.516 612.8 237.516 612.8 237.516 657 247.735 657 247.735 657 247.735 657.85 247.735 657.85 247.735 657.85 247.735 657.85 247.735 658.7 247.735 658.7 246.884 657.85 246.032 657.85 246.032 657.85 246.032 612.8 235.813 612.8 235.813 612.8 235.813 611.95 235.813 611.95 235.813 611.95 235.813 611.95 235.813 611.95 235.813 611.95 236.665 608.975 246.884 608.975 246.884 608.975 246.884 608.975 246.884 608.975 247.735 609.825 247.735ZM623 235.387C625.125 231.555 625.125 231.555 625.125 231.555 651.05 242.626 651.05 242.626 651.05 242.626 652.325 242.626 652.325 242.626 652.325 241.774 653.175 241.774 652.325 240.497 652.325 240.497 625.125 229 625.125 229 625.125 229 623.85 229 623.85 229 623 229.852 621.3 234.11 621.3 234.11 621.3 234.11 621.3 235.387 621.3 235.387 621.3 235.387 622.15 236.239 622.15 235.387 623 235.387ZM653.6 255.826C653.6 254.974 652.75 254.974 652.75 254.974 643.825 254.974 643.825 254.974 643.825 254.974 642.975 254.974 642.975 254.974 642.975 255.826 642.975 256.677 642.975 256.677 643.825 256.677 652.75 256.677 652.75 256.677 652.75 256.677 652.75 256.677 653.6 256.677 653.6 255.826ZM634.9 274.987C640.425 274.987 645.1 270.303 645.1 265.194 645.1 259.658 640.425 254.974 634.9 254.974 629.8 254.974 625.125 259.658 625.125 265.194 625.125 270.303 629.8 274.987 634.9 274.987ZM634.9 256.677C639.575 256.677 643.4 260.51 643.4 265.194 643.4 269.452 639.575 273.284 634.9 273.284 630.65 273.284 626.825 269.452 626.825 265.194 626.825 260.51 630.65 256.677 634.9 256.677ZM662.1 258.381C655.725 258.381 649.35 259.658 649.35 263.065 649.35 290.316 649.35 290.316 649.35 290.316 649.35 293.297 655.725 295 662.1 295 667.625 295 674 293.297 674 290.316 674 263.065 674 263.065 674 263.065 674 259.658 667.625 258.381 662.1 258.381ZM672.3 290.316C672.3 290.316 668.475 292.019 662.1 292.019 654.875 292.019 651.9 290.316 651.05 290.316 651.05 288.613 651.05 288.613 651.05 288.613 653.6 289.465 657.425 290.316 662.1 290.316 665.925 290.316 669.325 289.465 672.3 288.613L672.3 290.316ZM672.3 285.632C672.3 285.632 668.475 287.761 662.1 287.761 654.875 287.761 651.9 285.632 651.05 285.632 651.05 283.929 651.05 283.929 651.05 283.929 653.6 284.781 657.425 285.632 662.1 285.632 665.925 285.632 669.325 284.781 672.3 283.929L672.3 285.632ZM672.3 281.374C672.3 281.374 668.475 283.077 662.1 283.077 654.875 283.077 651.9 281.374 651.05 281.374 651.05 279.671 651.05 279.671 651.05 279.671 653.6 280.523 657.425 281.374 662.1 281.374 665.925 281.374 669.325 280.523 672.3 279.671L672.3 281.374ZM672.3 276.69C672.3 276.69 668.475 278.394 662.1 278.394 654.875 278.394 651.9 276.69 651.05 276.69 651.05 274.987 651.05 274.987 651.05 274.987 653.6 275.839 657.425 276.69 662.1 276.69 665.925 276.69 669.325 275.839 672.3 274.987L672.3 276.69ZM672.3 272.006C672.3 272.006 668.475 274.135 662.1 274.135 654.875 274.135 651.9 272.006 651.05 272.006 651.05 270.303 651.05 270.303 651.05 270.303 653.6 271.155 657.425 272.006 662.1 272.006 665.925 272.006 669.325 271.155 672.3 270.303L672.3 272.006ZM672.3 267.748C672.3 267.748 668.475 269.452 662.1 269.452 654.875 269.452 651.9 267.748 651.05 267.748 651.05 266.045 651.05 266.045 651.05 266.045 653.6 266.897 657.425 267.748 662.1 267.748 665.925 267.748 669.325 266.897 672.3 266.045L672.3 267.748ZM662.1 264.768C654.875 264.768 651.9 263.065 651.05 263.065 651.9 262.213 654.875 260.51 662.1 260.51 668.475 260.51 672.3 262.213 672.3 263.065 672.3 263.065 668.475 264.768 662.1 264.768ZM617.9 256.677C625.975 256.677 625.975 256.677 625.975 256.677 625.975 256.677 626.825 256.677 626.825 255.826 626.825 254.974 625.975 254.974 625.975 254.974 617.05 254.974 617.05 254.974 617.05 254.974 617.05 254.974 617.05 254.974 615.775 254.974 611.525 260.51 611.525 260.51 611.525 260.51 611.525 260.51 610.675 260.51 610.675 261.361 610.675 269.452 610.675 269.452 610.675 269.452 611.525 269.452 611.525 269.452 611.525 269.452 615.775 274.987 615.775 274.987 615.775 274.987 615.775 274.987 615.775 274.987 617.05 274.987 625.975 274.987 625.975 274.987 625.975 274.987 625.975 274.987 626.825 274.987 626.825 274.135 626.825 273.284 625.975 273.284 625.975 273.284 617.05 273.284 617.05 273.284 617.05 273.284 613.225 268.6 613.225 268.6 613.225 268.6 613.225 261.361 613.225 261.361 613.225 261.361 617.9 256.677 617.9 256.677 617.9 256.677ZM632.35 266.897C631.5 266.897 631.5 266.897 631.5 267.748 631.5 268.6 631.5 268.6 632.35 268.6 633.2 268.6 633.2 268.6 633.2 268.6 633.2 269.452 634.05 270.303 634.9 270.303 634.9 270.303 635.75 269.452 635.75 268.6 637.025 268.6 637.875 267.748 637.875 266.897 637.875 265.194 637.025 264.342 634.9 264.342 634.05 264.342 634.05 264.342 634.05 264.342 634.05 264.342 633.2 264.342 633.2 263.065 634.05 263.065 634.05 263.065 634.05 263.065 637.025 263.065 637.025 263.065 637.025 263.065 637.875 263.065 637.875 263.065 637.875 262.213 637.875 261.361 637.875 261.361 637.025 261.361 635.75 261.361 635.75 261.361 635.75 261.361 635.75 260.51 634.9 259.658 634.9 259.658 634.05 259.658 633.2 260.51 633.2 261.361 632.35 261.361 631.5 262.213 631.5 263.065 631.5 265.194 632.35 266.045 634.05 266.045 634.9 266.045 634.9 266.045 634.9 266.045 635.75 266.045 635.75 266.897 635.75 266.897 635.75 266.897 635.75 266.897 634.9 266.897 632.35 266.897 632.35 266.897 632.35 266.897Z" fill="#7F7F7F" fill-rule="evenodd"/>`,
        fallback_icon_2: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK+UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9HSApAAAADqdFJOUwBs7f/nWCxZVRYo/vnj/PgTZO4pT5axNXkV246IsJExhWMEk64f3uv990LwrwYb363sew2q+oIClalICzhLfaXB0tjUxauGkHIBJTkXBbg7K0XWtXSkbUMkEg8gPLJavA5N+82s5RpJ9S8/lAfmYKOh3OkK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" preserveAspectRatio="none" id="img1"></image>`,
        fallback_icon_3: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ2UExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yo3L/gAAADSdFJOUwABLBYDSiUUft//4Qpw0mQFAvP98LFU9NMrI5Ag7nMdg5ni/gugtkiybOUOtW0Gp5pfqc4RS2VcL4FaUociOBuh+NlbD/KvkSg87K2M16IEFYjA+2bL8ZRP6Zecpm/Dhe9BNPa92jpot5I1k3UJ+nb1eb5Dxi3nTO356y4w9x+fmw2GwUnd3I7VRqoQqwgTEsrYJGB96B49YbA/MlCEeCcaqHG4ndZ624lYggw2HLRyWZXIVVe7pH93awdiMUdE1GMzQPyYyea6OeDjrsQYXXvFwgbr9GoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQVSURBVFhH1ZfrWxRlGMbvReRw71ouu8aGUcAShWGmeErBIoeD1bqoJJZJiC2CtooGFHgsbOUQUepmmSFgltjBzpZSkZRpJ/U/6prdmd2Z1xlguPzS78s8h3vua96ZnWfeBcbDljANQOL0JLExOZJTUml3ADPIO+6cKXYnxJmSRpebs5LuSne5SM/domAiMuiafU9CJknee19WGrNFwYTkeHOBjPs9eQ8AeJD5Yn8iEufwoXhWwLna5kQ8PO+R+QtYCGDhosVLltqAR5mzbHlRsSg0I0VeefoKPPZ4iRw9sRLJqXKQJwpNkEo5r6y8AqueZOlTT2f7yNX+yjVr89ZxhSg1porPyIeK9ayW5GDDs3xOPm7k86LUmFncJB9q+IJSqKjlZgB13JKrV5rwIgPFQD19frWylQ2As5HcpleaIG1noRNFfClWCabvcGAnm3Yl6oTm7GY9yvhyvNDMFrTyFa1GR/3uV91a2tjkXse0eEFOyPWxvL1gj/b8vfvkp2yN2v0agwM8GNSkk+C1Mr6uSTu4V5NNikNcoMlq2AIEa97QE9K+P4dDi4FNoSygpbMmCHSxWzTocYvLnK2RNLAIqOabwGZXbY+hAXrf0tNn00gS++QZ2eeU198LYwNLiAaety3yDst0BlOgQWew6IhFjt7ue/B/MDgWflebGhkcz9fznu57+D5PaFMjg1bxQXVFmvmhD+SDYnAi9aipwckP9fRHX/FjbD8FYEbnAIAEt/KJMjIwwTnIbti2VQ0tyQBO86No1YIB/Dvrpp+JrKmjbtWQMqmtGAAfe/lJ9tnBWrYNqyUjg7UuPaUJGDg3XAwMs6RKfo8/beSOzzDzeH/154YGX8SHcIQ5FThP8lwwzC8V4WE24yuSw4YGBuRWHfj6m2/ZoebBMCtWfrfmkHOyBhEao5/KCBs5PxpYMfiey2PxBZ6PBkYGXT/o+fFitFvOrTHldl6KBkYGJj9lDLNAFToDHIlGRgY/7dIzV7kCR7v3Z0U4xF+UUW1kYMooM3+NBJdcXuWqrBmgnK3ypvnymDf2PIwMbEE98XFgG+RvgPMML8RKRga/C/ewZGlMMG1fkwOXGYjteQwNuq/oCRyJK/7ghoGzzIoXjAzGY3XkmkbjBasGyzp9Pl+hZstv1eAWbqOBX5KkZl6VRHrkXYBCUGxK0kmWSZLkB5zXhIcXo1beUkSoLBV7Ktec6OWY3W7Psd/CGJNVg1NsE7t2u/tPWdOLXoZjV6ojlZVquIfN+p5KeDyDv3hamQv9f7Na7EYZ1yDpSnypgX/EbhTZwO/NFMsKC0fVwfCv2b+ETK8fCKkzxjojDAG4To9222yB/R5eB3DxBttuNkyBm228ERl6ueVN2t/G5NnSqN4bx8jVKTDikM/9D4Xd1U40h0UnAAAAAElFTkSuQmCC" preserveAspectRatio="none" id="img2"></image>`,
        fallback_icon_4: `<image width="64" height="64" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKCUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3GMjQ0AAADWdFJOUwAKbsXy//Mne/7404caM97v3x9n6Fst8a4xHIj7XQPRgUj69B1QwQGEjZ1TF/3awg/gBMoWYflg1wnkDOOiVzm5i6poRpviQKsOCDBeS0I9EIX2b/A+BSAU0O2YIZacn6wpGTWz903uxL/J5yR3BiPD5p5+3elw5ZpDB9S3P2NJIpkCxs1xT1rcGM71kfxzl62UKBt5k5BRgHTWuH1ELsAlsHJrE9t4OCYSyIJtfGpBpcySu4we6kW67DdSo89KLFWD2KRMNAuP0n8q62RZVoqxVGli4XX7Jc1zAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEn0lEQVRYR52X/V8URRzHh+QD7gHCJT4BQXcmF+jBiXEg4BOBPPhQ3iHqCWgPB2aCmolghyh6diV4eRWUz4rhE1pqVj6gmZWWPVjp/9NrZ3ePmbkH7nz/sq/vZ+beuzs7M3tLSDhinhsXC5a4eELIeAnQJSQmib0DmZAMpOhZEp4nhExM1utTgbhJYn+RyVMwdZoYaqSlZ0gviCFPZhZeFDMWg3H6S2LGMQPZJjHjeBk5YsSRi5lixDPLnCdGHPmQR4zDYuHK2eYCrhaYg1eEpNBqLWLrYsxlS5FAQUmGMaWUqaMVFBjL5mE+E0QrWICFk7CICaIVlOPVClQyQZSCQiyOKUIik0QnqDAaq0g1ZjBRhIIai8ViqV0SKy0lSUbrsuXLq157XekRmWAFXce2VIwnxK6u6rqVtAcjqE9bJbJaFZQjb80aB7CWENLQWNmUm7tuPebwgjfKbdy2oSDhTUXwFiHr8DY7a52pnKDZhpYN74hkmbFRvldVUMX8njjfZQWbpptb29hmlc1bMDWEQLeVHlTBe9jGNo5S+j4mBBdYOcF2HbtAWNpldVDBDnpQBG0IuS1UoCO4wMgK5qKYbWPpRFMEgp3SB6MtS12lpCu7Qa1CCrhbILu6R1vysZvswTK1YgUr2A3WyQ0ii8PWQ7Zgs1qpgr0uVwmwz72/WeVDs4e2Bwo+wseEOA70qCUV9NJp2ZfFzdKDtJ0XFHm93k+g9zahzus9tMkvKIj3+Xy+T00LPuv9XKV/QPlJMWrlwxeFtJrNneJLvyAM23XywNTiMK0aDAbDERw1dKDSYDhG5/YYguPYKB/YeXACJ4kX+7VyDMEptMsHTbDSbre3SKftxUi32wfPyFFYQeYifEXHUBOUcGMwJEedSG09Kw+hyjnl8Zz3+XzTdu2D4zgtNUGX270HF9wXoXe73cPqFQhcktP56p+WcSeVS2HG4DIuka/xjVaSThw5Wu3ycwWNhLRdRd81l+vUt/65zQgOYYAMypunX8CNQTcayfUL+O57NuQEPyCe9EKdJVTAvodkQfcNbEhjM14wkGgiNxtHt5cAQZlZyqlnI5nacPtBB1t2A3W32EDBZHNoi4fl2MLUljjoWlQW3z5HzmKELhGRa2gWI0IuS3DWMWQg9iaZTNdOAHew9a6YrbLafuSuK+Yefgp2oZSr0N0/aNf4WY5ycFHslY1fxEjD5K5jZptUQ369DwSMVv/oIguktHnYrVKGM/EJAPc/gPIgMArKFUycAtc82nt17o68obX6h6flu49cAPNvPbR3/QisZsAM9EcluGFQe8/EidK7sSOW3x/1zYpcMOS6rp1uG/4gJKmGkNvoIuRPj/yxESlUMKw9y2woW0cUUMHujBSfXPwFT8g5FArlhu/hUTPJHMroqxDbx0QRmP6W8HgEB/6hWVRXoQ35nWQgn94H+de5ROgUDv8zqx28pb6WI32MCjmBa6E33FoIoB3pYrQXIT8Bg5Dm1P23kw3OP8DD8N9wAkV9kMwUW5fJbTMDjmjGUP48We95IpOCoWronhz2yjP8WXgKIzxRnpzjKfBY/Tx4NrpjW8MO3v+86EtbidpdgAAAAABJRU5ErkJggg==" preserveAspectRatio="none" id="img3"></image>`,
      };
    },
  });
