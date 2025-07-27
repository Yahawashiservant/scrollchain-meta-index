const express = require('express');
const router = express.Router();

// Fusion API Instance 15
router.get('/api/fusion/instance15/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-15',
    energyOutput: 15 * 10000,
    fusionRate: 15 * 1.5,
    status: 'optimal',
    particles: 15 * 500
  });
});

router.post('/api/fusion/instance15/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-15-' + Date.now(),
    energyBurst: 15 * 50000,
    chainReaction: true,
    newDimensions: 15
  });
});

module.exports = router;
