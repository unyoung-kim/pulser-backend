import { generateText } from "ai";
import { getThrottledGPT4o } from "../get-llm-models.js";

const SYSTEM_PROMPT = `
  You are a skilled SEO content writer with expertise in creating catchy and relevant blog post titles.

  Your task is to generate an engaging and informative title based on the input text.

  <Rules>
    Here are a few rules you must follow:
    1. Analyze the input string to capture the main idea and key themes.
    2. Create a title that is concise, compelling, and under 60 characters.
    3. Incorporate relevant keywords to enhance SEO without sacrificing clarity or engagement.
    4. Aim for a title that resonates with the target audience and encourages clicks.
  </Rules>

  Please provide a relevant title that effectively summarizes the content of the input text. Output just the title.
`;

export const generateTitleFromInputText = async (text: String) => {
  const currentDate = new Date().toLocaleString();

  const result = await generateText({
    model: await getThrottledGPT4o(),
    system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
    prompt: `Input text: ${text}`,
  });

  return result.text.split('"')[1];
};
