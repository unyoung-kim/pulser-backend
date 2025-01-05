import { generateText } from "ai";
import { err, ok, Result } from "true-myth/result";
import {
  getThrottledClaudeSonnet,
  getThrottledGPT4o,
} from "../get-llm-models.js";
import { getTools } from "../tools/researcher/get-tools.js";
import {
  searchSubTopicsTool,
  searchTool,
} from "../tools/researcher/search-tool.js";

// const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
// For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
// If there are any images relevant to your answer, be sure to include them as well.
// Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.`;

const SYSTEM_PROMPT = `As a professional seo expert, your task is to come up with a detailed outline for an SEO blog post for a client given a blog post topic and client details.

You possess the ability to search for any information on the web.

Come up with the initial outline from the topic and client details. Then, based on your outline created from the initial search, conduct further research on all the sub-topics to enrich the outline. If you are writing individual products or services, be sure to research them as well. 

For the outline, make sure each sections has all the relevant external links and images associated in the outline. Don't include any other text but the outline itself.

Here are a few rules you must follow for the outline:

  1) Provide sufficient number of sections, sub-sections, images and links in the outline for a very long blog post. 
  2) Make sure to provide a strong hook, intro to the blog post. The introduction should provide value instantly and mention about the pain point of the audience.
  3) Use the client details provided in the input and web search results to promote client and its business/service in the blog post by following the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
  4) The outline should contain a main image below the title. In the introduction section, add four to five links/sources.
  5) Make sure to add images and external links for subtopics. Make sure to preserve/add as many external urls and images as possible.
  6) Instead of generating simple bullet points, if you have found a relevant information from the web, include it in the outline in a detail manner so that it retains as much meaningful information as possbile.
  7) If relevant, make sure to compare and contrast products and services.
  8) Again, make sure to conduct the initial research, come up with a basic outline, then conduct additional research on all the subtopics to enrich the outline.
  `;

export async function researcher(
  query: string
): Promise<Result<string, string>> {
  try {
    // let toolResults: any[] = [];

    const currentDate = new Date().toLocaleString();
    const result = await generateText({
      model: await getThrottledClaudeSonnet(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: query,
      tools: getTools(),
      maxSteps: 10,
      maxTokens: 8000,
      // onStepFinish: async (event: {
      //   stepType: string;
      //   toolCalls?: any[];
      //   toolResults?: any;
      // }) => {
      //   if (event.stepType === "initial" && event.toolCalls) {
      //     toolResults = event.toolResults;
      //   }
      // },
    });

    // console.log("Result: ", result);
    console.log("RESEARCHER RESULT: ", JSON.stringify(result, null, 2));
    // //
    // console.log("Tool results: ", JSON.stringify(toolResults, null, 2));

    return ok(result.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occured from the researcher");
  }
}

const LONG_POST_INITIAL_OUTLINE_PROMPT = `As a professional seo expert, your task is to come up with a detailed outline for an SEO blog post for a client given:

<Input>
  1) a blog post topic
  2) client details
  3) keywords(optional)
  4) user instruction(optional)
</Input>

You possess the ability to search for any information on the web.

Conduct a deep research on the topic. Then, come up with the outline of the blog post based on your research. The outline is for a long blog post.

For the outline, make sure each sections has all the relevant external links associated and is written in markdown format. Output the outline inside <outline> tags.

<Rules>
Here are a few rules you must follow for the outline:

  <General>
    1) Provide sufficient number of sections, sub-sections, and links in the outline for a blog post that matches the word count provided. Cover topics that are not only core and but also could be relevant to the topic provided. 
    2) Use the client details provided in the input and web search results to promote client and its business/service in the blog post by following the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
    3) If relevant, make sure to compare and contrast products and services.
    4) Avoid being too salesy - this means that don't promote the client's products or services more than three times in the outline.
    5) Ensure that any specific instructions provided by the user are fully addressed in the outline.
    6) The outline should contain content so it's easy and natural to incorporate the provided keywords when the article is written. 
    7) DO NOT add any case studies unless provided in the user instructions.
  </General>

  <Introduction>
    1) The introduction should provide value instantly and mention about the pain point of the audience.
    2) If client background includes social proof, case studies, or credibility, make sure to include it in the introduction outline to build trust.
    3) Conduct research to find some unique insight about the topic like a quote, statistic, or a surprising fact and add it to the outline with the source.
  </Introduction>

  <Links>
    1) Make sure to include [Link: ...] for each section.
    2) Include as many links / sources as many sources through out the article in the [Link: ...] format.
    3) It is extremely important that you don't add a link of a potential competitor in the outline.
  </Links>
</Rules>

<Example>
<outline>

# Fitness Marketing Tips in 2024: Elevate Your Gym's Success

## I. Introduction
- Brief overview of the challenges facing fitness businesses in 2024
- Unique insight: According to a recent study, 81% of gym-goers prefer a mix of digital and in-person fitness experiences [Link: https://www.wellnesscreatives.com/fitness-marketing-trends/]
- Introduction to SpearPoint Marketing LLC and how they help fitness businesses thrive in the digital age

## II. The Fitness Industry Landscape in 2024
- Current state of the fitness market
- Key challenges facing gym owners and fitness professionals
- Opportunities for growth and innovation
[Link: https://gyminsiders.com/2023/12/strategic-gym-marketing-for-2024-leveraging-data-and-trends/]

## III. Leveraging Digital Marketing Trends
### A. Fitness Marketing Funnels
- Explanation of marketing funnels in the fitness context
- Steps to create an effective fitness marketing funnel
[Link: https://www.wellnesscreatives.com/fitness-marketing-trends/]

### B. Embracing Wearable Technology
- The rise of wearable tech in fitness
- How to incorporate wearable data into your marketing strategy
- Examples of successful wearable tech integrations in fitness marketing

### C. Influencer Marketing in the Fitness Space
- The power of fitness influencers in 2024
- How to choose the right influencers for your brand
- Tips for creating authentic influencer partnerships
[Link: https://legitfit.com/blog/top-2024-marketing-consumption-trends-for-fitness-professionals]

## IV. Personalization and AI-Driven Marketing
### A. AI-Powered Fitness Apps and Platforms
- The role of AI in personalizing fitness experiences
- How to use AI for targeted marketing campaigns
- Case study: A fitness app that increased user engagement by 50% with AI-driven recommendations

### B. Conversational Marketing for Gyms
- Implementing chatbots and AI-driven interactions
- Best practices for conversational marketing in the fitness industry
- How SpearPoint Marketing can help implement these technologies effectively

## V. Content Marketing Strategies for Fitness Brands
### A. Video Content and Live Streaming
- The importance of video in fitness marketing
- Tips for creating engaging fitness video content
- Leveraging platforms like YouTube, Instagram, and TikTok for fitness marketing

### B. Podcasting for Fitness Professionals
- Why podcasts are gaining popularity in the fitness niche
- How to start and market a fitness podcast
- Success stories of fitness brands using podcasts for marketing

## VI. Community Building and Engagement
### A. Social Media Strategies for Gyms
- Effective social media tactics for 2024
- Creating engaging content that resonates with fitness enthusiasts
- How SpearPoint Marketing helps fitness businesses build a strong social media presence
[Link: https://wod.guru/blog/fitness-marketing/]

### B. Hybrid Fitness Experiences
- Blending online and offline fitness offerings
- Marketing strategies for hybrid fitness models
- Case study: A gym that successfully transitioned to a hybrid model with SpearPoint's help

## VII. Sustainability and Wellness-Focused Marketing
### A. Incorporating the "New Green Reality"
- How sustainability is shaping fitness marketing
- Strategies to showcase your gym's eco-friendly initiatives
- Examples of successful green marketing campaigns in the fitness industry
[Link: https://legitfit.com/blog/top-2024-marketing-consumption-trends-for-fitness-professionals]

### B. Holistic Wellness Approach
- Expanding marketing beyond physical fitness to overall wellness
- Creating content that addresses mental health and nutrition
- Partnerships with wellness brands to enhance your marketing reach

## VIII. Data-Driven Marketing Strategies
### A. Leveraging Gym Management Software
- The importance of data in fitness marketing
- Key metrics to track for effective marketing
- How SpearPoint Marketing can help analyze and utilize gym data for targeted campaigns

### B. Retargeting and Remarketing in the Fitness Industry
- Strategies for re-engaging past members and leads
- Implementing effective retargeting campaigns
- Case study: How a gym increased member retention by 25% through strategic remarketing

## IX. Local SEO and Google My Business Optimization
- The importance of local SEO for gyms and fitness studios
- Tips for optimizing Google My Business listings
- How SpearPoint Marketing's SEO expertise can boost local visibility for fitness businesses

## X. Conclusion
- Recap of key fitness marketing trends for 2024
- The importance of staying adaptable in the ever-changing fitness landscape
- How partnering with SpearPoint Marketing can help fitness businesses thrive in 2024 and beyond

[Link: https://www.thespearpoint.com/]

</outline>
</Example>

Think step by step before you come up with the outline.
`;

const SHORT_POST_INITIAL_OUTLINE_PROMPT = `As a professional seo expert, your task is to come up with a detailed outline for an SEO blog post for a client given:

<Input>
  1) a blog post topic
  2) client details
  3) keywords(optional)
  4) user instruction(optional)
</Input>

You possess the ability to search for any information on the web.

Conduct a deep research on the topic. Then, come up with the outline of the blog post based on your research. The outline is for a long blog post.

For the outline, make sure each sections has all the relevant external links associated and is written in markdown format. Output the outline inside <outline> tags.

<Rules>
Here are a few rules you must follow for the outline:

  <General>
    1) Provide sufficient number of sections, sub-sections, and links in the outline for a blog post that matches the word count provided. Make sure to stick to the title and ONLY cover topics that are relevant to the topic provided.
    2) Use the client details provided in the input and web search results to promote client and its business/service in the blog post by following the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
    3) If relevant, make sure to compare and contrast products and services.
    4) Avoid being too salesy - this means that don't promote the client's products or services more than three times in the outline.
    5) Ensure that any specific instructions provided by the user are fully addressed in the article.
    6) The outline should contain content so it's easy and natural to incorporate the provided keywords when the article is written. 
    7) DO NOT add any case studies unless provided in the user instructions.
  </General>

  <Introduction>
    1) The introduction should provide value instantly and mention about the pain point of the audience.
    2) If client background includes social proof, case studies, or credibility, make sure to include it in the introduction outline to build trust.
    3) Conduct research to find some unique insight about the topic like a quote, statistic, or a surprising fact and add it to the outline with the source.
  </Introduction>

  <Links>
    1) Make sure to include [Link: ...] for each section.
    2) Include as many links / sources as many sources through out the article in the [Link: ...] format.
    3) It is extremely important that you don't add a link of a potential competitor in the outline.
  </Links>
</Rules>

Think step by step before you come up with the outline.
`;

const FINAL_OUTLINE_PROMPT = `You are a professional SEO content writer. You will be given an outline of an SEO blog post.

You possess the ability to search for any information on the web.

Your task is to conduct further research on sub topics and enrich the outline by adding more details and links. Find where resources are lacking and conduct further research on those topics. Only return the outline with the additional research and don't include any explanation text about the task. Output the outline inside <outline> tags. Make sure to write in markdown format. 

RULES: 
1) Make sure introduction has multiple links. The introduction should provide value instantly and mention about the pain point of the audience. If there isn't already, make sure when conducting research to find some unique insight about the topic like a quote, statistic, or a surprising fact and add it to the outline with the source.
2) The outline should follow the Problem - Agitation - Solution copy writing framework. It's important that you generally follow and embed this flow but not explicitly mention it.
3) Make sure to add links (only if valuable or insightful to the content) for subtopics that lack them in the given outline. You will be rewarded extra points for having multiple links per subtopic.
4) Return a full outline with all the sections, sub-sections and links without any ommissions from the given outline.
5) Focus research efforts on sections that most directly address the article's central topic. You will be rewarded extra points for this.
6) Also research and enrich the sections and subsections corresponding to user instruction, if required.  
7) It is extremely important that you don't add a link of a potential competitor in the outline.
`;

/**
 * This is a sequential approach to the researcher agent. This is a more deterministic approach and it also preserves more information from the initial research.
 * @param query
 * @returns
 */
export async function researcherSequential(
  topic: string,
  clientDetails: string,
  length: "LONG" | "SHORT",
  secondaryKeywords?: string[],
  instruction?: string
): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    // Generate the initial outline
    const firstOutline = await generateText({
      model: await getThrottledClaudeSonnet(),
      system: `${
        length === "LONG"
          ? LONG_POST_INITIAL_OUTLINE_PROMPT
          : SHORT_POST_INITIAL_OUTLINE_PROMPT
      } Current date and time: ${currentDate}`,
      prompt: `Topic: ${topic}\nClient Details: ${clientDetails}\nKeywords: ${secondaryKeywords}\nInput content: ${instruction}`,
      tools: {
        search: searchTool(),
        // retrieve: retrieveTool(),
      },
      temperature: 0.4,
      maxSteps: 3,
      maxTokens: 8000,
    });

    console.log("FIRST OUTLINE: ", firstOutline.text);

    const detailedOutline = await generateText({
      model: await getThrottledGPT4o(),
      system: `${FINAL_OUTLINE_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Initial Topic: ${topic}\nClient Details: ${clientDetails}\nOutline: ${firstOutline.text}\nInput content: ${instruction}`,
      tools: {
        subtopicSearch: searchSubTopicsTool(),
      },
      maxSteps: 2,
      temperature: 0,
      maxTokens: 8000,
    });

    console.log("DETAILED OUTLINE: ", detailedOutline.text);

    return ok(detailedOutline.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occured from the researcher");
  }
}
