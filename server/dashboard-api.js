const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 🧠 Kernel Scrolls
router.get('/scrolls', (req, res) => {
  const file = path.join(__dirname, '../minted_kernels/kernel_registry.csv');
  res.sendFile(file);
});

// 🎴 Agents
router.get('/agents', (req, res) => {
  const agents = [
    { name: 'WealthAgent', id: 'WA-001' },
    { name: 'QuantumTrader', id: 'QT-002' },
    { name: 'ComplianceBot', id: 'CB-003' },
    { name: 'GovernanceOracle', id: 'GO-004' }
  ];
  res.json(agents);
});

// 📜 Registry
router.get('/registry', (req, res) => {
  const file = path.join(__dirname, '../ScrollChain-MintLog.md');
  res.sendFile(file);
});

module.exports = router;
