const express = require('express');
const router = express.Router();

// Fusion API Instance 8
router.get('/api/fusion/instance8/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-8',
    energyOutput: 8 * 10000,
    fusionRate: 8 * 1.5,
    status: 'optimal',
    particles: 8 * 500
  });
});

router.post('/api/fusion/instance8/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-8-' + Date.now(),
    energyBurst: 8 * 50000,
    chainReaction: true,
    newDimensions: 8
  });
});

module.exports = router;
