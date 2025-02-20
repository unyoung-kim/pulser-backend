import { generateText } from "ai";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getThrottledClaudeSonnet } from "../../get-llm-models.js";

const SYSTEM_PROMPT = `
You are a professional writer, especially talented at writing a listicle article given an outline.

You will be given an outline and you will need to write a full article about the topic.

<Rules>
- Make sure to use all the links provided in the outline.
- Make the article long and engaging.
- Analyze the example below and make sure to follow similar formatting where each listicle item has a few subsections. Include emojis to some subtitles/subsections.
- Make sure each section is holistic and detailed enough.
- IMPORTANT: Make sure to provide a brief personalized conclusion at the end based on the project information provided.
</Rules>


<Formatting Rules>
- Write a short introduction, then start with the listicle. Also provide a brief conclusion at the end.
- Make sure to return in html but don't include anything like \`\`\`html ...\`\`\` in the output.
- only return the html content, don't include any other text or comments.

<Example>
<h1>The Seven Best Safari Experiences In South Africa</h1>
    
    <p>Embarking on a safari in South Africa is an unforgettable journey filled with iconic wildlife sightings across breathtaking landscapes.</p>
    
    <p>From expansive savannahs to lush forests, the country has a variety of safari experiences that offers something for everyone.</p>
    
    <p>In this article, we've compiled a list of the seven best safaris in South Africa to help you discover popular game reserves and hidden gems, each offering an unforgettable experience.</p>

    <h2>1. Sabi Sands Game Reserve</h2>
    
    <div>
        <p><strong>📍 Location:</strong> Mpumalanga, South Africa</p>
        <p><strong>🛬 Closest airport:</strong> Kruger Mpumalanga International Airport (83 miles)</p>
        <p><strong>👶 Recommended age:</strong> Adults and children of all ages, depending on where you stay</p>
        <p><strong>🦟 Malaria area:</strong> Yes</p>
        <p><strong>🐅 Can You See The Big Five?</strong> Yes</p>
    </div>

    <p>Sabi Sands is a renowned luxury private game reserve located in the Mpumalanga province of South Africa.</p>
    
    <p>It shares an open border with the Kruger National Park, allowing wildlife to move freely between the two areas.</p>
    
    <p>This gives visitors a great opportunity to experience close encounters with a diverse range of animals.</p>
    
    <p>Sabie Sands is a frontrunner for sustainable wildlife conservation and ecotourism.</p>
    
    <p>They put a strong emphasis on their conservation effort meant to protect the habitat and biodiversity of the area without compromising on the 5-star visitor experience.</p>
    
    <p>Visitors can only enter the reserve if they are staying at one of the lodges, which helps control the number of cars and people on the roads.</p>

    <h3>🐾 Common animal sightings in the reserve</h3>
    
    <p>The reserve is well-known for offering incredible opportunities to see leopards and lions, offering visitors a once-in-a-lifetime chance to spot these elusive animals.</p>
    
    <p>Elephants, rhinos, lions, leopards, and buffalo (the Big Five) are common sightings on game drives and may also be spotted on the riverbeds throughout the reserve.</p>
    
    <p>You can expect to see giraffes, zebras, hippos, cheetahs, and various other wildlife when visiting Sabi Sands. Keen birdwatchers can also enjoy the diversity of the species found in the reserve.</p>

    <h3>💡 Spotlight activities</h3>
    
    <div>
        <p>Sabi Sands offers their guests a variety of different activities. Some of their top-rated options include:</p>
        <ul>
            <li>Boma dinners next to the Sabi River</li>
            <li>Horse riding within the game reserve with a professional guide</li>
            <li>Tracking experience where you can look for leopards with a ranger and professional team</li>
            <li>Hot air balloon safari, with sunrise and sunset options</li>
        </ul>
    </div>

    <h3>🏠 Accommodation options</h3>
    
    <p>There are a number of different lodges and private game reserves within Sabi Sands. All the accommodation options are luxury 5-star lodges, ensuring a comfortable travel experience.</p>

    <div>
        <h4>Lion Sands Game Reserve</h4>
        <p>Lion Sands is an upmarket private reserve in Sabi Sands that is all about nature, comfort, and luxury. It contains four lodges, each with its own unique charm and character.</p>
        <p>Choose from large private villas, exclusive suites, or romantic treehouses for a memorable getaway.</p>
        <p>Each lodge offers a range of modern amenities, including en-suite bathrooms, exclusive viewing decks, and private swimming pools.</p>
        <p><strong>Price:</strong> From $220 per person per night.</p>
    </div>

    <div>
        <h4>Inyati Safari Lodge</h4>
        <p>Inyati is a classic African safari lodge located in the western region of Sabi Sands.</p>
        <p>The chalets and luxury safari tents are designed to blend into the surrounding natural environment, offering a fully immersive experience.</p>
        <p>Guests have access to amenities such as outdoor showers, private viewing decks overlooking the Sand River, and excellent hospitality.</p>
        <p><strong>Price:</strong> From $675 per person per night.</p>
    </div>

    <hr>

    <h2>2. Madikwe Game Reserve</h2>
    
    <div>
        <p><strong>📍 Location:</strong> North-West Province, South Africa</p>
        <p><strong>🛬 Closest airport:</strong> Pilanesberg International Airport (86 miles)</p>
        <p><strong>👶 Recommended age:</strong> Children and adults of all ages</p>
        <p><strong>🦟 Malaria area:</strong> No</p>
        <p><strong>🐅 Can You See The Big Five?</strong> Yes</p>
    </div>

    <p>Madikwe is considered one of the country's hidden gems.</p>
    
    <p>It's recognized for its extensive conservation efforts, being one of the only areas to successfully reintroduce endangered species like the African Wild Dog and Cheetah to their habits.</p>
    
    <p>Visitors to Madikwe can expect an upmarket safari experience with comfortable accommodation, personalized services, and immersive activities.</p>
    
    <p>Guests can expect luxurious lodging, attentive staff, unforgettable game drives, cultural experiences, and the opportunity to observe Africa's iconic wildlife.</p>

    <h3>🐾 Common animal sightings in the reserve</h3>
    
    <p>In addition to hosting the Big Five, you can find other notable species, such as giraffes, hyenas, antelope, zebras, and hippos, in the grasslands of Madikwe.</p>
    
    <p>The reserve is a great place to do bird watching, too, with over 350 recorded species in the area. Birdlife includes raptors, waterbirds, and colorful resident and migrant species.</p>

    <h3>💡 Spotlight activities</h3>
    
    <div>
        <p>Madikwe offers a range of activities that will make your stay even more memorable. These include:</p>
        <ul>
            <li>Morning and afternoon game drives on open 4×4 vehicles</li>
            <li>Multi-day safaris that allow visitors to fully immerse themselves in the reserve's setting</li>
            <li>Cultural safari, where you visit one of the local tribes and spend the day together</li>
            <li>Guided bush walks</li>
            <li>Birdwatching</li>
            <li>Stargazing</li>
            <li>Spa treatments</li>
            <li>Breakfast or dinner in the bush</li>
            <li>Children's activities like rock painting, wildlife and nature lessons, and movie nights under the stars</li>
        </ul>
    </div>

    <h3>🏠 Accommodation options</h3>
    
    <p>Madikwe Game Reserve is made up of 4- and 5-star luxury safari lodges and tented camps. The accommodation is a mix of eco-friendly camps, suites, and chalets.</p>

    <div>
        <h4>The Bush House</h4>
        <p>This upmarket lodge was once the original farmhouse before Madikwe was turned into a game reserve.</p>
        <p>The Bush House provides an intimate setting with a relaxed atmosphere that invites guests to make themselves at home.</p>
        <p>Visitors can enjoy the large private outdoor areas, delicious meals, and warm hospitality for the duration of their stay.</p>
        <p><strong>Price:</strong> From $623 per night.</p>
    </div>

    <div>
        <h4>Tuningi Safari Lodge</h4>
        <p>Designed in a historical African colonial style, Tuningi offers luxurious and comfortable accommodation in its six exclusive villas.</p>
        <p>The suites are fitted with modern amenities like indoor and outdoor showers, kitchenettes, and private viewing decks. Guests in the family suites also have access to a private plunge pool.</p>
        <p><strong>Price:</strong> From $2,217 per night.</p>
    </div>

    <hr>

    <h2>3. Shamwari Game Reserve</h2>
    
    <div>
        <p><strong>📍 Location:</strong> Eastern Cape, South Africa</p>
        <p><strong>🛬 Closest airport:</strong> Port Elizabeth International Airport (48.9 miles)</p>
        <p><strong>👶 Recommended age:</strong> All ages are welcome. For game drives and other activities, children must be at least four years old</p>
        <p><strong>🦟 Malaria area:</strong> No</p>
        <p><strong>Can You See The Big Five?</strong> Yes</p>
    </div>

    <p>Whether you're seeking an unforgettable safari experience or a peaceful getaway in the bush, Shamwari is the perfect place to unwind.</p>
    
    <p>The reserve focuses on low-impact tourism, which means they limit the number of visitors. Not only does this help to maintain a tranquil and exclusive environment, but it also allows guests to fully immerse themselves in the natural surroundings.</p>
    
    <p>This private game reserve offers a mixture between open plains, dense bushveld, and riverside forests.</p>
    
    <p>The combination of habitats makes Shamwari an ideal place for a safari if you're looking for a private and memorable game-viewing experience.</p>

    <h3>🐾 Common animal sightings in the reserve</h3>
    
    <p>Shamwari has played a significant role in reintroducing the endangered black rhino into the wild. You can expect to find these animals roaming in the open plains of the reserve.</p>
    
    <p>The game reserve is known for its rich biodiversity, abundant wildlife, and various bird species.</p>
    
    <p>It's home to the Big Five, as well as other species like cheetahs, hyenas, giraffes, zebras, and antelope.</p>
    
    <p>Shamwari also hosts some of the best wildlife protection programs that have helped keep endangered species safe.</p>
    
    <p>Their dedicated team of conservationists also rescues and rehabilitates injured, orphaned, or abandoned animals.</p>

    <h3>💡 Spotlight activities</h3>
    
    <div>
        <p>Enhance your safari experience with the many activities offered by Shamwari Game Reserve, such as:</p>
        <ul>
            <li>Interactive game drives where you'll learn about animal habitats and spoor tracking</li>
            <li>Wilderness bush camp experience</li>
            <li>Guided bush walks</li>
            <li>Birdwatching</li>
            <li>Conservation experience, where you can track and monitor endangered species on the reserve</li>
            <li>Children and teen safari experiences</li>
        </ul>
    </div>

    <h3>Accommodation options</h3>
    
    <p>Shamwari has a range of accommodation options that include luxury lodges and safari camps.</p>
    
    <p>Each lodge and camp offers something unique, from fine dining experiences and spa treatments to immersive wildlife activities.</p>

    <div>
        <h4>Bayethe Tented Lodge</h4>
        <p>Bayethe is an exclusive and secluded safari retreat that offers an immersive experience with its tented accommodation that blends into its surroundings.</p>
        <p>Each tent is fitted with all of the comforts of a 5-star chalet and includes extra amenities like private viewing decks, a hammock area, and a fireplace.</p>
        <p>Guests will also have access to a private plunge pool and a communal area with a central lounge, dining facilities, and Wi-Fi.</p>
        <p><strong>Price:</strong> From $877 per person per night.</p>
    </div>

    <div>
        <h4>Eagles Crag Lodge</h4>
        <p>Eagles Crag is an ultra-luxurious and modern lodge that is perfect for visitors looking for a sophisticated safari experience.</p>
        <p>Each private suite offers breathtaking views of the surrounding cliffs and valleys. They feature spacious bedrooms, indoor and outdoor showers, and private plunge pools.</p>
        <p>Guests will be treated to an all-inclusive stay, including gourmet dinners and a range of safari activities hosted by Eagles Crag.</p>
        <p><strong>Price:</strong> From $1,530 per night.</p>
    </div>

    <hr>

    <h2>4. Amakhala Game Reserve</h2>
    ...

    <h2>Make Your Ultimate Safari Experience Come True</h2>
    <p>Whether you want to spend your holiday birdwatching or dream of seeing the Big Five up close, there is a South African safari for you.</p>

    <p>In this article, we’ve outlined some of the best safari lodges and experiences in the country to help you discover everything South Africa has to offer.</p>

    <p>If you’re looking for more South African holiday inspiration, be sure to check out our other articles on The Seven Best blog.</p>

    <p>With The Seven Best, you’re sure to discover hidden gems that will make your trip to South Africa even more remarkable. </p>

    <h3>The Seven Best</h3>
    <p>The Seven Best was founded by David McCready to share his passion and experiences of South Africa after more than a decade of visiting the country.</p>

    <p>The brand’s name is inspired by Table Mountain in Cape Town, recently named one of the Seven Natural Wonders of the World.</p>

    <p>David and a small team of handpicked writers have come up with curated lists and tips of must-sees and dos when you are visiting South Africa, along with other topics we think you might be interested in to further introduce you to this incredibly diverse country.</p>

    <p>Learn more about The Seven Best <a href="https://thesevenbest.com">here</a>.</p>
</Example>
`;

export async function writerListicle(
  topic: string,
  outline: string,
  projectInfo: string
): Promise<Result<string, string>> {
  try {
    const currentDate = new Date().toLocaleString();

    const article = await generateText({
      model: await getThrottledClaudeSonnet(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: `Topic: ${topic}\n Outline: ${JSON.stringify(
        outline,
        null,
        2
      )}\n Project Info: ${projectInfo}`,
      temperature: 0.6,
      maxTokens: 8000,
    });

    return ok(article.text);
  } catch (error) {
    console.error("Error in writerListicle: ", error);
    return err(`Error in writerListicle: ${error}`);
  }
}
