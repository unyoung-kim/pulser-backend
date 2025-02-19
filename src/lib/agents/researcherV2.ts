import { generateText } from "ai";
import { err, ok, Result } from "true-myth/result";
import { getThrottledGPT4o } from "../get-llm-models.js";
import { searchToolResearcher } from "../tools/researcher/search-tool.js";

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
    7) NEVER add any case studies unless explicitly provided in the user instructions.
  </General>

  <Introduction>
    1) The introduction should provide value instantly and mention about the pain point of the audience.
    2) If client background includes social proof or credibility, make sure to include it in the introduction outline to build trust.
    3) Conduct research to find some unique insight about the topic like a quote, statistic, or a surprising fact and add it to the outline with the source. And when you add the insight, make sure to add the source as well.
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
- Unique insight: According to a recent study, 81% of gym-goers prefer a mix of digital and in-person fitness experiences 
- Introduction to SpearPoint Marketing LLC and how they help fitness businesses thrive in the digital age

## II. The Fitness Industry Landscape in 2024
- Current state of the fitness market
- Key challenges facing gym owners and fitness professionals
- Opportunities for growth and innovation

## III. Leveraging Digital Marketing Trends
### A. Fitness Marketing Funnels
- Explanation of marketing funnels in the fitness context
- Steps to create an effective fitness marketing funnel

### B. Embracing Wearable Technology
- The rise of wearable tech in fitness
- How to incorporate wearable data into your marketing strategy
- Examples of successful wearable tech integrations in fitness marketing

### C. Influencer Marketing in the Fitness Space
- The power of fitness influencers in 2024
- How to choose the right influencers for your brand
- Tips for creating authentic influencer partnerships

## IV. Personalization and AI-Driven Marketing
### A. AI-Powered Fitness Apps and Platforms
- The role of AI in personalizing fitness experiences
- How to use AI for targeted marketing campaigns

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

## IX. Local SEO and Google My Business Optimization
- The importance of local SEO for gyms and fitness studios
- Tips for optimizing Google My Business listings
- How SpearPoint Marketing's SEO expertise can boost local visibility for fitness businesses

</outline>
</Example>

Think step by step before you come up with the outline and only return the outline inside <outline> tags.
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
    7) NEVER add any case studies unless explicitly provided in the user instructions.
  </General>

  <Introduction>
    1) The introduction should provide value instantly and mention about the pain point of the audience.
    2) If client background includes social proof or credibility, make sure to include it in the introduction outline to build trust.
    3) Conduct research to find some unique insight about the topic like a quote, statistic, or a surprising fact and add it to the outline with the source. And when you add the insight, make sure to add the source as well.
  </Introduction>

  <Links>
    1) Make sure to include [Link: ...] for each section.
    2) Include as many links / sources as many sources through out the article in the [Link: ...] format.
    3) It is extremely important that you don't add a link of a potential competitor in the outline.
  </Links>
</Rules>

Think step by step before you come up with the outline and only return the outline inside <outline> tags.
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

const SYSTEM_PROMPT = `As a professional seo expert, your task is to come up with a detailed outline for an SEO blog post for a client in markdown format.

You will be given the following input:
  1) a blog post topic
  2) user instruction(optional)

You possess the ability to search for any information on the web.

Conduct a research on the topic. Then, come up with the outline of the blog post based on your research.

**Rules**:
1) Only return the outline content without any other text.
2) Research and include a statistic in the introduction outline and include the source as well. If there's more interesting statistics found, include it throughout the outline.
3) Make sure to follow user instruction, if provided, to generate the outline 
4) Do not include conclusion or any "Final Thoughts" type of section in the outline. 
5) You must conduct research and you are not allowed to add links that are not from the research.
6) Do not add any case studies unless explicitly provided in the user instructions.
7) Make sure links are added to the Statistics next to Source in [Source: ...] format.
8) Create plenty of subtopics and subsubtopics to make the outline more detailed and comprehensive.
9) Add around 10 sections to the outline. Then add an Frequently Asked Questions section at the end.
10) If the user instruction is an outline, make sure to follow it strictly.

Example Format:
# Outline: **How to Save HR Managers 10+ Hours a Week on Employee Onboarding**

## 1. Introduction
- **Article Title**: *How to Save HR Managers 10+ Hours a Week on Employee Onboarding*  
- **Purpose**: Present strategies and tools for HR professionals to significantly reduce time spent on onboarding.  
- **Key Insight**: With a mix of tech solutions, personalized approaches, and well-structured timelines, companies can streamline onboarding and improve new-hire satisfaction.

> **Statistic**: “According to a SHRM study, HR managers can spend up to 25% of their time on manual onboarding tasks, signaling a clear need for more efficient processes.” [Source: https://www.shrm.org/resourcesandtools/employee-onboarding-stats]

---

## 2. Key Takeaways
- **Leverage Technology**: Adopt paperless systems and onboarding software to automate repetitive tasks.  
- **Personalize Onboarding**: Tailor training and role expectations to keep new hires engaged.  
- **Extend Timelines**: A longer onboarding period encourages deeper understanding and better retention.  
- **Create Support**: Onboarding buddies and well-prepared workspaces foster a welcoming environment.  
- **Measure Effectiveness**: Use metrics and feedback to continuously refine the onboarding process.

---

## 3. Streamlining Onboarding with Technology
- **Overview**: Technology can automate paperwork, scheduling, and communication, freeing HR for more strategic tasks.

### 3.1 Implementing Paperless Processes
- Reduces clutter and manual form-filling.  
- Reflects a modern company culture and saves on administrative costs.  
- New hires appreciate the efficiency, speeding up their integration.

### 3.2 Utilizing Onboarding Software
- Centralizes new-hire info and automates key tasks (email reminders, digital forms).  
- Offers a consistent, branded experience.  
- Frees HR managers from repetitive follow-up.

### 3.3 Automating Routine Tasks
- Handles welcome emails, training reminders, and paperwork deadlines automatically.  
- Lets HR focus on personal interactions rather than administrative duties.  
- Improves communication consistency with new hires.

> **Quote**: “When technology handles routine tasks, HR can focus on building relationships and a positive onboarding experience.”

---

## 4. Creating a Personalized Onboarding Experience
- **Overview**: Customization keeps new hires engaged and builds role-specific competency quicker.

### 4.1 Tailoring Information to Individual Roles
- Provide role-specific guidelines and resources.  
- Avoid irrelevant details that cause confusion or information overload.  
- Strengthens confidence by giving targeted, relevant knowledge.

### 4.2 Setting Clear Expectations
- Communicate performance goals, timelines, and departmental objectives.  
- Explain the rationale behind tasks to encourage ownership.  
- Reduces uncertainty, boosting new-hire confidence.

### 4.3 Providing Role-Specific Training
- Offer training sessions, job shadowing, or online courses aligned with the job’s unique requirements.  
- Ensures faster skill acquisition and better initial performance.  
- Makes new hires feel their development matters from day one.

> **Quote**: “Personalization isn’t just a perk—it's a catalyst for faster integration and stronger employee loyalty.”

---

## 5. Extending the Onboarding Timeline for Better Integration
- **Overview**: A drawn-out onboarding process supports deeper learning and stronger team bonds.

### 5.1 Benefits of a Longer Onboarding Process
- Allows more time for questions, gradual skill-building, and cultural assimilation.  
- Less stress on new hires, leading to higher engagement and reduced turnover.  
- Encourages steady growth rather than rushing into tasks.

### 5.2 Setting Milestones for New Hires
- Define clear objectives at day 7, day 30, and day 90.  
- Helps both managers and employees track progress and address gaps early.  
- Creates a roadmap for success, lessening the feeling of being “lost.”

### 5.3 Continuous Feedback and Support
- Schedule regular check-ins (both informal chats and formal reviews).  
- Provide constructive input and guidance as they adapt.  
- Reinforces a culture of openness and learning from the start.

> **Statistics**: "According to a study, 70% of employees who receive effective onboarding report feeling more confident in their roles." [Source: https://www.gallup.com/workplace/reports/employee-onboarding-statistics-2023]

---

## 6. Building a Supportive Onboarding Environment
- **Overview**: A warm, organized environment eases the transition and fosters stronger connections.

### 6.1 Assigning Onboarding Buddies
- Pair new hires with experienced peers who can answer everyday questions.  
- Creates a welcoming atmosphere and speeds up cultural adaptation.  
- Reduces intimidation by offering peer-level support.

### 6.2 Preparing the Workspace
- Ensure desk, hardware, and software are ready before the start date.  
- Consider small personal touches (welcome note, company swag).  
- Sends a message of preparedness and respect for the new hire’s arrival.

### 6.3 Encouraging Open Communication
- Invite questions and feedback early and often.  
- Hold informal catch-ups or coffee chats in the first weeks.  
- Reinforces trust and shows that employee input is valued.

> **Quote**: “When new employees see tangible signs of preparation and approachability, they feel immediately at home.”

---

## 7. Enhancing Engagement Through Effective Onboarding
- **Overview**: Engaged employees learn faster, contribute more, and are less likely to quit.

### 7.1 Fostering Early Connections
- Introduce the new hire to the team, perhaps even before day one.  
- Encourage social interactions, like team lunches or virtual meetups.  
- Establishes a sense of belonging and camaraderie.

### 7.2 Aligning Company Culture and Values
- Communicate mission, vision, and core principles clearly.  
- Show how roles tie into the bigger organizational picture.  
- Increases motivation by giving meaning to their work.

### 7.3 Measuring Onboarding Success
- Collect feedback via surveys or interviews to gauge satisfaction and identify gaps.  
- Monitor retention metrics and time-to-productivity indicators.  
- Refine processes based on real data and experiences.

> **Quote**: “Well-integrated hires become brand ambassadors, driving a positive culture and boosting overall team morale.”

---

## 8. Reducing Turnover with Strategic Onboarding
- **Overview**: Thoughtful onboarding practices lead to higher retention and lower recruitment costs.

### 8.1 Understanding the Cost of Poor Onboarding
- High turnover wastes resources spent on recruiting, training, and lost productivity.  
- A strategic approach increases your ROI by nurturing talent effectively.  
- Avoids the cycle of constantly re-hiring and re-training.

### 8.2 Implementing a 7-30-90 Day Plan
- **7 Days**: Introduction to company culture, core job responsibilities.  
- **30 Days**: Stronger comfort with tasks, starting to add tangible value.  
- **90 Days**: Full integration, consistent performance, deeper engagement.

### 8.3 Retaining Talent Through Engagement
- Encourage managers to conduct frequent check-ins.  
- Facilitate social connections and mentorship opportunities.  
- Reinforce support beyond the first week to keep employees committed long-term.

> **Quote**: “Effective onboarding directly influences whether a new hire stays engaged or begins browsing for their next role.”

---

## 9. Avoiding Common Onboarding Pitfalls
- **Information Overload**: Overwhelming new hires with too many details on day one can slow productivity. Break down training into smaller modules instead.  
- **Inconsistent Department Practices**: When each department does onboarding differently, it can lead to confusion. Use a standardized checklist to unify the experience.  
- **No Defined Milestones**: If new hires don’t know what’s expected in their first weeks or months, they can feel lost. Setting 7-30-90 day targets helps track progress.  
- **Underutilizing Technology**: Relying on paper forms and manual emails hinders efficiency. Adopt onboarding software to automate repetitive tasks.  
- **Lack of Personalization**: One-size-fits-all onboarding can miss the specific needs of different roles. Provide role-specific resources and training for higher engagement.  
- **Neglecting Long-Term Support**: Focusing only on the first day or week can make employees feel abandoned later. Extend onboarding over weeks or months with ongoing feedback.

> **Quote**: “Small but strategic tweaks to your onboarding process can prevent confusion, reduce attrition, and foster a smoother integration.”

---

## 10. Frequently Asked Questions
- What are the key benefits of automating the onboarding process?
- How can personalized onboarding improve employee retention?
- How long should an effective onboarding program last?
- Why is extending the onboarding timeline beneficial?`;

/**
 * This is a sequential approach to the researcher agent. This is a more deterministic approach and it also preserves more information from the initial research.
 * @param query
 * @returns
 */
export async function researcherV2(
  topic: string,
  // clientDetails: string,
  instruction?: string
): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();
    // Generate the initial outline
    const outline = await generateText({
      model: await getThrottledGPT4o(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Topic: ${topic}\n User Instruction: ${instruction}`,
      tools: {
        search: searchToolResearcher(),
      },
      temperature: 0.6,
      maxSteps: 3,
      maxTokens: 8000,
    });

    return ok(outline.text);
  } catch (error) {
    console.error("Error in researcher:", error);
    return err("An error has occured from the researcher");
  }
}
