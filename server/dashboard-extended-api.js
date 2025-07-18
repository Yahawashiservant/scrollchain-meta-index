const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 🧠 Entropy Patterns
router.get('/entropy', (req, res) => {
  const entropy = {
    average: 4.74,
    modules: [
      { id: 'AfterQuantumCore_1', entropy: 7.31 },
      { id: 'AfterQuantumCore_2', entropy: 6.15 },
      { id: 'AfterQuantumCore_3', entropy: 4.92 },
      { id: 'AfterQuantumCore_4', entropy: 5.94 }
    ]
  };
  res.json(entropy);
});

// 🆔 DID Resolver
router.get('/did', (req, res) => {
  const did = "did:key:z6Mknydk7WHdqY95veyeCB3J6VaMQuxh3Vmjq2YAWTZVjyUw";
  res.json({ did, status: "✅ Valid", linkedScroll: "ScrollChain-Kernel.js" });
});

// 📤 Export Data
router.get('/export', (req, res) => {
  const file = path.join(__dirname, '../ScrollChain-MintLog.md');
  res.download(file, 'ScrollChain-MintLog.md');
});

module.exports = router;
