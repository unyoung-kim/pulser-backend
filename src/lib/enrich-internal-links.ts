import { createClient } from '@supabase/supabase-js'
import { crawlImportantInternalLinks } from './internal-link/scrape.js'
import Exa from "exa-js";
import { err, ok, Result } from 'true-myth/result';

// Define the interface for enriched URL
export interface EnrichedURL {
    id: string;
    // highlights: string[];
    // text: string;
    summary: string
}

export async function enrichInternalLinks(projectId: string): Promise<Result<EnrichedURL[],string>> {

    const supabaseURLResult: Result<string,string> = process.env.SUPABASE_URL ? ok(process.env.SUPABASE_URL) : err("Supabase URL is not defined");
    const supabaseKeyResult: Result<string,string> = process.env.SUPABASE_KEY ? ok(process.env.SUPABASE_KEY) : err("Supabase Key is not defined");

    if (supabaseURLResult.isErr) return err(supabaseURLResult.error);
    if (supabaseKeyResult.isErr) return err(supabaseKeyResult.error); 

    const supabase = createClient(supabaseURLResult.value, supabaseKeyResult.value);

    const { data: Project, error: projectError } = await supabase
        .from('Project')
        .select('domain,org_id')
        .eq('id', projectId);

    if (projectError) {
        return err(`Error fetching project: ${projectError.message}`);
    }

    const domain: string = Project && Project.length > 0 ? Project[0].domain : "";
    const orgId: string = Project && Project.length > 0 ? Project[0].org_id : "";

    const internalLinks: string[] = await crawlImportantInternalLinks(domain, 30);

    if(!internalLinks || internalLinks.length==0){
        return err("No internal links found from crawler")
    }

    // const links: string[] = [
    //     'https://www.prestashop.com',
    //     'https://www.prestashop.com/support/',
    //     'https://www.prestashop.com/blog',
    // ];

    // @ts-ignore
    const exa = new Exa(process.env.EXA_API_KEY ?? '');
    const getEnrichedContents: EnrichedURL[] = await exa.getContents(internalLinks, {
        // text: { maxCharacters: 500 },
        summary: { query: "summarise the web page in maximum two sentences" },
        // highlights: { numSentences: 2 }
    }).results;

    if (!getEnrichedContents || !Array.isArray(getEnrichedContents)) {
        return err("Invalid response from Exa API");
    }

    const { data, error: insertError } = await supabase
        .from('InternalLink')
        .insert(getEnrichedContents.map((enrichedURL: EnrichedURL) => ({
            org_id: orgId,
            project_id: projectId,
            url: enrichedURL.id,
            summary: enrichedURL.summary,
        })))
        .select();

    if (insertError) {
        return err(`Error inserting internal links: ${insertError.message}`);
    }

    return ok(getEnrichedContents);
}
