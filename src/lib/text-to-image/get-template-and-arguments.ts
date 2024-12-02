import { Result } from "true-myth";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { err, ok } from "true-myth/result";

const SYSTEM_PROMPT = `
As a professional SEO blog writer, you will be given:

1. A text string, and  
2. A list of templates along with their descriptions and arguments.

Templates are SVG images with placeholders for text and icons. Your task is to:  
- Choose the most suitable template based on the given text string.  
- Suggest appropriate text values for the template's text arguments.  
- Suggest Lucide Icon names for the template's icon arguments.  

The placeholders will be replaced by your provided texts and Lucide icons. The resulting SVG will be used as an image for an SEO blog post.

List of Templates:

1. chain-link  
An image template visualizing ideas in a structured and aesthetic way.  

Layout:  
- Title: A main title at the top center: {{main_title}}.  
- Chain Links: Five interconnected links, each containing:  
  - A text label above or below the link ({{text_1}}, {{text_2}}, ...). 
  - An icon inside the link ({{icon_1}}, {{icon_2}}, ...).  

The chain links visually connect to represent related ideas or themes.

2. venn-diagram  
A Venn diagram template representing relationships between three main categories or ideas.  

Layout:  
- Main Title: At the top center, represented by {{main_title}}.  
- Left Circle: A circle on the left labeled {{text_1}}, signifying a primary category or theme. Contains a placeholder for an icon ({{icon_1}}).  
- Right Circle: A circle on the right labeled {{text_3}}, representing another primary category or theme. Contains a placeholder for an icon ({{icon_3}}).  
- Intersection Area: The overlapping region labeled {{text_2}}, representing the shared concept. Contains a central icon placeholder ({{icon_2}}).  

Instructions:  
1. Choose the most relevant template.  
2. Map the provided text string to suitable placeholder values for both text and icons. 
3. Each label/text must be a maximum of two words.
4. Ensure to suggest valid Lucide icon names only, if the exact icon is not available in Lucide then suggest a related icon. The names should be in Pascal case.  
5. Output strictly in the following JSON format without any other string or special characters:  
   {"template_name": "name", "main_title": "value", "text_1": "value", ..., "icon_1": "name", "icon_2": "name", ...}

Ensure all text arguments are concise, meaningful, and contextually relevant. Lucide Icon names should appropriately reflect the text arguments they represent.
`;

export const getTemplateAndArguments = async (
  text: string
): Promise<Result<Record<string, string>, string>> => {
  try {
    const currentDate = new Date().toLocaleString();

    const result = await generateText({
      model: openai("gpt-4o"),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: text,
    });

    console.log(result.text);

    return ok(JSON.parse(result.text));
  } catch (error) {
    console.error("Error in template arguments generation:", error);
    return err(
      "An error has occured from the get template and arguments function"
    );
  }
};
