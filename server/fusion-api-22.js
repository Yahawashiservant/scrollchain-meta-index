const express = require('express');
const router = express.Router();

// Fusion API Instance 22
router.get('/api/fusion/instance22/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-22',
    energyOutput: 22 * 10000,
    fusionRate: 22 * 1.5,
    status: 'optimal',
    particles: 22 * 500
  });
});

router.post('/api/fusion/instance22/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-22-' + Date.now(),
    energyBurst: 22 * 50000,
    chainReaction: true,
    newDimensions: 22
  });
});

module.exports = router;
