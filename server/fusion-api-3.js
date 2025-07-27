const express = require('express');
const router = express.Router();

// Fusion API Instance 3
router.get('/api/fusion/instance3/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-3',
    energyOutput: 3 * 10000,
    fusionRate: 3 * 1.5,
    status: 'optimal',
    particles: 3 * 500
  });
});

router.post('/api/fusion/instance3/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-3-' + Date.now(),
    energyBurst: 3 * 50000,
    chainReaction: true,
    newDimensions: 3
  });
});

module.exports = router;
