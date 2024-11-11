import { getJson } from "serpapi";

export const serpVideoSearch = async (query: string) => {
  const apikey = process.env.SERP_API_KEY;
  if (!apikey) {
    throw new Error("Serp API key is not set in the environment variables");
  }
  const result = await getJson({
    engine: "youtube",
    search_query: query,
    api_key: apikey,
  });
  if (!result || !result.video_results) {
    throw new Error("Serp API didn't return videos");
  }
  console.log(
    result.video_results
      .slice(0, 5)
      .map(({ title, link }: { title: string; link: string }) => ({
        title,
        link,
      }))
  );
  return result.video_results
    .slice(0, 5)
    .map(({ title, link }: { title: string; link: string }) => ({
      title,
      link,
    }));
};
