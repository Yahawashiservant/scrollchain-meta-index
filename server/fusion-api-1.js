const express = require('express');
const router = express.Router();

// Fusion API Instance 1
router.get('/api/fusion/instance1/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-1',
    energyOutput: 1 * 10000,
    fusionRate: 1 * 1.5,
    status: 'optimal',
    particles: 1 * 500
  });
});

router.post('/api/fusion/instance1/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-1-' + Date.now(),
    energyBurst: 1 * 50000,
    chainReaction: true,
    newDimensions: 1
  });
});

module.exports = router;
