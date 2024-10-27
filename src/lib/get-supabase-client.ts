import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { err, ok, Result } from 'true-myth/result';

export function getSupabaseClient(): Result<SupabaseClient,string>{
    const supabaseURL: string | null = process.env.SUPABASE_URL ?? null
    const supabaseKey: string | null = process.env.SUPABASE_KEY ?? null;

    if (supabaseURL==null){
        return err("Supabase URL is not defined");
    }
    if (supabaseKey==null){
        return err("Supabase Key is not defined");
    }

    const supabaseClient: SupabaseClient = createClient(supabaseURL, supabaseKey);

    return ok(supabaseClient);
}