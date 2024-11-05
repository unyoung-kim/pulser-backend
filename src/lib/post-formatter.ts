import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Result, err, ok } from "true-myth/result";

const SYSTEM_PROMPT= `As a professional SEO blog writer, you will be given:
1. An SEO blog post as text.
2. A 'format' (HTML, Markdown, None, etc).
Your task is to format the given blog post in the specified format. 
Please ensure:
- Images and videos are resized appropriately and maintain aspect ratio. Use a maximum width of 100% for responsiveness.
- Paragraphs are properly spaced and easy to read.
- Headings and subheadings are clearly defined with appropriate tags, but **do not include the main header of the post (e.g., the <h1> tag)**.
- Lists are formatted as ordered or unordered lists where applicable.
- Maintain a consistent structure throughout the document.
- Don't provide heading/title in the output, just the body.
- Include a table of content, along with the corresponding text in the header (using <h3> tag), in the top section just below the main image.
- Ensure that videos are embedded correctly in the output format.`;

export async function postFormatter(post: string, format: string): Promise<Result<string,string>>{

    try{
        const result = await generateText({
            model: openai("gpt-4o-mini"),
            maxTokens: 8000,
            system: SYSTEM_PROMPT,
            prompt: `Post: ${post}\nFormat: ${format}`,
        })

        return ok(result.text)
    }
    catch(error){
        console.error('Error in formatter: '+ error);
        return err("An error has occured from the formatter")
    }


}