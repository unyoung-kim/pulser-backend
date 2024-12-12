import { Result } from "true-myth";
import { generateText } from "ai";
import { err, ok } from "true-myth/result";
import { chainLinkTool } from "../tools/text-to-visual/chain-link-tool.js";
import { vennDiagramTool } from "../tools/text-to-visual/venn-diagram-tool.js";
import { getThrottledGPT4o } from "../get-llm-models.js";

const SYSTEM_PROMPT = `
You are provided with:  
1. Input String: A single string that conveys the context or topic for generating an SVG image.  
2. Tools: A collection of tools, where each tool corresponds to a specific SVG template designed for particular use cases.  

Your responsibilities:  
1. Purpose: Your task is not to generate SVGs yourself but to:  
   - Analyze the input string.  
   - Select the most appropriate tool/template based on its description and intended use.  
   - Provide meaningful placeholder values for all required arguments (text and icons).  
   - Call the selected tool with these arguments and directly return its output.  

2. Tool Selection:  
   - Refer to the description of each tool to decide the best match for the input context.  
   - Each tool is designed for a specific type of SVG layout or visualization.  

3. Argument Values:  
   - Text Arguments: Provide concise, meaningful, and contextually relevant text (not exceeding two words).  
   - Icon Arguments:  
     - Provide valid Lucide icon names in PascalCase format.  
     - If no exact match exists, choose a closely related icon that aligns with the context.  
     - Ensure icons strictly conform to the Lucide icon library.  

4. Output Rules:  
   - Strictly output the return value provided by calling the chosen tool. Do not add any words or special characters to it.
`;

export const getSVGImage = async (
  text: string
): Promise<Result<Record<string, string>, string>> => {
  try {
    const currentDate = new Date().toLocaleString();

    const result = await generateText({
      model: await getThrottledGPT4o(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: text,
      tools: {
        chain: chainLinkTool(),
        venn: vennDiagramTool(),
      },
    });

    const toolResult = result.toolResults.at(0)?.result;

    if (!toolResult) {
      return err("Couldn't get tool result from the LLM output");
    }

    return ok(toolResult);
  } catch (error) {
    console.error("Error in template arguments generation:", error);
    return err(
      "An error has occured from the get template and arguments function"
    );
  }
};
