import { BigNumber } from "@ethersproject/bignumber";

export function generateModule169ProphecyEntropy(msg: string): BigNumber {
  let h = Array.from(msg).reduce((x,y)=>x ^ y.charCodeAt(0), 0);
  return BigNumber.from(h ^ 169 * 0xabcdef);
}

export function computeModule169ScrollEntropy(probs: number[]): number {
  const H = -probs.reduce((s,p)=> s + (p>0? p*Math.log(p):0), 0);
  return H + (probs.length * 0.01 * 169);
}

export function computeModule169VoteWeight(signals: number[]): number {
  return signals.reduce((s,x)=>s + Math.abs(x), 0) * 169;
}

export function generateModule169DimensionalShift(): BigNumber {
  const entropy = 169 * Math.PI * 369;
  return BigNumber.from(Math.floor(entropy * 1000000));
}

export function computeModule169QuantumSignature(data: any[]): string {
  const signature = data.reduce((acc, item) => acc + JSON.stringify(item).length, 0);
  return `QS-169-${signature.toString(16)}`;
}
