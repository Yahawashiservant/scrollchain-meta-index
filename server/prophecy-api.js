const express = require('express');
const router = express.Router();

router.get('/prophecy', (req, res) => {
  const entropy = 5.92;
  const threshold = 6.0;
  const prophecy = entropy > threshold
    ? '⚠️ Entropy breach detected. ScrollProtectorBot fleet activated.'
    : '🧘 Entropy stable. No prophecy triggered.';
  res.json({ entropy, threshold, prophecy });
});

module.exports = router;
