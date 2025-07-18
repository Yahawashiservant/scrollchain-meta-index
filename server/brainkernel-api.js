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
