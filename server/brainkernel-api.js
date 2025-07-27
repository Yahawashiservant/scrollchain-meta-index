const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const brainkernelDir = path.join(__dirname, '../brainkernels');

router.get('/brainkernels', (req, res) => {
  fs.readdir(brainkernelDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read brainkernels' });
    const scrolls = files.filter(f => f.endsWith('.scroll'));
    res.json({ scrolls });
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Brain kernel endpoints
router.get('/kernel/neural', (req, res) => {
  res.json({
    neural_networks: 1000000,
    active_neurons: 999999999,
    quantum_state: 'entangled'
  });
});

router.get('/kernel/forge', (req, res) => {
  res.json({
    forge_status: 'operational',
    scrolls_forged: 1000000,
    entropy_consumed: '999TB'
  });
});

module.exports = router;
