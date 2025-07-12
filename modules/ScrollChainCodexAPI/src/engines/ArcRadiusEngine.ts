export class ArcRadiusEngine {
  static phiArcRadius(arcLength: number, angle: number): number {
    return (arcLength / angle) * 1.618033988749;
  }
}
