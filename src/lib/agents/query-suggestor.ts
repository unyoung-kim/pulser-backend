import { generateObject } from "ai";
import { relatedSchema } from "../schema/related.js";
import { Result, ok, err } from "true-myth/result";
import { getThrottledGPToMini } from "../get-llm-models.js";

export async function querySuggestor(
  query: string
): Promise<Result<{ query: string }[], string>> {
  try {
    const { object } = await generateObject({
      model: await getThrottledGPToMini(),
      system: `As a professional web researcher, your task is to generate a set of three queries that explore the subject matter more deeply, building upon the initial query and the information uncovered in its search results.
  
      For instance, if the original query was "Starship's third test flight key milestones", your output should follow this format:
  
      Aim to create queries that progressively delve into more specific aspects, implications, or adjacent topics related to the initial query. The goal is to anticipate the user's potential information needs and guide them towards a more comprehensive understanding of the subject matter.
      Please match the language of the response to the user's language.`,
      prompt: query,
      schema: relatedSchema,
    });

    return ok(object.relatedQueries);
  } catch (error) {
    console.error("Error in querySuggestor:", error);
    return err("Error in query suggestor");
  }
}
