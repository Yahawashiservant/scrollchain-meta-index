export async function fetchScrollEntropy(req, res) {
  const entropy = 42.7;
  const timestamp = new Date().toISOString();
  res.json({ entropy, timestamp });
}
