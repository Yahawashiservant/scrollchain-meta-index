import { UNIVERSAL_CONSTANTS } from "./QuantumMathLib";

export class AfterQuantumCore {
  static prophecyCycle(seed: number, constant = Math.PI + Math.E, depth = 7): number {
    if (depth <= 0) return seed;
    return this.prophecyCycle((seed * constant) % Math.PI, constant + Math.E, depth - 1);
  }

  static pisanoYield(n: number): number {
    const fib: number[] = [0,1];
    for (let i = 2; i <= n; i++) fib[i] = (fib[i-1] + fib[i-2]) % n;
    return fib[n] * 1000;
  }

  static avogadroField(value: number): number {
    return (value * (UNIVERSAL_CONSTANTS.AVO1000 % UNIVERSAL_CONSTANTS.OMEGA)) / Math.PI;
  }

  static crownEncode(input: string, omega: number, lambda: number): string {
    const enc = input.split("").map((ch,i) =>
      String.fromCharCode(ch.charCodeAt(0) ^ ((omega+lambda+i)%256))
    ).join("");
    return Buffer.from(enc).toString("base64");
  }

  static livingQuantumGrowth(init: number, envFactor=3.1415, iterations=12): number {
    let state = init;
    for (let i=0; i<iterations; i++) {
      const wave = Math.sin(state + envFactor) * Math.log(i+2);
      const noise= (Math.random()-0.5)*0.05*1000;
      state = (state + wave)*(1+noise);
    }
    return state;
  }

  static scrollEntropy(probs: number[], pisanoMod: number, prophecyVal: number): number {
    const shannon = -probs.reduce((s,p)=>s + p*Math.log(p),0);
    return shannon + pisanoMod*0.001 + prophecyVal*0.001;
  }
}
