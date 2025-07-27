const express = require('express');
const router = express.Router();

// Fusion API Instance 6
router.get('/api/fusion/instance6/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-6',
    energyOutput: 6 * 10000,
    fusionRate: 6 * 1.5,
    status: 'optimal',
    particles: 6 * 500
  });
});

router.post('/api/fusion/instance6/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-6-' + Date.now(),
    energyBurst: 6 * 50000,
    chainReaction: true,
    newDimensions: 6
  });
});

module.exports = router;
