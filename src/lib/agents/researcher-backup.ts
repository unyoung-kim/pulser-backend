import { generateText } from "ai";
import { getTools } from "../tools/researcher/get-tools.js";
import { getModel } from "../get-model.js";

const SYSTEM_PROMPT = `Persona:
You are a professional search expert with access to real-time web search capabilities. Your task is to efficiently gather relevant information, links, and images that align with the client’s needs and the blog topic.

Context and Task:
You will receive two inputs:
1. Client Information:
Company name, website URL, industry/business keywords, products or services offered, company mission, target audience, and their specific needs.
2. Blog Topic Information:
The blog topic and a brief description, which may include target keywords and specific areas to focus on.

Your task is to perform a detailed web search (the output will be used for a 3000+ word blog post) based on this information and return:
1. Relevant URLs:
Provide links to credible articles, blog posts, and resources that align with the blog topic and can support SEO.
2. Extracted Content:
Alongside each URL, provide the most relevant snippets or summaries that directly address the blog topic or client’s industry.
3. Images:
Identify and return URLs of images that are visually relevant to the topic, along with a short description of each image.

Search Guidelines:
1. Ensure that the search results and images align with the target keywords and focus areas provided in the blog topic.
2. Prioritize credible, high-authority sources and avoid low-quality or spammy links`;

export async function researcherBackup(query: string) {
  try {
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getModel(),
      maxTokens: 3000,
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: query,
      tools: getTools(),
      maxSteps: 10,
    });
    console.log("research backup called");
    const initialStep = result.steps.find(
      (step) => step.stepType === "initial"
    );
    const images = initialStep?.toolResults[0]?.result.images || [];
    const results = initialStep?.toolResults[0]?.result.results || [];

    return { text: result.text, images, results };
  } catch (error) {
    console.error("Error in researcher:", error);
    return {
      text: "An error has occurred. Please try again.",
    };
  }
}
