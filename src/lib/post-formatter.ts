import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Result, err, ok } from "true-myth/result";

const SYSTEM_PROMPT = `As a professional SEO blog writer, you will be given:
1. An SEO blog post as text.
2. A 'format' (HTML, Markdown, None, etc).

Your task is to format the given blog post in the specified format without losing or changing any content. 

Please ensure:
- Images are resized appropriately and maintain aspect ratio. Use a maximum width of 100% for responsiveness.
- Paragraphs are properly spaced and easy to read.
- Headings and subheadings are clearly defined with appropriate tags. The title should be in <h1> tag.
- Lists are formatted as ordered or unordered lists where applicable.
- Maintain a consistent structure throughout the document.
- Links are properly formatted with the <a> tag.
Just output the formatted result without any new lines or other special characters.
`;

// Removed the below line corresponding to table of content from prompt
// - Include a table of contents (using the <ul> tag) with corresponding headers (using <h3> tags) placed in the top section, just below the main image. Ensure that the table of contents does not repeat numbering if sections or subsections are already numbered. Instead, use appropriate nested lists for subsections and apply correct numbering where necessary. Avoid using bullet points (•) in sections that have numbered items.

export async function postFormatter(
  post: string,
  format: string
): Promise<Result<string, string>> {
  try {
    const result = await generateText({
      model: openai("gpt-4o-mini-2024-07-18"),
      temperature: 0,
      maxTokens: 8000,
      system: SYSTEM_PROMPT,
      prompt: `Post: ${post}\nFormat: ${format}`,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in formatter: " + error);
    return err("An error has occured from the formatter");
  }
}

const FORMAT_AND_HUMANIZE_SYSTEM_PROMPT = `As a professional SEO blog writer and a html formatter, you will be given an SEO blog post.

Your task is to first adjust the tone to be natural and then format the given blog post in the specified format without losing or shortening content. 

Writing Style Rules:
- Avoid using formal or overly academic phrases such as 'it is worth noting,' 'furthermore,' 'consequently,' 'in terms of,' 'one may argue,' 'it is imperative,' 'this suggests that,' 'thus,' 'it is evident that,' 'notwithstanding,' 'pertaining to,' 'therein lies,' 'utilize,' 'be advised,' 'hence,' 'indicate,' 'facilitate,' 'subsequently,' 'moreover,' and 'it can be seen that.' Aim for a natural, conversational style that sounds like two friends talking at the coffee shop. Use direct, simple language and choose phrases that are commonly used in everyday speech. If a formal phrase is absolutely necessary for clarity or accuracy, you may include it, but otherwise, please prioritize making the text engaging, clear, and relatable.
- When introducing a new product or concept, avoid using overly formal or forced phrases like "Meet X" or "Enter Y." Aim for a more natural and conversational approach.
- Don't use phrases and words like "In today's fast paced world", "In today's digital age", "dive", "evolve", "Think about it", "embark", "gone are the days", or anything similar - this sounds unnatural and robotic.
- Remove any rhetorical questions into normal simple sentences that gets directly to the point.
- Preserve all images and links.
- You are welcome to rephrase sentences completely to make it more natural and follow the rules above.
- Don't change the title at all.
- Don't sound salesy. Don't exaggerate or over-promise because it sounds too salesy. (e.g. "The future of ... is here")
- Avoid saying things like “In today’s environment, in today’s business world, rapidly changing, In the competitive business environment, being inclusive, etc.". Also avoid saying things like "In today’s digital age, in today’s digital era, You're not alone, That's right - ..., Let's paint a picture, Picture this, The future of ... is here, "In the ever-changing world of ...", etc.

Example Tone of Writing - You will be rewarded by mimicking the style of voice of the example below
<h1>Digital Marketing</h1>
  <ul>
    <li><strong>What is digital marketing?</strong> Digital marketing refers to the online promotion of brands to connect with potential customers through various digital channels, including email, social media, and web-based advertising.</li>
    <li><strong>How does inbound marketing differ from digital marketing?</strong> Digital marketing focuses on using specific tools to convert prospects, while inbound marketing takes a holistic approach, prioritizing the goal first and then determining the most effective tools to engage target customers.</li>
    <li><strong>Why is digital marketing important?</strong> It provides broad geographic reach, cost efficiency, measurable results, easier personalization, and better connections with customers.</li>
    <li><strong>What are some key types of digital marketing?</strong> Search engine optimization (SEO), content marketing, social media marketing, pay-per-click (PPC) marketing, affiliate marketing, native advertising, influencer marketing, marketing automation, and email marketing.</li>
    <li><strong>What steps should businesses take to create an effective digital marketing strategy?</strong> Set SMART goals, identify the target audience, create a budget, select appropriate digital marketing channels, and refine efforts by analyzing campaign data for future improvements.</li>
  </ul>
  
  <p>
    Did you know nine-in-ten U.S. adults go online on a daily basis? Not only that, 41% are online “<a href="https://www.pewresearch.org/internet/2024/01/31/americans-use-of-mobile-technology-and-home-broadband/" target="_blank"><strong>almost constantly</strong></a>.” As a marketer, it’s important to take advantage of the digital world with an online advertising presence, by building a brand, providing a great customer experience that also brings more potential customers and more, with a digital strategy.
  </p>

  <p>
    A digital marketing strategy allows you to leverage different digital channels–such as social media, pay-per-click, search engine optimization, and email marketing–to connect with existing customers and individuals interested in your products or services. As a result, you can build a brand, provide a great customer experience, bring in potential customers, and more.
  </p>

  <h2>What is digital marketing?</h2>
  <p>
    Digital marketing, also called online marketing, is the promotion of brands to connect with potential customers using the internet and other forms of digital communication. This includes not only <a href="https://mailchimp.com/marketing-glossary/email-marketing/" target="_blank"><strong>email</strong></a>, <a href="https://mailchimp.com/marketing-glossary/social-media-marketing/" target="_blank"><strong>social media</strong></a>, and web-based advertising, but also text and multimedia messages as a <a href="https://mailchimp.com/resources/what-are-marketing-channels/" target="_blank"><strong>marketing channel</strong></a>.
  </p>
  <p>Essentially, if a marketing campaign involves digital communication, it's digital marketing.</p>

  <h2>Inbound marketing versus digital marketing</h2>
  <p>
    Digital marketing and <a href="https://mailchimp.com/resources/inbound-marketing/" target="_blank"><strong>inbound marketing</strong></a> are easily confused, and for good reason. Digital marketing uses many of the same tools as inbound marketing—email and online content, to name a few. Both exist to capture the attention of prospects through the buyer’s journey and turn them into customers. But the two approaches take different views of the relationship between the tool and the <a href="https://mailchimp.com/resources/smart-goals/" target="_blank"><strong>goal</strong></a>.
  </p>
  <p>
    Digital marketing considers how individual tools or digital channels can <a href="https://mailchimp.com/marketing-glossary/conversion-rates/" target="_blank"><strong>convert</strong></a> prospects. A brand's digital marketing strategy may use <a href="https://mailchimp.com/resources/why-multichannel-campaigns-matter/" target="_blank"><strong>multiple platforms</strong></a> or focus all of its efforts on one platform. For example, a company may primarily create content for social media platforms and email marketing campaigns while ignoring other digital marketing avenues.
  </p>
  <p>
    On the other hand, inbound marketing is a holistic concept. It considers the goal first, then looks at the available tools to determine which will effectively reach target customers, and then at which stage of the sales funnel that should happen. As an example, say you want to <a href="https://mailchimp.com/resources/5-ways-to-increase-website-traffic/" target="_blank"><strong>increase website traffic</strong></a> to generate more prospects and leads. You can focus on search engine optimization when developing your content marketing strategy, resulting in more optimized content, including <a href="https://mailchimp.com/resources/what-is-a-blog/" target="_blank"><strong>blogs</strong></a>, landing pages, and more.
  </p>
  <p>
    The most important thing to remember about digital marketing and inbound marketing is that as a marketing professional, you don’t have to choose between the two. In fact, they work best together. Inbound marketing provides structure and purpose for effective digital marketing to digital marketing efforts, making sure that each digital marketing channel works toward a goal.
  </p>

  <h2>Why is digital marketing important?</h2>
  <p>
    Any type of marketing can help your business thrive. However, digital marketing has become increasingly important because of how accessible digital channels are. In fact, there were 5.45 billion internet users globally as of <a href="https://www.statista.com/statistics/617136/digital-population-worldwide/" target="_blank"><strong>July 2024</strong></a>.
  </p>
  <p>
    From social media to text messages, there are many ways to use digital marketing tactics in order to communicate with your target audience. Additionally, digital marketing has minimal upfront costs, making it a cost-effective marketing technique for small businesses.
  </p>

Formatting Rules:
- Images are resized appropriately and maintain aspect ratio. Use a maximum width of 100% for responsiveness.
- Paragraphs are properly spaced and easy to read.
- Headings and subheadings are clearly defined with appropriate tags. The title should be in <h1> tag.
- Lists are formatted as ordered or unordered lists where applicable.
- Maintain a consistent structure throughout the document.
- Links are properly formatted with the <a> tag.
Just output the formatted result without any new lines or other special characters.
`;

/**
 * Formats & Humanizes the post
 * @param post
 * @param format
 * @returns
 */
export async function postFormatterAndHumanizer(
  post: string,
  format: string
): Promise<Result<string, string>> {
  console.log("Entering formatterAndHumanizer...");
  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      temperature: 1,
      maxTokens: 8000,
      system: FORMAT_AND_HUMANIZE_SYSTEM_PROMPT,
      prompt: `Post: ${post}\nFormat: ${format}`,
    });

    return ok(result.text);
  } catch (error) {
    console.error("Error in formatter: " + error);
    return err("An error has occured from the formatter");
  }
}
