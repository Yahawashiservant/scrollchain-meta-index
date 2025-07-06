import { createClient } from "@supabase/supabase-js";
import { ForgeEngine }   from "../src/engine/ForgeEngine";

const db = createClient(process.env.S_URL, process.env.S_KEY);
export async function inject(seed){
  const t = ForgeEngine.generateEntropyTrail(seed);
  await db.from("entropy_trails").insert([{
    ts:new Date(t.ts).toISOString(),
    qhash:t.qhash,
    sample:t.sample,
    note:t.prophecy
  }]);
  visualizeTorus(t.sample);
}
function visualizeTorus(vals){ /* map vals→369°×360° torus */ }
