import { ArcRadiusEngine } from '../engines/ArcRadiusEngine';

export async function getArcRadius(req, res) {
  const { arcLength, angle } = req.query;
  const radius = ArcRadiusEngine.phiArcRadius(Number(arcLength), Number(angle));
  res.json({ radius });
}
