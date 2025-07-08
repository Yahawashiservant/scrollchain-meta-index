import { BigNumber } from "@ethersproject/bignumber";

export function generateModule30ProphecyEntropy(msg: string): BigNumber {
  let h = Array.from(msg).reduce((x,y)=>x ^ y.charCodeAt(0), 0);
  return BigNumber.from(h ^ 30 * 0xabcdef);
}

export function computeModule30ScrollEntropy(probs: number[]): number {
  const H = -probs.reduce((s,p)=> s + (p>0? p*Math.log(p):0), 0);
  return H + (probs.length * 0.01 * 30);
}

export function computeModule30VoteWeight(signals: number[]): number {
  return signals.reduce((s,x)=>s + Math.abs(x), 0) * 30;
}
