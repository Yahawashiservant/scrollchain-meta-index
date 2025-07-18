const express = require('express');
const router = express.Router();

router.get('/extended', (req, res) => {
  res.json({ status: 'Extended API placeholder active.' });
});

module.exports = router;
