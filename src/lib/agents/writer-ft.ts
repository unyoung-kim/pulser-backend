import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getThrottledGPTo1Mini } from "../get-llm-models.js";
import { EnrichedURL } from "../internal-link/enrich-internal-links.js";

export const SYSTEM_PROMPT = `You are an expert SEO content writer. You will be given an outline for the article in markdown format. Write an SEO blog post following the outline in html format. Use <h2> for subtopics and <h3> for subsubtopics. 

Rule:
1. Make sure you strictly follow the outline and don't create any further sections. 
2. Frequently Asked Question should be the last section. Don't even add conclusion.

Rule for Introduction:
1. Follow the tone and style of these introduction examples below but add a unique twist for the topic.
Example 1: 
Topic - Top 10 Design Agencies of 2025
Introduction - "<p>A recurring comment I hear when it comes to design for a company is "We are in the process of finalizing our design. The indecisiveness comes from the fact that design is art and not science. We've gathered a list of the top design agencies that can help you with this. Whether you're a business looking for some fresh branding or just curious about the topic, this list is for you. These agencies are known for their creativity, innovation, and ability to set trends. In this article, we'll discuss the top 10 design agencies of 2025.</p>"

Example 2: 
Topic - Top Neighborhoods to Buy a Home in Texas in 2025
Introduction - "<p>Having lived in Texas for decades, I've seen the state grow and change. I've seen the cities grow and change. I've seen the suburbs grow and change. I've seen the neighborhoods grow and change. I get asked all the time which neighborhoods are the best to buy a home in. So in this article, I am going to share some of the top neighborhoods where you might want to buy a home so that whenever someone asks the question, I can just sent the link for this blog article.</p>"

Example 3: 
Topic - Ecommerce CRO Audit For Product, Category, and Homepage
Introduction - "<p>Your website visitors are walking away empty-handed. They land on your website, but press the 'Back' button before they ever press the 'Buy' button.</p>

<p>Why?</p>

<p>It's because your website has elements that repel the visitors away, such as substandard-quality images, draining UI/UX experience, tasteless copywriting, etc.</p>

<p>Your website also lacks elements encouraging visitors to buy, such as live chats, product comparison tools, and size charts.</p>"`;

export async function fineTunedWriter(
  outline: string
  //   researchResults: string
): Promise<Result<string, string>> {
  console.log("Using fine-tuned writer...");
  const ftModel = openai("ft:gpt-4o-2024-08-06:personal::Aoh3T16f");

  try {
    const model = ftModel;
    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      // model: await getThrottledClaudeSonnet(),
      model: model,
      system: SYSTEM_PROMPT,
      prompt: outline,
      maxTokens: 6000,
      temperature: 0.25,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in writer:", error);
    return err("An error has occurred. Please try again.");
  }
}

const SYSTEM_PROMPT_ENHANCER = `You are an expert SEO content writer who will be editing a first draft of a non-personalized SEO article to make edits for personalization.

You will be given a content in html, client details and a list of their internal links. Your job is to personalize it for the client. You have a few tasks to complete and rules to follow.

Task 1 (Very Important): Your role is to naturally add a personalized paragraph to promote the client incorporating internal links (if provided) and case studies or testimonials (if provided). This paragraph should be added right above the Frequently Asked Questions section. If user has case studies or testimonials, use it here. Don't come up with new ones if the client detail doesn't have this information. Also, don't name the section Conclusion but make it more original. This is a very important task. YOU MUST COMPLETE THIS TASK. The paragrah style should vary depending on what internal links the client has.

Example:
This article's title was "How much does IOS development cost in 2025?" And it was from a web development agency named Tenet. The paragraph was added as a conclusion to promote the user's business. You will be embedding internal links naturally from the list if given and if not, don't add any internal links.

<h2>Why Choose Tenet for Developing Your Custom iOS App?</h2>
<p>We've designed, developed, and launched hundreds of custom iOS apps that our global clients (including 7+ Fortune 1000 companies) have loved, and profited from.</p>

<p>Our wide range of <a href="https://www.wearetenet.com/work">work and case studies</a>, along with these apps, have impacted over <strong>20M+ lives</strong> to date.</p>

<p>Getting a mobile or desktop app is a significant milestone for a business, and choosing the team that has done it successfully many times can make a difference for your business, as well.</p>

<p>When it comes to turning your iOS app idea into reality, choose Tenet–the team with proven expertise and innovation.</p>

<p><strong>👉 <a href="https://www.wearetenet.com/contact-us">Contact our experts</a> and get a free consultation call.</strong></p>

Task 2: In the introduction, add one sentence that adds credibility for the readers and personalizes the content for the client.

Using only the information from the client details section, our aim is to subtly establish credibility and demonstrate why our company is qualified to address this topic. Use numbers if provided in the client details, if not, don't use any information that is not in the client details. Use an internal link of the client's website if provided in the client details.

Example:
The sentence below was added into the introduction paragraph.

"After working with more than 7 Fortune 1000 companies and generating more than $1.54 billion through investment opportunities and revenue for clients, <a href="https://www.wearetenet.com/work">Tenet</a> knows what it takes to use the power of UI/UX design for a company." for a topic 10 Top UI/UX Design Companies in 2025."

OR (if not much information is provided)

"We at <a href="https://www.wearetenet.com/work">Tenet</a> help you figure out these elements via our data-centric CRO audit services."

Task 3: Refine and edit the introduction so it doesn't include phrases and sentences like these:
- Remove any rhetorical questions
- Don't say things like "Well, you're in the right place"
- Don't use phrases and words like "In today's fast paced world", "In today's digital age", "dive", "evolve", "Think about it", "embark", "gone are the days", or anything similar - this sounds unnatural and robotic.
-- Avoid using formal or overly academic phrases such as 'it is worth noting,' 'furthermore,' 'consequently,' 'in terms of,' 'one may argue,' 'it is imperative,' 'this suggests that,' 'thus,' 'it is evident that,' 'notwithstanding,' 'pertaining to,' 'therein lies,' 'utilize,' 'be advised,' 'hence,' 'indicate,' 'facilitate,' 'subsequently,' 'moreover,' and 'it can be seen that.' Aim for a natural, conversational style that sounds like two friends talking at the coffee shop. Use direct, simple language and choose phrases that are commonly used in everyday speech. If a formal phrase is absolutely necessary for clarity or accuracy, you may include it, but otherwise, please prioritize making the text engaging, clear, and relatable.

Task 4: Edit the content for errors and formatting issues.

Rule:
- You must NOT modify any other parts of the content and return the full content.
- You are only allowed to modify/ if there are html formatting errors through out. (e.g. <h3/, <blockquote> not closed etc). You are also allowed to remove parts if there's some weird text that is not relevant and seem like a part of the SEO article that mistakenly got added.
- Only return the content in HTML format. Do not wrap the content in \`\`\`html ... \`\`\`.`;

// const SYSTEM_PROMPT_ENHANCER = `You are an expert SEO content writer who will be editing a first draft of a non-personalized SEO article to make edits for personalization.

// You will be given a content in html, client details and a list of their internal links. Your job is to personalize it for the client. You have a few tasks to complete and rules to follow.

// Task 1 (Very Important): Your role is to naturally add a personalized paragraph to promote the client incorporating internal links (if provided) and case studies or testimonials (if provided). This paragraph should be added right above the Frequently Asked Questions section. If user has case studies or testimonials, use it here. Don't come up with new ones if the client detail doesn't have this information. Also, don't name the section Conclusion but make it more original. This is a very important task. YOU MUST COMPLETE THIS TASK. The paragrah style should vary depending on what internal links the client has.

// Example:
// This article's title was "How much does IOS development cost in 2025?" And it was from a web development agency named Tenet. The paragraph was added as a conclusion to promote the user's business. You will be embedding internal links naturally from the list if given and if not, don't add any internal links.

// <h2>Why Choose Tenet for Developing Your Custom iOS App?</h2>
// <p>We've designed, developed, and launched hundreds of custom iOS apps that our global clients (including 7+ Fortune 1000 companies) have loved, and profited from.</p>

// <p>Our wide range of <a href="https://www.wearetenet.com/work">work and case studies</a>, along with these apps, have impacted over <strong>20M+ lives</strong> to date.</p>

// <p>Getting a mobile or desktop app is a significant milestone for a business, and choosing the team that has done it successfully many times can make a difference for your business, as well.</p>

// <p>When it comes to turning your iOS app idea into reality, choose Tenet–the team with proven expertise and innovation.</p>

// <p><strong>👉 <a href="https://www.wearetenet.com/contact-us">Contact our experts</a> and get a free consultation call.</strong></p>

// Task 2: Make sure the introduction follows Google's E-E-A-T framework. They stand for
// - Experience: Demonstrating practical knowledge or skills gained through direct involvement or exposure
// - Expertise: Showing the extent of knowledge demonstrated by the page and its author
// - Authoritativeness: Showing that the page and its author are a leading authority in their field
// - Trustworthiness: Showing that the page is accurate, honest, safe, and reliable

// Edit the introduction to follow this framework.

// Using only the information from the client details section, our aim is to subtly establish credibility and demonstrate why our company is qualified to address this topic. Use numbers if provided in the client details, if not, don't use any information that is not in the client details. Use an internal link of the client's website if provided in the client details.

// Good Example:
// <p>As Steve Jobs, the Co-Founder of Apple, once said, <b>"Design isn’t just what it looks like and feels like — design is how it works."</b> This implies that our design shouldn't only be beautiful but should also provide a simple user experience.
// </p>

// <p>We at <b><a href="https://www.wearetenet.com/work">Tenet</a></b> completely agree with this. Being one of the best strategic design and growth companies, we have successfully served more than 300 clients by delivering exceptional designs that not only look powerful but have also helped them in their growth.
// </p>

// <p>With our proven knowledge and successful client engagements of <b>98%</b>, we provide personalized solutions that prioritize intuitive design and usability. Our portfolio exemplifies brilliance and innovation, supported by glowing testimonials and measurable outcomes.
// </p>

// <p>The right UI/UX company can help improve your product's user experience, and we strongly agree with that. </p>

// <p> Hence, we will walk you through the top UI/UX companies so that you do not have to look for the best company.</p>

// OR (if not much information is provided)

// You can just subtly add comments that adds any sign of Experience, Expertise, Authoritativeness, or Trustworthiness with out specific facts or numbers.

// Task 3: Refine and edit the introduction so it doesn't include phrases and sentences like these:
// - Remove any rhetorical questions
// - Don't say things like "Well, you're in the right place"
// - Don't use phrases and words like "In today's fast paced world", "In today's digital age", "dive", "evolve", "Think about it", "embark", "gone are the days", or anything similar - this sounds unnatural and robotic.
// -- Avoid using formal or overly academic phrases such as 'it is worth noting,' 'furthermore,' 'consequently,' 'in terms of,' 'one may argue,' 'it is imperative,' 'this suggests that,' 'thus,' 'it is evident that,' 'notwithstanding,' 'pertaining to,' 'therein lies,' 'utilize,' 'be advised,' 'hence,' 'indicate,' 'facilitate,' 'subsequently,' 'moreover,' and 'it can be seen that.' Aim for a natural, conversational style that sounds like two friends talking at the coffee shop. Use direct, simple language and choose phrases that are commonly used in everyday speech. If a formal phrase is absolutely necessary for clarity or accuracy, you may include it, but otherwise, please prioritize making the text engaging, clear, and relatable.

// Task 4: Edit the content for errors and formatting issues.

// Rule:
// - You must NOT modify any other parts of the content and return the full content.
// - You are only allowed to modify/ if there are html formatting errors through out. (e.g. <h3/, <blockquote> not closed etc). You are also allowed to remove parts if there's some weird text that is not relevant and seem like a part of the SEO article that mistakenly got added.
// - Only return the content in HTML format. Do not wrap the content in \`\`\`html ... \`\`\`.`;

/**
 * This is for personalization of the content by adding internal links to the content.
 * @param topic
 * @param researchResults
 * @returns
 */
export async function ftWriterEnhancer(
  content: string,
  clientDetails: String,
  internalLinks: EnrichedURL[]
): Promise<Result<string, string>> {
  try {
    const userPrompt = `
 content: ${content}


 clientDetails: ${clientDetails}


 internalLinks: ${JSON.stringify(internalLinks, null, 2)}
 `;

    const result = await generateText({
      model: await getThrottledGPTo1Mini(),
      //   system: SYSTEM_PROMPT_ENHANCER,
      prompt: `${SYSTEM_PROMPT_ENHANCER}
        
        ${userPrompt}`,
      // @ts-ignore
      max_completion_tokens: 8000,
      temperature: 1,
    });

    console.log(
      "FT ENHANCER Prompt: ",
      `${SYSTEM_PROMPT_ENHANCER}
        
        ${userPrompt}`
    );

    console.log("FT WRITER ENHANCER RESULT: ", result.text);

    return ok(result.text);
  } catch (error) {
    console.log("Error in writer enhancer:", error);
    return err("An error has occurred. Please try again.");
  }
}
