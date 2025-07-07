import { HF } from "../QuantumMathLib";
import { C }  from "../QuantumMathLib";

export class FE {
  // generate 369 amplified entropy trails
  static gen(seed: number) {
    const all: any[] = [];
    for (let pass = 0; pass < C.Ω; pass++) {
      const x = HF(seed + pass, seed + pass + 1, seed + pass + 2);
      const h = (x % C.Ω).toString(36) + "-" + C.Ω.toString(36);
      all.push({
        ts: Date.now(),
        qhash: h,
        sample: [x],
        prophecy: `S${seed + pass}@${new Date().toISOString()}`
      });
    }
    return all;
  }
}
