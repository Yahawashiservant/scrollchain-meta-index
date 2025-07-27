const express = require('express');
const router = express.Router();

// Fusion API Instance 2
router.get('/api/fusion/instance2/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-2',
    energyOutput: 2 * 10000,
    fusionRate: 2 * 1.5,
    status: 'optimal',
    particles: 2 * 500
  });
});

router.post('/api/fusion/instance2/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-2-' + Date.now(),
    energyBurst: 2 * 50000,
    chainReaction: true,
    newDimensions: 2
  });
});

module.exports = router;
