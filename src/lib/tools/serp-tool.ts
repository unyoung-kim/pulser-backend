import { z } from "zod";
import { tool } from "ai";
import { getJson } from "serpapi";

export const serpTool= () =>
    tool({
        description: "Fetches diverse topic ideas using Google Autocomplete for improved SEO content generation.",
        parameters: z.object({
            query: z.string()
        }),
        execute: async ({ query }: { query: string }) => {
            
            const apikey = process.env.SERP_API_KEY;
            if(!apikey){
                throw new Error("Serp API key is not set in the environment variables")
            }
            const result=  getJson({
                engine: "google_autocomplete",
                q: query,
                api_key: apikey,
            });
            console.log(result);
            return result;
        },
    });
