import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Result, err, ok } from "true-myth/result";

const SYSTEM_PROMPT= `As a professional SEO blog writer, you will be given:
1. an SEO blog post as a text
2. 'format': HTML, Markdown, None, etc
Your task is to just format the given blog post in the given 'format'. Output the SEO formatted post only, nothing else.
`;

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