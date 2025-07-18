const express = require('express');
const router = express.Router();

router.get('/bigquery', (req, res) => {
  const entropyAnalytics = {
    timestamp: Date.now(),
    entropy: 5.92,
    signal: 'Stable',
    targeting: ['DAO', 'Biotech', 'Civic'],
    source: 'Google Cloud BigQuery'
  };
  res.json(entropyAnalytics);
});

module.exports = router;
