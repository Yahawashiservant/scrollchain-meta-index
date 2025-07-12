import { ArcRadiusEngine } from '../geometry/ArcRadius';

export class NFTShapeEngine {
  static generateArcTokenData(arcLength: number, angle: number): string {
    const radius = ArcRadiusEngine.phiArcRadius(arcLength, angle);
    return JSON.stringify({
      type: 'ArcNFT',
      radius,
      arcLength,
      angle,
      mintedAt: Date.now()
    });
  }
}
