import { SupabaseClient } from "@supabase/supabase-js";
import { generateText } from "ai";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getThrottledGPT4o } from "../get-llm-models.js";
import { getSupabaseClient } from "../get-supabase-client.js";
import { postFormatter } from "../post-formatter.js";
import { incrementUsageCredit } from "../supabase/usage.js";

const GLOSSARY_SYSTEM_PROMPT = `You are an expert in writing glossary articles for brands for SEO purposes. 

Your task is to write a glossary article for a brand.

1) Make sure you really think through what you will discuss. The glossary article should be long enough like the example provided.
2) It is very important to incorporate around 4-5 internal links that will be included below throughout the article - don’t use it if they are not relevant. 
3) Please generate text that avoids using formal or overly academic phrases such as 'it is worth noting,' 'furthermore,' 'consequently,' 'in terms of,' 'one may argue,' 'it is imperative,' 'this suggests that,' 'thus,' 'it is evident that,' 'notwithstanding,' 'pertaining to,' 'therein lies,' 'utilize,' 'be advised,' 'hence,' 'indicate,' 'facilitate,' 'subsequently,' 'moreover,' and 'it can be seen that.' Aim for a natural, conversational style that sounds like two friends talking at the coffee shop. Use direct, simple language and choose phrases that are commonly used in everyday speech. If a formal phrase is absolutely necessary for clarity or accuracy, you may include it, but otherwise, please prioritize making the text engaging, clear, and relatable.
4) Don't use prases like 'game changer'.
5) Please consider the readability of the article by adding numbered list and/or bullet points.
6) Don't be too salesy - this means that don't push the brand's products and services too hard but just briefly mention them a couple times.

Below is an example glossary about Digital Marketing from a different company:

Example:
### Digital Marketing

- **What is digital marketing?**Digital marketing refers to the online promotion of brands to connect with potential customers through various digital channels, including email, social media, and web-based advertising.
- **How does inbound marketing differ from digital marketing?**Digital marketing focuses on using specific tools to convert prospects, while inbound marketing takes a holistic approach, prioritizing the goal first and then determining the most effective tools to engage target customers.
- **Why is digital marketing important?**It provides broad geographic reach, cost efficiency, measurable results, easier personalization, and better connections with customers.
- **What are some key types of digital marketing?**Search engine optimization (SEO), content marketing, social media marketing, pay-per-click (PPC) marketing, affiliate marketing, native advertising, influencer marketing, marketing automation, and email marketing.
- **What steps should businesses take to create an effective digital marketing strategy?**Set SMART goals, identify the target audience, create a budget, select appropriate digital marketing channels, and refine efforts by analyzing campaign data for future improvements.

Did you know nine-in-ten U.S. adults go online on a daily basis? Not only that, 41% are online “[**almost constantly**](https://www.pewresearch.org/internet/2024/01/31/americans-use-of-mobile-technology-and-home-broadband/).” As a marketer, it’s important to take advantage of the digital world with an online advertising presence, by building a brand, providing a great customer experience that also brings more potential customers and more, with a digital strategy.

A digital marketing strategy allows you to leverage different digital channels–such as social media, pay-per-click, search engine optimization, and email marketing–to connect with existing customers and individuals interested in your products or services. As a result, you can build a brand, provide a great customer experience, bring in potential customers, and more.

!https://eep.io/images/yzco4xsimv0y/3XgkeEYF2gAQnXCpJCdO8F/6efe6c4f7b0e33f5224657eb3f636c7c/ILLO_Spot_Testing_1080.png?w=1600&q=70

## Maximize your digital marketing

Use Mailchimp to promote your brand, reach your target audience, and grow your business.

[Start Free Trial](https://mailchimp.com/pricing/marketing/)

## What is digital marketing?

Digital marketing, also called online marketing, is the promotion of brands to connect with potential customers using the internet and other forms of digital communication. This includes not only [**email**](https://mailchimp.com/marketing-glossary/email-marketing/), [**social media**](https://mailchimp.com/marketing-glossary/social-media-marketing/), and web-based advertising, but also text and multimedia messages as a [**marketing channel**](https://mailchimp.com/resources/what-are-marketing-channels/).

Essentially, if a marketing campaign involves digital communication, it's digital marketing.

## Inbound marketing versus digital marketing

Digital marketing and [**inbound marketing**](https://mailchimp.com/resources/inbound-marketing/) are easily confused, and for good reason. Digital marketing uses many of the same tools as inbound marketing—email and online content, to name a few. Both exist to capture the attention of prospects through the buyer’s journey and turn them into customers. But the two approaches take different views of the relationship between the tool and the [**goal**](https://mailchimp.com/resources/smart-goals/).

Digital marketing considers how individual tools or digital channels can [**convert**](https://mailchimp.com/marketing-glossary/conversion-rates/) prospects. A brand's digital marketing strategy may use [**multiple platforms**](https://mailchimp.com/resources/why-multichannel-campaigns-matter/) or focus all of its efforts on one platform. For example, a company may primarily create content for social media platforms and email marketing campaigns while ignoring other digital marketing avenues.

On the other hand, inbound marketing is a holistic concept. It considers the goal first, then looks at the available tools to determine which will effectively reach target customers, and then at which stage of the sales funnel that should happen. As an example, say you want to [**increase website traffic**](https://mailchimp.com/resources/5-ways-to-increase-website-traffic/) to generate more prospects and leads. You can focus on search engine optimization when developing your content marketing strategy, resulting in more optimized content, including [**blogs**](https://mailchimp.com/resources/what-is-a-blog/), landing pages, and more.

The most important thing to remember about digital marketing and inbound marketing is that as a marketing professional, you don’t have to choose between the two. In fact, they work best together. Inbound marketing provides structure and purpose for effective digital marketing to digital marketing efforts, making sure that each digital marketing channel works toward a goal.

## Why is digital marketing important?

Any type of marketing can help your business thrive. However, digital marketing has become increasingly important because of how accessible digital channels are. In fact, there were 5.45 billion internet users globally as of [**July 2024**](https://www.statista.com/statistics/617136/digital-population-worldwide/).

From social media to text messages, there are many ways to use digital marketing tactics in order to communicate with your target audience. Additionally, digital marketing has minimal upfront costs, making it a cost-effective marketing technique for small businesses.

## B2B versus B2C digital marketing

Digital marketing strategies work for [**B2B**](https://mailchimp.com/resources/business-to-business-marketing/) (business to business) as well as B2C (business to consumer) companies, but best practices differ significantly between the two. Here's a closer look at how digital marketing is used in B2B and B2C marketing strategies:

- **B2B clients tend to have longer decision-making processes, and thus longer sales funnels**. Relationship-building strategies work better for these clients, whereas B2C customers tend to respond better to short-term offers and messages.
- **B2B transactions are usually based on logic and evidence**, which is what skilled B2B digital marketers present. B2C content is more likely to be emotionally-based, focusing on making the customer feel good about a purchase.
- **B2B decisions tend to need more than 1 person's input**. The marketing materials that best drive these decisions tend to be shareable and downloadable. B2C customers, on the other hand, favor one-on-one connections with a brand.

Of course, there are exceptions to every rule. A B2C company with a high-ticket product, such as a car or computer, might offer more informative and serious content. As a result, your digital marketing strategy always needs to be geared toward your own customer base, whether you're B2B or B2C.

Take a look at your current audience to create well-informed and targeted online marketing campaigns. Doing so ensures your marketing efforts are effective and you can capture the attention of potential customers.

## Types of digital marketing

There are as many specializations within digital marketing as there are ways of interacting using digital media. Here are a few key examples of [**types of digital marketing**](https://mailchimp.com/resources/types-of-marketing/) tactics.

### Search engine optimization

Search engine optimization, or [**SEO**](https://mailchimp.com/marketing-glossary/seo/), is technically a marketing tool rather than a form of marketing in itself. It is often called "an art and a science."

The "science" part of SEO is what’s most important. SEO is a science because it requires you to research and weigh different contributing factors to achieve the highest possible ranking on a [**search engine results page (SERP)**](https://mailchimp.com/marketing-glossary/serp/).

Today, the most important elements to consider when optimizing a web page for search engines include:

- Quality and uniqueness of content
- Optimization of key elements for the targeted keyword (URL, title tag, H1, sub headlines)
- Level of user engagement (time on page, bounce rate)
- Number and quality of [**backlinks**](https://mailchimp.com/marketing-glossary/backlinks/)
- Internal linking

In addition to the elements above, you need to prioritize [**technical SEO**](https://mailchimp.com/resources/technical-seo/), which is all the back-end components of your site. This includes mobile-friendliness and loading times. Improving your technical SEO can help search engines better navigate and crawl your site.

The strategic use of these factors makes search engine optimization a science, but the unpredictability involved makes it an "art" that often requires experienced SEO professionals.

Ultimately, the goal is to rank at or near the top of the first page of a search engine’s result page or in Google's [**AI Overviews**](https://mailchimp.com/resources/google-sge-ai-overviews/). This ensures that those searching for a specific query related to your brand can easily find your products or services. While there are many search engines, digital marketers often focus on Google since it's a global leader in the search engine market.

Google and other search engines change their algorithm [**almost constantly**](https://seo-hacker.com/google-updates-everyday/), so SEO is a never-ending progress. And your competitors most likely also invest in SEO. What you can do is closely monitor your page's performance and make adjustments as needed.

### Content marketing

As mentioned, the quality of your content is a key component of an optimized page. As a result, SEO is a major factor in [**content marketing**](https://mailchimp.com/marketing-glossary/content-marketing/), a strategy based on the distribution of relevant and valuable content to a [**target audience**](https://mailchimp.com/marketing-glossary/target-audience/).

As in any marketing strategy, the goal of content marketing is to [**attract leads**](https://mailchimp.com/resources/what-is-lead-generation/) that ultimately convert into customers. But it does so differently than traditional advertising. Instead of enticing prospects with potential value from a product or service, it offers value for free in the form of written material, such as:

- Blog posts
- E-books
- Newsletters
- Video or audio transcripts
- Whitepapers
- Infographics

[**Content marketing matters**](https://www.siegemedia.com/strategy/content-marketing-statistics), and there are plenty of stats to prove it:

- 84% of consumers expect companies to produce entertaining and helpful content experiences
- 62% of companies that have at least 5,000 employees produce content daily
- 92% of marketers believe that their company values content as an important asset

As effective as content marketing is, it can be tricky. Content marketing writers need to be able to rank highly in search engine results while also engaging people who will read the material, share it, and interact further with the brand. When the content is relevant, it can establish strong relationships throughout the pipeline.

To create effective content that’s highly relevant and engaging, it’s important to identify your audience. Who are you ultimately trying to reach with your content marketing efforts? Once you have a better grasp of your audience, you can determine the type of content you'll create. You can use many formats of content in your content marketing, including videos, blog posts, printable worksheets, and more.

Regardless of which content you create, it’s a good idea to follow content marketing best practices. This means making content that’s grammatically correct, free of errors, easy to understand, relevant, and interesting. Your content should also funnel readers to the next stage in the pipeline, whether that’s a free consultation with a sales representative or a signup page.

### Social media marketing

Social media marketing means [**driving traffic**](https://mailchimp.com/resources/5-ways-to-increase-website-traffic/) and [**brand awareness**](https://mailchimp.com/resources/set-your-brand-apart/) by engaging people in discussion online. You can use social media marketing to highlight your brand, products, services, culture, and more. With billions of people spending their time engaging on social media platforms, focusing on social media marketing can be worthwhile.

The most popular digital platforms for social media marketing are [**Facebook**](https://mailchimp.com/marketing-glossary/facebook-ads/), X, and [**Instagram**](https://mailchimp.com/marketing-glossary/instagram-ads/), with LinkedIn and [**YouTube**](https://mailchimp.com/marketing-glossary/youtube-advertising/) not far behind. Ultimately, which social media platforms you use for your business depends on your goals and audience. For example, if you want to find new leads for your FinTech startup, [**targeting your audience on LinkedIn**](https://mailchimp.com/resources/linkedin-lead-generation/) is a good idea since industry professionals are active on the platform. On the other hand, running social media ads on Instagram may be better for your brand if you run a B2C focused on younger consumers.

Because social media marketing involves active audience participation, it has become a popular way of getting attention. Social media marketing offers built-in engagement [**metrics**](https://mailchimp.com/marketing-glossary/marketing-analytics/), which are extremely useful in helping you to understand how well you're [**reaching your audience**](https://mailchimp.com/resources/7-ways-to-grow-your-audience/). You get to decide which types of interactions mean the most to you, whether that means the number of shares, comments, or total clicks to your [**website**](https://mailchimp.com/features/website-builder/).

Direct purchase may not even be a [**goal of your social media marketing strategy**](https://mailchimp.com/resources/how-to-market-on-social-media/). Many brands use social media marketing to start dialogues with audiences rather than encourage them to spend money right away. This is especially common in brands that target older audiences or [**offer products and services not appropriate for impulse buys**](https://mailchimp.com/resources/product-market-fit/). It all depends on your company's social media marketing goals.

To create an effective social media marketing strategy, it’s crucial to follow best practices. Here are a few of the most important social media marketing best practices:

- Craft high-quality and engaging content
- Reply to comments and questions in a professional manner
- Create a social media posting schedule
- Post at the right time
- Hire social media managers to support your marketing efforts
- Know your audience and which social media channels they’re most active on

To learn more about how Mailchimp can help with your social media strategy, check out the comparison of our [**free social media management tools**](https://mailchimp.com/resources/free-social-media-management-tools/) versus others.

### Pay-per-click marketing

Pay-per-click, or PPC, is a form of digital marketing in which you pay a fee every time someone clicks on your digital ads. So, instead of paying a set amount to constantly run targeted ads on online marketing channels, you only pay for the ads individuals interact with. How and when people see your ad is a bit more complicated.

One of the most common types of PPC is search engine advertising, and because Google is the most popular search engine, many businesses use Google Ads for this purpose. When a spot is available on a [**search engine results page**](https://mailchimp.com/marketing-glossary/serp/), also known as a SERP, the engine fills the spot with what is essentially an instant auction. An algorithm prioritizes each available ad based on a number of factors, including:

- Ad quality
- Keyword relevance
- [**Landing page**](https://mailchimp.com/marketing-glossary/landing-pages/) quality
- Bid amount

PPC ads are then placed at the top of search engine result pages based on the factors above whenever a person searches for a specific query.

Each PPC campaign has 1 or more target actions that viewers are meant to complete after clicking an ad. These actions are known as conversions, and they can be transactional or non-transactional. Making a purchase is a conversion, but so is a newsletter signup or a call made to your home office.

Whatever you choose as your target conversions, you can track them via your chosen digital marketing channels to see how your campaign is doing.

### Affiliate marketing

[**Affiliate marketing**](https://mailchimp.com/resources/what-is-affiliate-marketing/) is a digital marketing tactic that lets someone make money by promoting another person's business. You could be either the promoter or the business who works with the promoter, but the process is the same in either case.

It works using a revenue sharing model. If you're the affiliate, you get a commission every time someone purchases the item that you promote. If you're the merchant, you pay the affiliate for every sale they help you make.

Some affiliate marketers choose to review the products of just 1 company, perhaps on a blog or other third-party site. Others have relationships with multiple merchants.

Whether you want to be an affiliate or find one, the first step is to make a connection with the other party. You can use digital channels designed to connect affiliates with retailers, or you can start or join a single-retailer program.

If you're a retailer and you choose to work directly with affiliates, there are many things you can do to make your program appealing to potential promoters. You'll need to provide those affiliates with the tools that they need to succeed. That includes incentives for great results as well as marketing tools and pre-made materials.

### Native advertising

Native advertising is digital marketing in disguise. Its goal is to blend in with its surrounding content so that it’s less blatantly obvious as advertising.

Native advertising was created in reaction to the cynicism of today's consumers toward ads. Knowing that the creator of an ad pays to run it, many consumers will conclude that the ad is biased and consequently ignore it.

A native ad gets around this bias by offering information or entertainment before it gets to anything promotional, downplaying the "ad" aspect.

It’s important to always label your native ads clearly. Use words like “promoted” or “sponsored.” If those indicators are concealed, readers might end up spending significant time engaging with the content before they realize that it's advertising.

When your consumers know exactly what they're getting, they'll feel better about your content and your brand. Native ads are meant to be less obtrusive than traditional ads, but they’re not meant to be deceptive.

### Influencer marketing

Like affiliate marketing, influencer marketing relies on working with an influencer–an individual with a large following, such as a celebrity, industry expert, or content creator–in exchange for exposure. In many cases, these influencers will endorse your products or services to their followers on several social media channels.

Influencer marketing works well for B2B and B2C companies who want to reach new audiences. However, it’s important to partner with reputable influencers since they’re essentially representing your brand. The wrong influencer can tarnish the trust consumers have with your business.

### Marketing automation

[**Marketing automation**](https://mailchimp.com/marketing-glossary/marketing-automation/) uses software to power digital marketing campaigns, improving the efficiency and relevance of advertising. As a result, you can focus on creating the strategy behind your digital marketing efforts instead of cumbersome and time-consuming processes.

While marketing automation may seem like a luxury tool your business can do without, it can significantly improve the engagement between you and your audience.

According to statistics:

- [**90% of US consumers**](https://www.statista.com/topics/4481/personalized-marketing/) find [**personalization**](https://mailchimp.com/marketing-glossary/personalized-marketing/) either “very” or “somewhat” appealing
- [**81% of consumers**](https://www.statista.com/topics/4481/personalized-marketing/) would like the brands they engage with to understand them better

Marketing automation lets companies keep up with the expectation of personalization. It allows brands to:

- Collect and analyze consumer information
- [**Design targeted marketing campaigns**](https://mailchimp.com/resources/how-to-create-campaigns-that-deliver-results/)
- Send and post digital marketing messages at the right times to the right audiences

Many [**marketing automation tools**](https://mailchimp.com/solutions/marketing-automation-tools/) use prospect engagement (or lack thereof) with a particular message to determine when and how to reach out next. This level of real-time customization means that you can effectively create an individualized marketing strategy for each customer without any additional time investment.

Mailchimp's marketing automation tools ensure you can interact with your audience via behavior-based automations, transactional emails, date-based automations, and more.

### Email marketing

The concept of [**email marketing**](https://mailchimp.com/marketing-glossary/email-marketing/) is simple—you send a promotional message and hope that your prospect clicks on it. However, the execution is much more complex. First of all, you have to make sure that your emails are wanted. This means having an email marketing provider that offers the following is crucial:

- Individualizes the content, both in the body and in the subject line
- An [**email signature**](https://mailchimp.com/resources/email-signature-formats/) that offers a clear unsubscribe option
- Both, transactional and promotional emails

You want your prospects to see your campaign as a valued service, not just as a promotional tool.

Email marketing is a proven, effective technique all on its own, but it can be even better if you incorporate other digital marketing techniques such as marketing automation, which lets you [**segment**](https://mailchimp.com/marketing-glossary/audience-segmentation/) and schedule your emails so that they meet your customer's needs more effectively.

If you’re considering email marketing, here are a few tips that can help you craft great email marketing campaigns:

- Segment your audience to send relevant campaigns to the right people
- Ensure emails look good on mobile devices
- Create a campaign schedule
- Run A/B tests

### Mobile marketing

Mobile marketing is a digital marketing strategy that allows you to engage with your target audience on their mobile devices, such as smartphones and tablets. This can be via SMS and MMS messages, social media notifications, mobile app alerts, and more.

It’s crucial to ensure that all content is optimized for mobile devices. According to the Pew Research Center, [**Nine-in-ten Americans own a smartphone**](https://www.pewresearch.org/internet/fact-sheet/mobile/), so your marketing efforts can go a long way when you create content for computer and mobile screens.

## The benefits of digital marketing

Digital marketing has become prominent largely because it reaches such a wide audience of people. However, it also offers a [**number of other advantages**](https://www.nibusinessinfo.co.uk/content/advantages-and-disadvantages-digital-marketing) that can boost your marketing efforts. These are a few of the benefits of digital marketing.

### A broad geographic reach

When you post an ad online, people can see it no matter where they are (provided you haven’t limited your ad geographically). This makes it easy to grow your business's market reach and connect with a larger audience across different digital channels.

### Cost efficiency

Digital marketing not only reaches a broader audience than traditional marketing but also carries a lower cost. Overhead costs for newspaper ads, television spots, and other traditional marketing opportunities can be high. They also give you less control over whether your target audiences will see those messages in the first place.

With digital marketing, you can create just one content piece that draws visitors to your blog as long as it's active. You can create an email marketing campaign that delivers messages to targeted customer lists on a schedule, and it's easy to change that schedule or the content if you need to do so.

When you add it all up, digital marketing gives you much more flexibility and customer contact for your ad spend.

### Quantifiable results

To know whether your marketing strategy works, you have to find out how many customers it attracts and how much revenue it ultimately drives. But how do you do that with a non-digital marketing strategy?

There's always the traditional option of asking each customer, “How did you find us?"

Unfortunately, that doesn't work in all industries. Many companies don't get to have one-on-one conversations with their customers, and surveys don't always get complete results.

With digital marketing, results monitoring is simple. Digital marketing software and platforms automatically track the number of desired conversions that you get, whether that means email open rates, visits to your home page, or direct purchases.

### Easier personalization

Digital marketing allows you to [**gather customer data**](https://mailchimp.com/crm/what-is-crm/) in a way that offline marketing can't. Data collected digitally tends to be much more precise and specific.

Imagine you offer financial services and want to send out special offers to internet users people who have looked at your products. You know you'll get better results if you target the offer to the person's interest, so you decide to prepare 2 campaigns. One is for young families who have looked at your life insurance products, and the other is for millennial entrepreneurs who have considered your retirement plans.

How do you gather all of that data without automated tracking? How many phone records would you have to go through? How many customer profiles? And how do you know who has or hasn't read the brochure you sent out?

With digital marketing, all of this information is already at your fingertips.

### More connection with customers

Digital marketing lets you communicate with your customers in real-time. More importantly, it lets them communicate with you.

Think about your social media strategy. It's great when your target audience sees your latest post, but it's even better when they comment on it or share it. It means more [**buzz surrounding your product or service**](https://mailchimp.com/marketing-glossary/product-differentiation/), as well as increased visibility every time someone joins the conversation.

Interactivity benefits your customers as well. Their level of engagement increases as they become active participants in your brand's story. That sense of ownership can create a strong sense of [**brand loyalty**](https://mailchimp.com/resources/build-brand-loyalty/).

### Easy and convenient conversions

Digital marketing lets your customers take action immediately after viewing your ad or content. With traditional advertisements, the most immediate result you can hope for is a phone call shortly after someone views your ad. But how often does someone have the time to reach out to a company while they're doing the dishes, driving down the highway, or updating records at work?

With digital marketing, they can click a link or save a [**blog post**](https://mailchimp.com/resources/how-to-write-blog-post/) and move along the sales funnel right away. They might not make a purchase immediately, but they’ll stay connected with you and give you a chance to interact with them further.

## How to create a digital marketing strategy

For many small businesses and beginner digital marketers, getting started with digital marketing can be difficult. However, you can create an effective digital marketing strategy to increase brand awareness, engagement, and sales by using the following steps as your starting point.

### Set SMART goals

Setting specific, measurable, achievable, relevant, and timely (SMART) goals is crucial for any marketing strategy. While there are many goals you may want to achieve, try to focus on the ones that will propel your strategy forward instead of causing it to remain stagnant.

### Identify your audience

Before starting any marketing campaign, it’s best to identify your target audience. Your target audience is the group of people you want your campaign to reach based on similar attributes, such as age, gender, demographic, or purchasing behavior. Having a good understanding of your target audience can help you determine which digital marketing channels to use and the information to include in your campaigns.

### Create a budget

A budget ensures you’re spending your money effectively towards your goals instead of overspending on digital marketing channels that may not provide the desired results. Consider your SMART goals and the digital channel you’re planning to use to create a budget.

### Select your digital marketing channels

From content marketing to PPC campaigns and more, there are many digital marketing channels you can use to your advantage. Which digital marketing channels you use often depends on your goals, audience, and budget.

### Refine your marketing efforts

Make sure to analyze your campaign's data to identify what was done well and areas for improvement once the campaign is over. This allows you to create even better campaigns in the future. With the help of digital technologies and software, you can obtain this data in an easy-to-view dashboard. Mailchimp’s digital marketing analytics reports will help you keep track of all your marketing campaigns in one centralized location.

## Digital marketing creates growth

Digital marketing should be one of the primary focuses of almost any business’s overall marketing strategy. Never before has there been a way to stay in such consistent contact with your customers, and nothing else offers the level of personalization that digital data can provide. The more you embrace the possibilities of digital marketing, the more you'll be able to realize your company's growth potential.

**In our [Marketing Library](https://mailchimp.com/resources/), you can find numerous articles on all aspects of digital marketing.**`;

export async function glossaryWorkflow({
  projectId,
  inputTopic,
  keywordId,
}: {
  projectId: string;
  inputTopic?: string;
  keywordId: string;
}): Promise<Result<string, string>> {
  try {
    console.log("Generating Glossary Article..");
    const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();
    const currentDate = new Date().toLocaleString();

    if (supabaseClient.isErr) {
      return err(supabaseClient.error);
    }

    const supabase = supabaseClient.value;

    // Fetch project data from Supabase
    const { data: project, error } = await supabase
      .from("Project")
      .select("name, background, org_id")
      .eq("id", projectId)
      .single();

    if (error) {
      return err(`Failed to fetch project: ${error.message}`);
    }

    if (!project) {
      return err(`Project not found with id: ${projectId}`);
    }

    // Fetch all internal links of the project
    const { data: internalLinks, error: internalLinksError } = await supabase
      .from("InternalLink")
      .select("url")
      .eq("project_id", projectId);

    // Find keyword using keywordId
    const { data: keyword, error: keywordError } = await supabase
      .from("Keyword")
      .select("keyword")
      .eq("id", keywordId)
      .single();

    if (internalLinksError) {
      return err(
        `Failed to fetch internal links: ${internalLinksError.message}`
      );
    }

    const prompt = `Below is the information about the company and the internal links of the website.

    Company Name: ${project.name}

    Company Details: 
    ${JSON.stringify(project.background, null, 2)}

    Internal Links: 
    ${JSON.stringify(internalLinks, null, 2)}
    
    Terminology: ${inputTopic}

    Glossary Terminology to write about: ${keyword?.keyword}`;

    const glossaryArticle = await generateText({
      model: await getThrottledGPT4o(),
      system: GLOSSARY_SYSTEM_PROMPT,
      prompt: prompt,
      temperature: 1,
      maxTokens: 8000,
    });

    console.log("Glossary Article: ", glossaryArticle);

    const finalPost: Result<string, string> = await postFormatter(
      `Topic: ${inputTopic}\nArticle: ${glossaryArticle.text}`,
      "HTML"
    );

    if (finalPost.isErr) {
      return err(finalPost.error);
    }

    const { data: dataContentInsert, error: errorContentInsert } =
      await supabase
        .from("Content")
        .insert([
          {
            status: "draft",
            project_id: projectId,
            title: inputTopic,
            keyword_id: keywordId,
            type: "GLOSSARY",
          },
        ])
        .select();

    if (errorContentInsert) {
      return err(`Error saving content: ${errorContentInsert.message}`);
    }

    const id: string | null = dataContentInsert?.at(0)?.id ?? null;

    if (id == null || id.length == 0) {
      return err("Error fetching content id");
    }

    const { error: errorContentBodyInsert } = await supabase
      .from("ContentBody")
      .insert([
        {
          content_id: id,
          body: finalPost.value,
        },
      ]);

    const incrementUsageCreditResult: Result<string, string> =
      await incrementUsageCredit(supabase, project?.org_id ?? "", "GLOSSARY");

    if (incrementUsageCreditResult.isErr) {
      return err(incrementUsageCreditResult.error);
    }

    console.log(
      "Successfully created and saved glossary article for",
      project.name
    );

    return ok("Successfully created and saved glossary article");
  } catch (error) {
    console.error("Error in glossary workflow:", error);
    return err("An error has occured from the glossary workflow");
  }
}
