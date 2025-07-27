const express = require('express');
const router = express.Router();

// Fusion API Instance 25
router.get('/api/fusion/instance25/reactor', (req, res) => {
  res.json({
    reactorId: 'FUSION-25',
    energyOutput: 25 * 10000,
    fusionRate: 25 * 1.5,
    status: 'optimal',
    particles: 25 * 500
  });
});

router.post('/api/fusion/instance25/ignite', (req, res) => {
  res.json({
    ignitionId: 'IGN-25-' + Date.now(),
    energyBurst: 25 * 50000,
    chainReaction: true,
    newDimensions: 25
  });
});

module.exports = router;
