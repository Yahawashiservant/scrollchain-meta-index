import { BigNumber } from "@ethersproject/bignumber";

export function generateModule58ProphecyEntropy(msg: string): BigNumber {
  let h = Array.from(msg).reduce((x,y)=>x ^ y.charCodeAt(0), 0);
  return BigNumber.from(h ^ 58 * 0xabcdef);
}

export function computeModule58ScrollEntropy(probs: number[]): number {
  const H = -probs.reduce((s,p)=> s + (p>0? p*Math.log(p):0), 0);
  return H + (probs.length * 0.01 * 58);
}

export function computeModule58VoteWeight(signals: number[]): number {
  return signals.reduce((s,x)=>s + Math.abs(x), 0) * 58;
}
