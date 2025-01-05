import { SupabaseClient } from "@supabase/supabase-js";
import { generateObject } from "ai";
import Exa from "exa-js";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { z } from "zod";
import { getThrottledGPT4o } from "../get-llm-models.js";
import { getSupabaseClient } from "../get-supabase-client.js";

const SYSTEM_PROMPT = `You will be given a scraped text of a company website. Structure the background data in a way that is easy to understand and use.
`;

export const BackgroundSchema2 = z.object({
  basic: z.object({
    companyName: z.string().nullish(),
    companyUrl: z.string().nullish(),
    industryKeywords: z
      .string()
      .describe("4-5 Keywords related to the company"),
    companyFunction: z
      .string()
      .describe("What the company does in 2-3 sentences"),
    // logo: z.string().nullish(),
    // brandColor: z.string().nullish(),
    //   additionalInfo: z.record(z.string()).optional(),
  }),
  product: z.object({
    valueProposition: z.string().describe("Value proposition of the company"),
    products: z
      .string()
      .nullish()
      .describe(
        "Core products of the company. Leave it null if the information is not obvious."
      ),
    //   competitiveAdvantage: z.string().nullish(),
    //   additionalInfo: z.record(z.string()).optional(),
  }),
  audience: z.object({
    painPoints: z
      .string()
      .nullish()
      .describe("Pain points of the company's target audience"),
    customerProfile: z
      .string()
      .nullish()
      .describe("Customer profile of the company's target audience"),
    // additionalInfo: z.record(z.string()).optional(),
  }),
  // socialProof: z.object({
  //   testimonials: z.string().nullish(),
  //   caseStudies: z.string().nullish(),
  //   achievements: z.string().nullish(),
  //   additionalInfo: z.record(z.string()).optional(),
  // }),
});

export async function autoFillBackground(
  projectId: string,
  companyUrl: string
): Promise<Result<string, string>> {
  // Fetch domain / company url of the project
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { data: project, error: projectError } = await supabase
    .from("Project")
    .select("name,domain,background,description,org_id")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return err(`Error fetching project details: ${projectError.message}`);
  }

  try {
    // Get existing background data first
    const existingBackground = project.background ?? {};

    // Now enrich using exa
    // @ts-ignore
    const exa = new Exa(process.env.EXA_API_KEY ?? "");
    const singleContent = await exa.getContents(companyUrl);

    // Generate new data
    const { object } = await generateObject({
      model: await getThrottledGPT4o(),
      schema: BackgroundSchema2,
      system: SYSTEM_PROMPT,
      prompt: `Scraped company website: ${JSON.stringify(
        singleContent,
        null,
        2
      )}`,
    });

    // Merge existing and new data, preserving existing fields
    const updatedBackground = {
      ...existingBackground, // Keep all existing fields
      ...object, // Add new generated fields
      basic: {
        ...existingBackground.basic, // Keep existing basic fields
        ...object.basic, // Add new basic fields
        companyUrl: companyUrl, // Override with provided URL
      },
    };

    const { error } = await supabase
      .from("Project")
      .update({ background: updatedBackground })
      .eq("id", projectId);

    if (error) {
      console.log("Error updating project background: ", error);
      return err(`Error updating project background: ${error.message}`);
    }

    return ok("Successfully autofilled background data");
  } catch (error) {
    console.log("Error during background autofilling: ", error);
    return err(
      `Error parsing background data: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
