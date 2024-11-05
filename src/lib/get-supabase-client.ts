import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { err, ok, Result } from 'true-myth/result';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): Result<SupabaseClient, string> {
    if (supabaseClient) return ok(supabaseClient);

    const supabaseURL: string | null = process.env.SUPABASE_URL ?? null;
    const supabaseKey: string | null = process.env.SUPABASE_KEY ?? null;

    if (supabaseURL == null) {
        return err("Supabase URL is not defined");
    }
    if (supabaseKey == null) {
        return err("Supabase Key is not defined");
    }

    supabaseClient = createClient(supabaseURL, supabaseKey);
    return ok(supabaseClient);
}
