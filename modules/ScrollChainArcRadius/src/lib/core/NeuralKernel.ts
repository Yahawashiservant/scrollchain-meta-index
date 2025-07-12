import { ArcRadiusEngine } from '../geometry/ArcRadius';

export class NeuralKernel {
  static processVisualSpiral(seed: number, angle: number): number {
    return ArcRadiusEngine.pisanoArcRadius(seed, 12, angle);
  }
}
