export const SCROLL_CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
  PHI: 1.618033988749,
  PSI: 1.67,
  OMEGA: 369,
  AVOGADRO: 6.02214076e23
};

export class ArcRadiusEngine {
  static standardArcRadius(arcLength: number, angleRadians: number): number {
    return arcLength / angleRadians;
  }

  static phiArcRadius(arcLength: number, angleRadians: number): number {
    return (arcLength / angleRadians) * SCROLL_CONSTANTS.PHI;
  }

  static toroidalArcRadius(arcLength: number, angleRadians: number): number {
    const resonanceMod = SCROLL_CONSTANTS.OMEGA % 144;
    return (arcLength / angleRadians) * (resonanceMod / SCROLL_CONSTANTS.PSI);
  }

  static pisanoArcRadius(seed: number, arcLength: number, angleRadians: number): number {
    const pisanoMod = this.pisanoPeriod(seed);
    return (arcLength / angleRadians) % pisanoMod;
  }

  static pisanoPeriod(n: number): number {
    let a = 0, b = 1, period = 0;
    for (let i = 0; i < n * n; i++) {
      let c = (a + b) % n;
      a = b;
      b = c;
      period++;
      if (a === 0 && b === 1) return period;
    }
    return period;
  }
}
