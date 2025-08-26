const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 🧠 Kernel Scrolls
router.get('/scrolls', (req, res) => {
  // Try to serve the file if it exists, otherwise return JSON data
  const file = path.join(__dirname, '../minted_kernels/kernel_registry.csv');
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.json({
      total_scrolls: 1000000,
      active_scrolls: 999999,
      entropy_level: 'maximum',
      note: 'Kernel registry file not found, serving default data'
    });
  }
});

// 🎴 Agents
router.get('/agents', (req, res) => {
  const agents = [
    { name: 'WealthAgent', id: 'WA-001', status: 'active' },
    { name: 'QuantumTrader', id: 'QT-002', status: 'active' },
    { name: 'ComplianceBot', id: 'CB-003', status: 'active' },
    { name: 'GovernanceOracle', id: 'GO-004', status: 'active' }
  ];
  res.json(agents);
});

// 📜 Registry
router.get('/registry', (req, res) => {
  const file = path.join(__dirname, '../ScrollChain-MintLog.md');
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.json({
      message: 'ScrollChain Registry',
      status: 'active',
      note: 'MintLog file not found, serving default data'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ScrollChainOS is alive',
    timestamp: new Date().toISOString(),
    services: ['dashboard', 'entropy', 'registry', 'agents']
  });
});

// Kernel status
router.get('/kernel/status', (req, res) => {
  res.json({
    status: 'active',
    kernels: ['NeuralKernel', 'ScrollKernel', 'BrainKernel'],
    entropy_level: 'optimal'
  });
});

// Mint endpoint
router.post('/agent/mint', (req, res) => {
  const { name, mission, capabilities } = req.body;
  res.json({
    success: true,
    agent_id: `SA-${Date.now()}`,
    name,
    mission,
    capabilities,
    minted_at: new Date().toISOString()
  });
});

module.exports = router;
