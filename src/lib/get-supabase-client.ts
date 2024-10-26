import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { err, ok, Result } from 'true-myth/result';

export function getSupabaseClient(): Result<SupabaseClient,string>{
    const supabaseURLResult: Result<string,string> = process.env.SUPABASE_URL ? ok(process.env.SUPABASE_URL) : err("Supabase URL is not defined");
    const supabaseKeyResult: Result<string,string> = process.env.SUPABASE_KEY ? ok(process.env.SUPABASE_KEY) : err("Supabase Key is not defined");

    if (supabaseURLResult.isErr) return err(supabaseURLResult.error);
    if (supabaseKeyResult.isErr) return err(supabaseKeyResult.error); 

    const supabaseClient: SupabaseClient = createClient(supabaseURLResult.value, supabaseKeyResult.value);

    return ok(supabaseClient);
}