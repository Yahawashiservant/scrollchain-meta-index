import { BigNumber } from "@ethersproject/bignumber";

export function generateModule122ProphecyEntropy(msg: string): BigNumber {
  let h = Array.from(msg).reduce((x,y)=>x ^ y.charCodeAt(0), 0);
  return BigNumber.from(h ^ 122 * 0xabcdef);
}

export function computeModule122ScrollEntropy(probs: number[]): number {
  const H = -probs.reduce((s,p)=> s + (p>0? p*Math.log(p):0), 0);
  return H + (probs.length * 0.01 * 122);
}

export function computeModule122VoteWeight(signals: number[]): number {
  return signals.reduce((s,x)=>s + Math.abs(x), 0) * 122;
}

export function generateModule122DimensionalShift(): BigNumber {
  const entropy = 122 * Math.PI * 369;
  return BigNumber.from(Math.floor(entropy * 1000000));
}

export function computeModule122QuantumSignature(data: any[]): string {
  const signature = data.reduce((acc, item) => acc + JSON.stringify(item).length, 0);
  return `QS-122-${signature.toString(16)}`;
}
