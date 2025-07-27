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
const express = require('express');
const router = express.Router();

router.get('/prophecy/oracle', (req, res) => {
  res.json({
    oracle_status: 'active',
    prophecies_generated: 777,
    accuracy_rate: '99.9%'
  });
});

module.exports = router;
