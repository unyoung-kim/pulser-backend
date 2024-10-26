import { SupabaseClient } from '@supabase/supabase-js'
import { crawlImportantInternalLinks } from './internal-link/scrape.js'
import Exa from "exa-js";
import { err, ok, Result } from 'true-myth/result';
import { getSupabaseClient } from './get-supabase-client.js';

// Define the interface for enriched URL
export interface EnrichedURL {
    id: string;
    // highlights: string[];
    // text: string;
    summary: string
}

// Define the interface for the response item
interface ExaResponseItem {
    id: string; // Adjust the type as necessary
    summary: string; // Adjust the type as necessary
}

export async function enrichInternalLinks(projectId: string): Promise<Result<EnrichedURL[],string>> { 

    const supabaseClient: Result<SupabaseClient,string> = getSupabaseClient();

    if(supabaseClient.isErr) return err(supabaseClient.error);

    const supabase= supabaseClient.value;

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
    //     'https://www.prestashop.com/support',
    //     'https://www.prestashop.com/about-us/',
    //     'https://www.prestashop.com/contact/',
    //     'https://www.prestashop.com/careers/',
    //     'https://www.prestashop.com/contact',
    //     'https://www.prestashop.com/blog/improve-customer-experience-retain-customers',
    //     'https://www.prestashop.com/blog/ultimate-seo-checklist-for-prestashop',
    //     'https://www.prestashop.com/blog/ecommerce-foresight-2022',
    //     'https://www.prestashop.com/blog/marketing-actions-boost',
    //     'https://www.prestashop.com/blog/customer-reviews-module',
    //     'https://www.prestashop.com/blog/create-welcome-email-series-contacts',
    //     'https://www.prestashop.com/blog/using-conversion-rate-optimization-to-boost-sales',
    //     'https://www.prestashop.com/blog/reduce-size-weight-photos',
    //     'https://www.prestashop.com/blog/best-practices-after-sales',
    //     'https://www.prestashop.com/blog/importance-product-titles',
    //     'https://www.prestashop.com/blog/bnpl-clearpay-ecommerce',
    //     'https://www.prestashop.com/blog/boost-ecommerce-search',
    //     'https://www.prestashop.com/blog/logistics',
    //     'https://www.prestashop.com/blog/ecommerce-performance-potential',
    //     'https://www.prestashop.com/blog/conversion-marketing-automation',
    //     'https://www.prestashop.com/blog/local-seo-best-practices',
    //     'https://www.prestashop.com/blog/amazon-ebay-prestashop',
    //     'https://www.prestashop.com/blog/brand-story-through-storytelling',
    //     'https://www.prestashop.com/blog/ecommerce-environmental-sustainability',
    //     'https://www.prestashop.com/blog/ecommerce-kpi',
    //     'https://www.prestashop.com/blog/search-engine-e-shop',
    //     'https://www.prestashop.com/blog/404-not-found-error-how-to-fix-it'
    // ];

    // @ts-ignore
    const exa = new Exa(process.env.EXA_API_KEY ?? '');
    const response = await exa.getContents(internalLinks, {
        // text: { maxCharacters: 500 },
        summary: { query: "summarise the web page in maximum two sentences" },
        // highlights: { numSentences: 2 }
    });

    // Check if the response has results
    if (!response || !response.results || !Array.isArray(response.results)) {
        console.error("Invalid response from Exa API:", response);
        return err("Invalid response from Exa API");
    }

    const getEnrichedContents: EnrichedURL[] = response.results.map((item: ExaResponseItem) => ({
        id: item.id, // Assuming 'id' corresponds to 'id' in EnrichedURL
        summary: item.summary,
    }));

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
