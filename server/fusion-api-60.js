const express = require('express');
const router = express.Router();

// Fusion API Instance 60
router.get('/api/fusion/instance60/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-60',
    energyOutput: 60 * 10000,
    fusionRate: 60 * 1.5,
    status: 'optimal',
    particles: 60 * 500
  });
});

router.post('/api/fusion/instance60/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-60-' + Date.now(),
    energyBurst: 60 * 50000,
    chainReaction: true,
    newDimensions: 60
  });
});

module.exports = router;
