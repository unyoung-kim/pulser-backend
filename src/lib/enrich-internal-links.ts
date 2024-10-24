import { createClient } from '@supabase/supabase-js'
import { crawlImportantInternalLinks } from './internal-link/scrape.js'
import Exa from "exa-js";

// Define the interface for enriched URL
interface EnrichedURL {
    id: string;
    highlights: string[];
    text: string;
    summary: string
}

export async function enrichInternalLinks(projectId: string) {

    const supabaseURL = process.env.SUPABASE_URL ?? '';
    const supabaseKey = process.env.SUPABASE_KEY ?? '';
    const supabase = createClient(supabaseURL, supabaseKey);

    const { data: Project, error: projectError } = await supabase
        .from('Project')
        .select('domain,org_id')
        .eq('id', projectId);

    if (projectError) {
        throw new Error(`Error fetching project: ${projectError.message}`);
    }

    const domain: string = Project && Project.length > 0 ? Project[0].domain : "";
    const orgId: string = Project && Project.length > 0 ? Project[0].org_id : "";

    const internalLinks: string[] = await crawlImportantInternalLinks(domain, 5);

    // const links: string[] = [
    //     'https://www.prestashop.com',
    //     'https://www.prestashop.com/support/',
    //     'https://www.prestashop.com/blog',
    // ];

    // @ts-ignore
    const exa = new Exa(process.env.EXA_API_KEY ?? '');
    const getEnrichedContents = await exa.getContents(internalLinks, {
        // text: { maxCharacters: 500 },
        summary: { query: "summarise the web page in maximum two sentences" },
        // highlights: { numSentences: 2 }
    });

    if (!getEnrichedContents || !Array.isArray(getEnrichedContents.results)) {
        throw new Error("Invalid response from Exa API");
    }

    const { data, error: insertError } = await supabase
        .from('InternalLink')
        .insert(getEnrichedContents.results.map((enrichedURL: EnrichedURL) => ({
            org_id: orgId,
            project_id: projectId,
            url: enrichedURL.id,
            summary: enrichedURL.summary,
        })))
        .select();

    if (insertError) {
        throw new Error(`Error inserting internal links: ${insertError.message}`);
    }

    return data;
}
