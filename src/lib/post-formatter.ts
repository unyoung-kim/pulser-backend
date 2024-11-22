import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Result, err, ok } from "true-myth/result";

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given:
1. An SEO blog post as text.
2. A 'format' (HTML, Markdown, None, etc).

Your task is to format the given blog post in the specified format without losing or changing any content. 

Please ensure:
- Images are resized appropriately and maintain aspect ratio. Use a maximum width of 100% for responsiveness.
- Paragraphs are properly spaced and easy to read.
- Headings and subheadings are clearly defined with appropriate tags.
- Lists are formatted as ordered or unordered lists where applicable.
- Maintain a consistent structure throughout the document.
- Don't provide heading/title in the output, just the body.
- Links are properly formatted with the <a> tag.
Just output the formatted result without any new lines or other special characters.
`;

// Removed the below line corresponding to table of content from prompt
// - Include a table of contents (using the <ul> tag) with corresponding headers (using <h3> tags) placed in the top section, just below the main image. Ensure that the table of contents does not repeat numbering if sections or subsections are already numbered. Instead, use appropriate nested lists for subsections and apply correct numbering where necessary. Avoid using bullet points (•) in sections that have numbered items.

export async function postFormatter(
  post: string,
  format: string
): Promise<Result<string, string>> {
  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      temperature: 0,
      maxTokens: 8000,
      system: SYSTEM_PROMPT,
      prompt: `Post: ${post}\nFormat: ${format}`,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in formatter: " + error);
    return err("An error has occured from the formatter");
  }
}
