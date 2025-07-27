const express = require('express');
const router = express.Router();

// Fusion API Instance 24
router.get('/api/fusion/instance24/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-24',
    energyOutput: 24 * 10000,
    fusionRate: 24 * 1.5,
    status: 'optimal',
    particles: 24 * 500
  });
});

router.post('/api/fusion/instance24/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-24-' + Date.now(),
    energyBurst: 24 * 50000,
    chainReaction: true,
    newDimensions: 24
  });
});

module.exports = router;
