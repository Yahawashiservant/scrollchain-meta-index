import { C } from "./QuantumMathLib";

export function createSigil(v: string, useAvogadro = false) {
  const sets: any = { Ω: [3,6,9], ΩI: [9,6,3], A: [369,369,369], '30': [30,30,30], '6': [6,6,6] };
  const s = sets[v] || [3,6,9];
  const A = useAvogadro ? C.A1k : 1;
  const value = 360 * s[0] * s[1] * s[2] * A;
  return { id: `${v}-${s.join("-")}-${value}`, set: s, rank: v + "R" };
}
