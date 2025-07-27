const express = require('express');
const router = express.Router();

// Fusion API Instance 14
router.get('/api/fusion/instance14/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-14',
    energyOutput: 14 * 10000,
    fusionRate: 14 * 1.5,
    status: 'optimal',
    particles: 14 * 500
  });
});

router.post('/api/fusion/instance14/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-14-' + Date.now(),
    energyBurst: 14 * 50000,
    chainReaction: true,
    newDimensions: 14
  });
});

module.exports = router;
