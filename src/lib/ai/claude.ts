import Anthropic from "@anthropic-ai/sdk";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  temperature?: number
): Promise<Result<string, string>> {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [{ role: "user", content: "Hello, Claude" }],
    });
    console.log(msg);

    const response: string | null = msg;

    if (response === null) {
      return err("No response from gpt");
    }

    return ok(response);
  } catch (error) {
    return err(`Error from gpt response: ${error}`);
  }
}

await getSimpleClaudeResponse("", "Hello, Claude");
