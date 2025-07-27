import { BigNumber } from "@ethersproject/bignumber";

export function generateModule126ProphecyEntropy(msg: string): BigNumber {
  let h = Array.from(msg).reduce((x,y)=>x ^ y.charCodeAt(0), 0);
  return BigNumber.from(h ^ 126 * 0xabcdef);
}

export function computeModule126ScrollEntropy(probs: number[]): number {
  const H = -probs.reduce((s,p)=> s + (p>0? p*Math.log(p):0), 0);
  return H + (probs.length * 0.01 * 126);
}

export function computeModule126VoteWeight(signals: number[]): number {
  return signals.reduce((s,x)=>s + Math.abs(x), 0) * 126;
}

export function generateModule126DimensionalShift(): BigNumber {
  const entropy = 126 * Math.PI * 369;
  return BigNumber.from(Math.floor(entropy * 1000000));
}

export function computeModule126QuantumSignature(data: any[]): string {
  const signature = data.reduce((acc, item) => acc + JSON.stringify(item).length, 0);
  return `QS-126-${signature.toString(16)}`;
}
