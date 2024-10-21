import Anthropic from "@anthropic-ai/sdk";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MAX_TOKENS_FOR_CLAUDE = 4000;

/**
 * Ask a question and you'll get a simple string response from gpt.
 * @param model
 * @param systemPrompt
 * @param userPrompt
 * @param temperature
 * @returns
 */
export async function getSimpleClaudeResponse(
  systemPrompt: string,
  userPrompt: string,
  maxTokens?: number,
  temperature?: number
): Promise<Result<string, string>> {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS_FOR_CLAUDE,
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: temperature ?? 0,
    });

    if (Array.isArray(msg.content)) {
      const firstContentBlock = msg.content[0];

      if ("text" in firstContentBlock) {
        const response: string = firstContentBlock.text;
        console.log(response);

        return ok(response);
      } else {
        console.error("Content block does not have a 'text' property.");

        return err("Content block does not have a 'text' property.");
      }
    } else {
      console.error("Unexpected content format.");
      return err("Unexpected content format.");
    }
  } catch (error) {
    console.log("Error from claude: ", error);
    return err(`Error from gpt response: ${error}`);
  }
}
