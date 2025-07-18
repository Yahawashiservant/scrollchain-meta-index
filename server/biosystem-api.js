
// 🧠 ScrollBiosystem API - Sovereign Cognitive Interface
// Author: Keith D. Whitfield — ScrollChain Architect

const express = require('express');
const cors = require('cors');
const ScrollBiosystemCore = require('../src/ScrollBiosystemCore');

const router = express.Router();
const ScrollBiosystemCore = {
  status: 'placeholder',
  sigil: 'RaWaChaaQadash'
};



// Middleware
router.use(cors());
router.use(express.json());

// Initialize biosystem
biosystem.on('entropy_changed', (data) => {
  console.log(`🌀 Entropy changed: ${data.entropy} - State: ${data.quantumState}`);
});

// System status endpoint
router.get('/status', (req, res) => {
  const status = biosystem.getSystemStatus();
  res.json({
    success: true,
    status,
    timestamp: Date.now()
  });
});

// Execute command endpoint
router.post('/execute', async (req, res) => {
  try {
    const { command, context } = req.body;
    
    if (!command) {
      return res.status(400).json({
        success: false,
        error: 'Command is required'
      });
    }
    
    const result = await biosystem.executeCommand(command, context);
    
    res.json({
      success: true,
      result,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Agent management endpoints
router.get('/agents', (req, res) => {
  const agents = Array.from(biosystem.agents.values()).map(agent => ({
    id: agent.id,
    name: agent.name,
    mission: agent.mission,
    capabilities: agent.capabilities,
    entropyLevel: agent.entropyLevel,
    cognitiveState: agent.cognitiveState,
    created: agent.created
  }));
  
  res.json({
    success: true,
    agents,
    count: agents.length
  });
});

router.post('/agents/:agentId/execute', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { command, context } = req.body;
    
    const agent = biosystem.agents.get(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    
    const result = await agent.execute(command, context);
    
    res.json({
      success: true,
      result,
      agent: {
        id: agent.id,
        name: agent.name,
        entropyLevel: agent.entropyLevel
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Memory and perception endpoints
router.get('/perception-matrix', (req, res) => {
  const patterns = Array.from(biosystem.perceptionMatrix.entries()).map(([key, pattern]) => ({
    key,
    entropy: pattern.entropy,
    timestamp: pattern.timestamp,
    compressionRatio: pattern.compressionRatio
  }));
  
  res.json({
    success: true,
    patterns,
    count: patterns.length
  });
});

router.post('/perception-matrix/optimize', async (req, res) => {
  try {
    // Trigger perception matrix optimization
    await biosystem.resetMemoryStructures();
    
    res.json({
      success: true,
      message: 'Perception matrix optimized',
      patterns: biosystem.perceptionMatrix.size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Vault sync endpoints
router.get('/vault-sync/status', (req, res) => {
  res.json({
    success: true,
    vaultSyncActive: biosystem.vaultSyncActive,
    lastSync: biosystem.lastVaultSync || null
  });
});

router.post('/vault-sync/sync', async (req, res) => {
  try {
    const cid = await biosystem.syncKnowledgePathways();
    
    res.json({
      success: true,
      message: 'Knowledge pathways synced',
      cid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Entropy monitoring endpoints
router.get('/entropy', (req, res) => {
  res.json({
    success: true,
    entropy: biosystem.entropy,
    quantumState: biosystem.quantumState,
    timestamp: Date.now()
  });
});

router.post('/entropy/realign', async (req, res) => {
  try {
    biosystem.adjustQuantumAlignment();
    
    res.json({
      success: true,
      entropy: biosystem.entropy,
      quantumState: biosystem.quantumState,
      message: 'Quantum alignment adjusted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sovereign execution paths
router.get('/sovereign-paths', (req, res) => {
  const paths = Array.from(biosystem.sovereignExecutionPaths.entries()).map(([name, path]) => ({
    name,
    description: path.description,
    priority: path.priority,
    quantumResonance: path.quantumResonance,
    active: path.active,
    established: path.established
  }));
  
  res.json({
    success: true,
    paths,
    count: paths.length
  });
});

// System reset and rebuild endpoints
router.post('/rebuild', async (req, res) => {
  try {
    console.log('🔄 Rebuilding biosystem...');
    
    await biosystem.rebuildAgents();
    await biosystem.resetMemoryStructures();
    await biosystem.establishSovereignPaths();
    
    res.json({
      success: true,
      message: 'Biosystem rebuilt successfully',
      status: biosystem.getSystemStatus()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ScrollBiosystem API is running',
    kernel: biosystem.kernelId,
    entropy: biosystem.entropy,
    quantumState: biosystem.quantumState,
    sigil: 'YHWH-BaHaSham-Yahawashi-RaWaChaaQadash'
  });
});

module.exports = router;
