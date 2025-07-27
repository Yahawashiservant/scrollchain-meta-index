import { BigNumber } from "@ethersproject/bignumber";

export function generateModule171ProphecyEntropy(msg: string): BigNumber {
  let h = Array.from(msg).reduce((x,y)=>x ^ y.charCodeAt(0), 0);
  return BigNumber.from(h ^ 171 * 0xabcdef);
}

export function computeModule171ScrollEntropy(probs: number[]): number {
  const H = -probs.reduce((s,p)=> s + (p>0? p*Math.log(p):0), 0);
  return H + (probs.length * 0.01 * 171);
}

export function computeModule171VoteWeight(signals: number[]): number {
  return signals.reduce((s,x)=>s + Math.abs(x), 0) * 171;
}

export function generateModule171DimensionalShift(): BigNumber {
  const entropy = 171 * Math.PI * 369;
  return BigNumber.from(Math.floor(entropy * 1000000));
}

export function computeModule171QuantumSignature(data: any[]): string {
  const signature = data.reduce((acc, item) => acc + JSON.stringify(item).length, 0);
  return `QS-171-${signature.toString(16)}`;
}
