const express = require('express');
const router = express.Router();

// Fusion API Instance 5
router.get('/api/fusion/instance5/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-5',
    energyOutput: 5 * 10000,
    fusionRate: 5 * 1.5,
    status: 'optimal',
    particles: 5 * 500
  });
});

router.post('/api/fusion/instance5/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-5-' + Date.now(),
    energyBurst: 5 * 50000,
    chainReaction: true,
    newDimensions: 5
  });
});

module.exports = router;
