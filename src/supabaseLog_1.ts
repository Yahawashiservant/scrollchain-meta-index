import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.SB_URL!, process.env.SB_KEY!);

export async function logModule1(prophet: string, message: string, entropy: string) {
  await sb.from("prophecy_logs").insert({
    module: 1, prophet, message, entropy, ts: new Date()
  });
}
