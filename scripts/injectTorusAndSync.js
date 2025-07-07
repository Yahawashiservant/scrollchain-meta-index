import { createClient } from "@supabase/supabase-js";
import { FE } from "../src/engine/ForgeEngine";

const db = createClient(process.env.S_URL, process.env.S_KEY);

export async function inject(seed) {
  const trails = FE.gen(seed);
  for (const t of trails) {
    await db.from("entropy_trails").insert({
      ts: new Date(t.ts).toISOString(),
      qhash: t.qhash,
      sample: t.sample,
      note: t.prophecy
    });
  }
}
