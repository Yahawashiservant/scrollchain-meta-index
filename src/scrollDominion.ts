import { UNIVERSAL_CONSTANTS } from "./QuantumMathLib";

export type Variant = "Ω"|"ΩInv"|"All369"|"All30"|"All6"|"369Gate";
export interface Sigil { id:string; set:[number,number,number]; rank:string }

export function createScrollSigil(v:Variant, useAvogadro=false): Sigil {
  const sets:{[k:string]:[number,number,number]} = {
    Ω:[3,6,9], ΩInv:[9,6,3], All369:[369,369,369],
    All30:[30,30,30], All6:[6,6,6], 369Gate:[3,6,9]
  };
  const s = sets[v], A = useAvogadro ? UNIVERSAL_CONSTANTS.AVO1000 : 1;
  const omega = 360 * s[0] * s[1] * s[2] * A;
  return { id:`\${v}-\${s.join("-")}-\${omega}`, set:s, rank:v+"Rank" };
}
