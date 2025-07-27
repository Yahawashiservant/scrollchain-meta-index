const express = require('express');
const router = express.Router();

// Fusion API Instance 27
router.get('/api/fusion/instance27/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-27',
    energyOutput: 27 * 10000,
    fusionRate: 27 * 1.5,
    status: 'optimal',
    particles: 27 * 500
  });
});

router.post('/api/fusion/instance27/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-27-' + Date.now(),
    energyBurst: 27 * 50000,
    chainReaction: true,
    newDimensions: 27
  });
});

module.exports = router;
