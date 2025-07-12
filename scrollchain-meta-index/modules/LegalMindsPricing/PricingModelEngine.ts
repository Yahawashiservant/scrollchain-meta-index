export class PricingModelEngine {
  static autoContract(rateUSD: number, hours: number): number {
    const fee = rateUSD * hours;
    const serviceTax = fee * 0.07;
    return fee + serviceTax;
  }

  static dynamicRate(entropy: number): number {
    return entropy > 60 ? 420 : 320;
  }
}
