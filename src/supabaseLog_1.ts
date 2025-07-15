import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required Supabase environment variables. Please check SUPABASE_URL and SUPABASE_KEY are set.');
}

const sb = createClient(supabaseUrl, supabaseKey);

export async function logModule1(prophet: string, message: string, entropy: string) {
  await sb.from("prophecy_logs").insert({
    module: 1, prophet, message, entropy, ts: new Date()
  });
}