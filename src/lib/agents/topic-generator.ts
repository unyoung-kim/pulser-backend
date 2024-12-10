import { SupabaseClient } from "@supabase/supabase-js";
import { generateText } from "ai";
import { Result, err, ok } from "true-myth/result";
import { getSupabaseClient } from "../get-supabase-client.js";
import { serpTool } from "../tools/serp-tool.js";
import { getThrottledGPT4o20241120 } from "../get-llm-models.js";

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given a keyword string and client background. 
Using the provided inputs and tool, your task is to generate a list of 5 highly relevant topic for a SEO blog post tailored for a client, optimized to engage users near the bottom or middle of the sales funnel.
You can utilize the Google Autocomplete API to fetch relevant, up-to-date topic suggestions that enhance SEO content generation.

Follow these tips to generate the topic:

1. Use Keywords Strategically: include all the keywords in the near start of the title. 
2. Add power words: Use emotional or action-driven words like "Proven", "Ultimate", "Fast", or "Easy". (e.g. "Ultimate Guide to Writing Click-Worth Titles") 
3. If it's or could be a listicle, add a number in the title (e.g. "10 Proven Tips to Increase Traffic in 2024", "5 Fastest Ways to Boost Your SEO that Drive Results")
4. Keep It Short & Clear: under 50 characters. Avoid jargon.
5. Make it engaging and compelling CTAs to increase clicks.
6. Understand Your Audience: Know your target reader's pain points, interest, and language, then create titles that address their needs or solve their problems.

Strictly output only the suggested titles in ["topic1","topic2",..] format.
`;

export async function topicGenerator(
  keyword: string,
  projectId: string
): Promise<Result<string, string>> {
  try {
    const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

    if (supabaseClient.isErr) {
      return err(supabaseClient.error);
    }

    const supabase = supabaseClient.value;

    const { data: backgroundData, error: backgroundError } = await supabase
      .from("Project")
      .select("background, name")
      .eq("id", projectId)
      .single();

    if (backgroundError) {
      return err(`Error in fetching background ${backgroundError.message}`);
    }
    if (!backgroundData?.background) {
      return err(
        `Please complete the background information of the project "${backgroundData?.name}" to get AI suggestions.`
      );
    }

    const currentDate = new Date().toLocaleString();

    const result = await generateText({
      model: await getThrottledGPT4o20241120(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Keyword: ${keyword}\nClient background: ${backgroundData?.background}`,
      tools: { serp: serpTool() },
      maxSteps: 3,
      //   temperature: 1.0
      //   toolChoice: 'required'
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in topic generator:", error);
    return err("An error has occured from the topic generator");
  }
}
