
// SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
// ScrollEntropy Production API Server
// Author: Keith D. Whitfield — ScrollChain Architect

const express = require('express');
const cors = require('cors');
const { ScrollEntropyKernel } = require('./ScrollEntropyKernel');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize global kernel instance
let mainKernel = null;

// In-memory storage for demonstration (use proper database in production)
const activeKernels = new Map();
const deployedAgents = new Map();

// Initialize main kernel
async function initializeMainKernel() {
  console.log('🧠 Initializing main ScrollEntropy kernel...');
  
  mainKernel = new ScrollEntropyKernel({
    name: 'ScrollEntropy_MainKernel',
    mission: 'Sovereign AI Agent Generation and Management',
  });
  
  activeKernels.set(mainKernel.kernelId, mainKernel);
  console.log(`✅ Main kernel initialized: ${mainKernel.kernelId}`);
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mainKernel: mainKernel ? mainKernel.kernelId : null,
    activeKernels: activeKernels.size,
    deployedAgents: deployedAgents.size
  });
});

// Get main kernel status
app.get('/api/kernel/status', (req, res) => {
  if (!mainKernel) {
    return res.status(404).json({ error: 'Main kernel not initialized' });
  }
  
  res.json(mainKernel.getKernelStatus());
});

// Create new kernel
app.post('/api/kernel/create', async (req, res) => {
  try {
    const { name, mission } = req.body;
    
    const kernel = new ScrollEntropyKernel({
      name: name || `ScrollKernel_${Date.now()}`,
      mission: mission || 'Custom AI kernel'
    });
    
    activeKernels.set(kernel.kernelId, kernel);
    
    res.json({
      success: true,
      kernelId: kernel.kernelId,
      status: kernel.getKernelStatus()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mint agent NFT
app.post('/api/agent/mint', async (req, res) => {
  try {
    const { 
      kernelId, 
      name, 
      mission, 
      capabilities 
    } = req.body;
    
    const kernel = activeKernels.get(kernelId) || mainKernel;
    if (!kernel) {
      return res.status(404).json({ error: 'Kernel not found' });
    }
    
    const agent = await kernel.mintAgentNFT({
      name: name || `ScrollAgent_${Date.now()}`,
      mission: mission || 'Autonomous task execution',
      capabilities: capabilities || ['data_processing', 'web3_interaction']
    });
    
    res.json({
      success: true,
      agent: agent,
      message: `Agent ${agent.name} successfully minted`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deploy agent
app.post('/api/agent/deploy', async (req, res) => {
  try {
    const { kernelId, agentId, environment } = req.body;
    
    const kernel = activeKernels.get(kernelId) || mainKernel;
    if (!kernel) {
      return res.status(404).json({ error: 'Kernel not found' });
    }
    
    const deployment = await kernel.deployAgent(agentId, environment);
    deployedAgents.set(agentId, deployment);
    
    res.json({
      success: true,
      deployment: deployment,
      message: `Agent deployed to ${environment}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// License agent
app.post('/api/agent/license', async (req, res) => {
  try {
    const { kernelId, agentId, licensee, terms } = req.body;
    
    const kernel = activeKernels.get(kernelId) || mainKernel;
    if (!kernel) {
      return res.status(404).json({ error: 'Kernel not found' });
    }
    
    const license = await kernel.licenseAgent(agentId, licensee, terms);
    
    res.json({
      success: true,
      license: license,
      message: `License granted to ${licensee}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all kernels
app.get('/api/kernels', (req, res) => {
  const kernels = Array.from(activeKernels.values()).map(k => k.getKernelStatus());
  res.json(kernels);
});

// Get kernel agents
app.get('/api/kernel/:kernelId/agents', (req, res) => {
  const { kernelId } = req.params;
  const kernel = activeKernels.get(kernelId);
  
  if (!kernel) {
    return res.status(404).json({ error: 'Kernel not found' });
  }
  
  const agents = Array.from(kernel.agents.values());
  res.json(agents);
});

// Get specific agent
app.get('/api/agent/:agentId', (req, res) => {
  const { agentId } = req.params;
  
  // Search across all kernels for the agent
  for (const kernel of activeKernels.values()) {
    if (kernel.agents.has(agentId)) {
      const agent = kernel.agents.get(agentId);
      return res.json({
        agent: agent,
        kernel: kernel.getKernelStatus(),
        deployment: deployedAgents.get(agentId)
      });
    }
  }
  
  res.status(404).json({ error: 'Agent not found' });
});

// Evolve kernel
app.post('/api/kernel/:kernelId/evolve', async (req, res) => {
  try {
    const { kernelId } = req.params;
    const { stimuli } = req.body;
    
    const kernel = activeKernels.get(kernelId);
    if (!kernel) {
      return res.status(404).json({ error: 'Kernel not found' });
    }
    
    await kernel.evolveKernel(stimuli);
    
    res.json({
      success: true,
      status: kernel.getKernelStatus(),
      message: 'Kernel evolved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system metrics
app.get('/api/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    totalKernels: activeKernels.size,
    totalAgents: Array.from(activeKernels.values()).reduce((sum, k) => sum + k.agents.size, 0),
    deployedAgents: deployedAgents.size,
    averageEntropy: Array.from(activeKernels.values()).reduce((sum, k) => sum + k.entropy, 0) / activeKernels.size,
    kernels: Array.from(activeKernels.values()).map(k => ({
      id: k.kernelId,
      name: k.name,
      entropy: k.entropy,
      agents: k.agents.size
    }))
  };
  
  res.json(metrics);
});

// Agent interaction endpoint
app.post('/api/agent/:agentId/interact', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { command, data } = req.body;
    
    // Find the agent across all kernels
    let agent = null;
    let parentKernel = null;
    
    for (const kernel of activeKernels.values()) {
      if (kernel.agents.has(agentId)) {
        agent = kernel.agents.get(agentId);
        parentKernel = kernel;
        break;
      }
    }
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Simulate agent interaction
    const response = {
      agentId: agentId,
      agentName: agent.name,
      command: command,
      response: `Agent ${agent.name} executed: ${command}`,
      timestamp: new Date().toISOString(),
      data: data
    };
    
    // Evolve parent kernel based on interaction
    await parentKernel.evolveKernel({
      type: 'interaction',
      data: { command, agentId }
    });
    
    res.json({
      success: true,
      interaction: response,
      kernelEntropy: parentKernel.entropy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 ScrollEntropy API server running on port ${PORT}`);
  console.log(`📍 Server URL: http://0.0.0.0:${PORT}`);
  console.log(`🔗 API Health: http://0.0.0.0:${PORT}/api/health`);
  
  await initializeMainKernel();
  
  console.log(`✅ ScrollEntropy production system ready!`);
  console.log(`🧠 Main Kernel: ${mainKernel.kernelId}`);
  console.log(`🌐 Frontend: http://0.0.0.0:${PORT}/index.html`);
});

module.exports = app;
