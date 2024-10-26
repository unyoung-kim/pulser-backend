import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { z } from "zod";

export type GPT_MODEL = "gpt-4o" | "gpt-4o-mini";

const apikey: Result<string,string> = process.env.OPENAI_API_KEY ? ok(process.env.OPENAI_API_KEY) : err("Open API key is not defined")

/**
 * Use this when you want to get a structured output from gpt. Input the schema, and you'll
 * get the output in the schema.
 *
 * See example: https://platform.openai.com/docs/guides/structured-outputs
 * @param model
 * @param systemPrompt
 * @param userPrompt
 * @param schema
 * @param temperature
 * @returns
 */
export async function getStructuredGptResponse<T extends z.ZodTypeAny>(
  model: GPT_MODEL,
  systemPrompt: string,
  userPrompt: string,
  schema: T,
  temperature?: number
): Promise<Result<z.infer<T>, string>> {
  try {

    if(apikey.isErr) return err(apikey.error);

    const openai = new OpenAI({
      apiKey: apikey.value
    });

    const completion = await openai.beta.chat.completions.parse({
      model: model,
      temperature: temperature ?? 0,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      response_format: zodResponseFormat(schema, "structued_response"),
    });

    console.log("Ai Answer: ", completion.choices[0].message.parsed);

    const response: z.infer<T> = completion.choices[0].message.parsed;

    return ok(response);
  } catch (error) {
    return err(`Error from gpt response: ${error}`);
  }
}

/**
 * Ask a question and you'll get a simple string response from gpt.
 * @param model
 * @param systemPrompt
 * @param userPrompt
 * @param temperature
 * @returns
 */
export async function getSimpleGptResponse(
  model: GPT_MODEL,
  systemPrompt: string,
  userPrompt: string,
  temperature?: number
): Promise<Result<string, string>> {
  try {

    if(apikey.isErr) return err(apikey.error);
    
    const openai = new OpenAI({
      apiKey: apikey.value
    });

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      temperature: temperature ?? 0,
    });

    console.log("Ai Answer: ", completion.choices[0].message.content);

    const response: string | null = completion.choices[0].message.content;

    if (response === null) {
      return err("No response from gpt");
    }

    return ok(response);
  } catch (error) {
    return err(`Error from gpt response: ${error}`);
  }
}
