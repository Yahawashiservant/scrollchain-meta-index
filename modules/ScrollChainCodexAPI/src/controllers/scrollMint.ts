export async function mintScrollNFT(req, res) {
  const payload = req.body;
  const tokenId = `SCROLL-${Date.now()}`;
  res.json({ tokenId, payload });
}
