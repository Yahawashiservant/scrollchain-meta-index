const express = require('express');
const router = express.Router();

// Fusion API Instance 13
router.get('/api/fusion/instance13/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-13',
    energyOutput: 13 * 10000,
    fusionRate: 13 * 1.5,
    status: 'optimal',
    particles: 13 * 500
  });
});

router.post('/api/fusion/instance13/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-13-' + Date.now(),
    energyBurst: 13 * 50000,
    chainReaction: true,
    newDimensions: 13
  });
});

module.exports = router;
