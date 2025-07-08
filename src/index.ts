import { BigNumber } from "@ethersproject/bignumber";

const modules = Array.from({ length: 100 }, (_, i) => i + 1);

async function runAll() {
  console.log("== AfterQuantumCore Modules ==");

  for (const i of modules) {
    const mod = await import(`./AfterQuantumCore_${i}.js`);
    const hashFn   = mod[`generateModule${i}ProphecyEntropy`] as (s: string) => BigNumber;
    const scrollFn = mod[`computeModule${i}ScrollEntropy`]    as (p: number[]) => number;
    const voteFn   = mod[`computeModule${i}VoteWeight`]       as (s: number[]) => number;

    const h = hashFn(`test${i}`);
    const s = scrollFn([0.1, 0.4, 0.5]);
    const w = voteFn([1, -2, 3]);

    console.log(`[Module ${i}] hash=${h.toString()}, scroll=${s}, weight=${w}`);
  }

  console.log("== Supabase Logging ==");
  for (const i of modules) {
    const logMod = await import(`./supabaseLog_${i}.js`);
    const logFn  = logMod[`logModule${i}`] as (a: string, b: string, c: string) => Promise<void>;
    await logFn("0xMe", `hello${i}`, `entropy${i}`);
    console.log("Logged module", i);
  }
}

runAll().catch(console.error);
