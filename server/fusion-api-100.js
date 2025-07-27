const express = require('express');
const router = express.Router();

// Fusion API Instance 100
router.get('/api/fusion/instance100/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-100',
    energyOutput: 100 * 10000,
    fusionRate: 100 * 1.5,
    status: 'optimal',
    particles: 100 * 500
  });
});

router.post('/api/fusion/instance100/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-100-' + Date.now(),
    energyBurst: 100 * 50000,
    chainReaction: true,
    newDimensions: 100
  });
});

module.exports = router;
