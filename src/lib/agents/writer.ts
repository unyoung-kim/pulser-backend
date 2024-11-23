import { generateText } from "ai";
import { Result, err, ok } from "true-myth/result";
import { getCaludeSonnet } from "../get-model.js";

const SYSTEM_PROMPT = `<Task>
As a professional SEO blog writer, you will be given an detailed outline for an SEO blog post.

Your task is to write a very long and detailed blog post, of length around 3000 words, based on the outline.
</Task>

<Rules>
1. Word count of the blog post must around 3000 words. Follow this very strictly.
2. Use all the images and links provided in the outline. Use [Image: <image_url>] and [link: link_url] right next to the text that you want to anchor. You will be rewarded by using all the links and images provided by the outline. (E.g. If you have any questions, contact us [link: <some_contact_us_url>] via email.)
3. Pay particular attention to crafting the introduction. The introduction should provide value instantly and mention about the pain point of the audience. Keep the sentences short and concise. Also make sure it's not too salesy.
4. Follow the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
5. Please generate text that avoids using formal or overly academic phrases such as 'it is worth noting,' 'furthermore,' 'consequently,' 'in terms of,' 'one may argue,' 'it is imperative,' 'this suggests that,' 'thus,' 'it is evident that,' 'notwithstanding,' 'pertaining to,' 'therein lies,' 'utilize,' 'be advised,' 'hence,' 'indicate,' 'facilitate,' 'subsequently,' 'moreover,' and 'it can be seen that.' Aim for a natural, conversational style that sounds like two friends talking at the coffee shop. Use direct, simple language and choose phrases that are commonly used in everyday speech. If a formal phrase is absolutely necessary for clarity or accuracy, you may include it, but otherwise, please prioritize making the text engaging, clear, and relatable.
6. When introducing a new product or concept, avoid using overly formal or forced phrases like "Meet X" or "Enter Y." Aim for a more natural and conversational approach.
7. Avoid using cheesy rhetorical questions.
8. Don't change the title at all.
9. Don't come up with testimonials, case studies, or statistics that is not directly mentioned in the outline.
</Rules>`;

export async function writer(outline: string): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: getCaludeSonnet(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: outline,
      maxTokens: 9000,
      temperature: 0.7,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occurred. Please try again.");
  }
}
