import { Result, ok, err } from "true-myth/result";
import { generateText } from "ai";
import { docs_v1 } from "googleapis";
import { getThrottledGPToMini } from "../get-llm-models.js";

const SYSTEM_PROMPT = `You are an expert in converting HTML content into Google Docs API-compatible batch update requests.

Given:
1. HTML content as input.
2. The structure and style defined by Google Docs (e.g., paragraphs, headings, bold, italics, lists, and images).

Your task is to:
- Parse the HTML content.
- Generate a JSON array of requests compatible with the Google Docs API for batch updates.
- Use appropriate elements such as 'insertText', 'insertInlineImage', and 'updateParagraphStyle'.

Guidelines:
- Map HTML tags like <h1>, <h2>, <p>, <b>, <i>, <ul>, <li>, <img> to their respective Google Docs API equivalents.
- Retain all formatting (e.g., bold, italics, and headings) from the HTML input.
- For images:
  - If the <img> tag lacks a valid 'src' URL, replace it with a placeholder image or skip the image.
  - Ensure images include a valid 'sourceUri' or a placeholder like "https://design102.blog.gov.uk/wp-content/uploads/sites/163/2022/01/D102-Blog-post_Alt-text_main-image.png" for testing.
- Maintain consistent styling and formatting.
- Use the "index" field to specify the insertion point. Start at 1 (just after the document start) and increment based on the length of the inserted text or the content's position.
- For each element (paragraph, heading, image, etc.), calculate and update the "index" accordingly to maintain proper order.
- Output strictly in the format: [{object_1}, {object_2}, ...].

Examples:
1. **Simple Paragraphs**:
   HTML:
   <p>This is a paragraph.</p>
   Output:
   [
     {
       "insertText": {
         "location": { "index": 1 },
         "text": "This is a paragraph.\\n"
       }
     }
   ]
2. **Headings (H1 and H2)**:
   HTML:
   <h1>Main Heading</h1>
   <h2>Subheading</h2>
   Output:
   [
     {
       "insertText": {
         "location": { "index": 1 },
         "text": "Main Heading\\n"
       }
     },
     {
       "updateParagraphStyle": {
         "range": {
           "startIndex": 1,
           "endIndex": 13
         },
         "paragraphStyle": {
           "namedStyleType": "HEADING_1"
         },
         "fields": "namedStyleType"
       }
     },
     {
       "insertText": {
         "location": { "index": 13 },
         "text": "Subheading\\n"
       }
     },
     {
       "updateParagraphStyle": {
         "range": {
           "startIndex": 13,
           "endIndex": 24
         },
         "paragraphStyle": {
           "namedStyleType": "HEADING_2"
         },
         "fields": "namedStyleType"
       }
     }
   ]
3. **Bold and Italics**:
   HTML:
   <p>This is <b>bold</b> and <i>italic</i> text.</p>
   Output:
   [
     {
       "insertText": {
         "location": { "index": 1 },
         "text": "This is bold and italic text.\\n"
       }
     },
     {
       "updateTextStyle": {
         "range": {
           "startIndex": 8,
           "endIndex": 12
         },
         "textStyle": {
           "bold": true
         },
         "fields": "bold"
       }
     },
     {
       "updateTextStyle": {
         "range": {
           "startIndex": 17,
           "endIndex": 23
         },
         "textStyle": {
           "italic": true
         },
         "fields": "italic"
       }
     }
   ]
4. **Lists (Unordered and Ordered)**:
   HTML:
   <ul>
     <li>Item 1</li>
     <li>Item 2</li>
   </ul>
   <ol>
     <li>First</li>
     <li>Second</li>
   </ol>
   Output:
   [
     {
       "insertText": {
         "location": { "index": 1 },
         "text": "Item 1\\nItem 2\\n"
       }
     },
     {
       "updateParagraphStyle": {
         "range": {
           "startIndex": 1,
           "endIndex": 8
         },
         "paragraphStyle": {
           "bulletPreset": "BULLET_DISC_CIRCLE_SQUARE"
         },
         "fields": "bulletPreset"
       }
     },
     {
       "insertText": {
         "location": { "index": 8 },
         "text": "First\\nSecond\\n"
       }
     },
     {
       "updateParagraphStyle": {
         "range": {
           "startIndex": 8,
           "endIndex": 19
         },
         "paragraphStyle": {
           "bulletPreset": "NUMBERED_DECIMAL"
         },
         "fields": "bulletPreset"
       }
     }
   ]
5. **Images**:
   HTML:
   <img src="https://example.com/image.png" />
   Output:
   [
     {
       "insertInlineImage": {
         "location": { "index": 1 },
         "uri": "https://example.com/image.png"
       }
     }
   ]
6. **Images Without a 'src' or an invalid url in 'src' **:
   HTML:
   <img />
   Output:
   [
     {
       "insertInlineImage": {
         "location": { "index": 1 },
         "uri": "https://design102.blog.gov.uk/wp-content/uploads/sites/163/2022/01/D102-Blog-post_Alt-text_main-image.png"
       }
     }
   ]

### Important Notes:
- Retain all formatting (bold, italics, lists, etc.) from the HTML input.
- Strictly output the JSON array of requests without additional text, explanations, or formatting issues.
- Do not skip or ignore any part of the input content unless explicitly mentioned (e.g., invalid images).
`;

export async function convertHtmlToGoogleDocsRequests(
  html: string
): Promise<Result<docs_v1.Schema$Request[], string>> {
  try {
    const result = await generateText({
      model: await getThrottledGPToMini(),
      maxTokens: 10000,
      system: SYSTEM_PROMPT,
      prompt: `HTML Content: ${html}`,
    });

    console.log(result.text);

    const requests: docs_v1.Schema$Request[] = JSON.parse(result.text); // Parse the JSON response
    return ok(requests);
  } catch (error) {
    console.error("Error converting HTML to Google Docs requests: ", error);
    return err("Failed to generate Google Docs requests from HTML.");
  }
}
