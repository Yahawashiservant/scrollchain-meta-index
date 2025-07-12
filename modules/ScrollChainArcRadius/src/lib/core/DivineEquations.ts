import { ArcRadiusEngine } from '../geometry/ArcRadius';

export class DivineEquations {
  static spiralRadius(theta: number): number {
    return ArcRadiusEngine.toroidalArcRadius(10, theta);
  }
}
