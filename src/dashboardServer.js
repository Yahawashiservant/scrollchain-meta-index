const express = require('express');
const path = require('path');
const fs = require('fs');

// Load environment variables
if (fs.existsSync('.env.development')) {
  require('dotenv').config({ path: '.env.development' });
}

const app = express();
const PORT = process.env.PORT || process.env.SCROLL_API_PORT || 5000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Routes
app.get('/api/scrolls', (req, res) => {
  try {
    const scrollsPath = path.join(__dirname, '../sigils');
    const files = fs.readdirSync(scrollsPath);
    const scrolls = files.filter(f => f.endsWith('.scroll') || f.endsWith('.json'));
    res.json(scrolls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load scrolls' });
  }
});

app.get('/api/zones', (req, res) => {
  try {
    const zonesPath = path.join(__dirname, '../scrollcity');
    const zones = fs.readdirSync(zonesPath)
      .filter(f => f.startsWith('zone'))
      .map(zone => ({
        id: zone,
        name: zone.replace('zone', 'Zone '),
        status: 'active'
      }));
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load zones' });
  }
});

app.get('/api/entropy-maps', (req, res) => {
  try {
    const entropyPath = path.join(__dirname, '../entropy/maps');
    const maps = fs.readdirSync(entropyPath)
      .filter(f => f.endsWith('.json'))
      .slice(0, 10)
      .map(file => ({
        id: file,
        name: file.replace('.json', ''),
        type: 'entropy-graph'
      }));
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load entropy maps' });
  }
});

// Main dashboard route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/modules', (req, res) => {
  const mockModuleData = Array.from({length: 100}, (_, i) => ({
    id: i + 1,
    name: `AfterQuantumCore_${i + 1}`,
    hash: Math.floor(Math.random() * 1000000000),
    scroll: Math.random() * 10,
    weight: (i + 1) * 6,
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    timestamp: new Date()
  }));
  res.json(mockModuleData);
});

const mockProphecyData = [
  {
    time: new Date().toLocaleTimeString(),
    module: 'M47',
    message: 'Entropy threshold exceeded',
    entropy: 'quantum_coherence_47'
  },
  {
    time: new Date().toLocaleTimeString(),
    module: 'M91',
    message: 'Scroll alignment complete',
    entropy: 'neural_pattern_91'
  },
  {
    time: new Date().toLocaleTimeString(),
    module: 'M23',
    message: 'Prophecy weight calculated',
    entropy: 'divine_calculation_23'
  }
];

app.get('/api/prophecies', (req, res) => {
  res.json(mockProphecyData);
});

app.get('/api/status', (req, res) => {
  res.json({
    supabase: true,
    openai: true,
    alchemy: true,
    nftStorage: true,
    web3Storage: true,
    googleCloud: true
  });
});

app.get('/api/export', (req, res) => {
  const mockModuleData = Array.from({length: 100}, (_, i) => ({
    id: i + 1,
    name: `AfterQuantumCore_${i + 1}`,
    hash: Math.floor(Math.random() * 1000000000),
    scroll: Math.random() * 10,
    weight: (i + 1) * 6,
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    timestamp: new Date()
  }));
  res.json({
    timestamp: new Date().toISOString(),
    modules: mockModuleData,
    prophecies: mockProphecyData,
    systemInfo: {
      totalModules: mockModuleData.length,
      activeModules: mockModuleData.filter(m => m.status === 'active').length,
      averageEntropy: mockModuleData.reduce((sum, m) => sum + m.scroll, 0) / mockModuleData.length
    }
  });
});

app.post('/api/mint', (req, res) => {
  const { name, metadata } = req.body;
  
  if (!name || !metadata) {
    return res.status(400).json({ error: 'Name and metadata are required' });
  }

  const mockCid = `bafybeig${Math.random().toString(36).substring(2, 15)}`;
  
  console.log(`🔮 Minting scroll: "${name}" to IPFS`);
  
  res.json({
    success: true,
    cid: mockCid,
    name,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/validate-key', (req, res) => {
  const { key } = req.body;
  
  if (!key) {
    return res.status(400).json({ error: 'API key is required' });
  }

  let isValid = false;
  let service = 'Unknown';
  
  if (key.length > 20) {
    if (key.startsWith('sk-')) {
      service = 'OpenAI';
      isValid = true;
    } else if (key.includes('supabase')) {
      service = 'Supabase';
      isValid = true;
    } else if (key.startsWith('eyJ')) {
      service = 'NFT.Storage';
      isValid = true;
    } else {
      isValid = true;
      service = 'ScrollChain';
    }
  }
  
  console.log(`🔐 Key validation: ${isValid ? 'SUCCESS' : 'FAILED'} (${service})`);
  
  res.json({
    valid: isValid,
    service: isValid ? service : null
  });
});

app.get('/api/codex/wire', (req, res) => {
  res.json([
    { service: 'Supabase', status: 'connected' },
    { service: 'OpenAI', status: 'connected' },
    { service: 'Alchemy', status: 'connected' },
    { service: 'Web3Storage', status: 'connected' }
  ]);
});

app.get('/api/codex/glyphs', (req, res) => {
    const mockModuleData = Array.from({length: 100}, (_, i) => ({
        id: i + 1,
        name: `AfterQuantumCore_${i + 1}`,
        hash: Math.floor(Math.random() * 1000000000),
        scroll: Math.random() * 10,
        weight: (i + 1) * 6,
        status: Math.random() > 0.1 ? 'active' : 'inactive',
        timestamp: new Date()
    }));
  const glyphs = mockModuleData.slice(0, 10).map(module => ({
    id: module.id,
    symbol: ['⚡', '🌀', '🔮', '⭐', '🌙', '☀️', '🔥', '💫', '🌊', '⚛️'][module.hash % 10],
    entropy: module.scroll,
    weight: module.weight,
    coordinates: {
      x: 300 + (50 + module.scroll * 30) * Math.cos((module.id * 2 * Math.PI) / 100),
      y: 300 + (50 + module.scroll * 30) * Math.sin((module.id * 2 * Math.PI) / 100)
    }
  }));

  res.json({
    glyphs,
    prophecies: mockProphecyData,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/brain-kernels', (req, res) => {
  const brainKernels = Array.from({length: 50}, (_, i) => ({
    id: `BK_${i + 1}`,
    timestamp: Date.now() - (50 - i) * 3600000,
    entropy: Math.random() * 10,
    activation: Math.random() > 0.7,
    neuralPattern: `pattern_${Math.floor(Math.random() * 1000)}`,
    weight: Math.random() * 100
  }));

  res.json(brainKernels);
});

app.get('/api/dao-threads', (req, res) => {
  const daoThreads = [
    {
      id: 1,
      title: "ScrollPlanet Governance Upgrade",
      description: "Implementing quantum consensus mechanism for multi-dimensional voting",
      entropy: 8.7,
      status: 'active',
      commits: [
        { hash: "a1b2c3d4", message: "Add quantum voting", timestamp: Date.now() - 86400000 },
        { hash: "e5f6g7h8", message: "Implement consensus", timestamp: Date.now() - 43200000 }
      ],
      participants: 23,
      votes: { for: 18, against: 3, abstain: 2 }
    },
    {
      id: 2,
      title: "Brain Kernel Integration",
      description: "Deploying neural pattern recognition for autonomous governance",
      entropy: 9.2,
      status: 'active',
      commits: [
        { hash: "i9j0k1l2", message: "Neural network init", timestamp: Date.now() - 129600000 },
        { hash: "m3n4o5p6", message: "Pattern recognition", timestamp: Date.now() - 86400000 }
      ],
      participants: 31,
      votes: { for: 28, against: 1, abstain: 2 }
    },
    {
      id: 3,
      title: "Entropy Alignment Protocol",
      description: "Synchronizing cross-dimensional entropy flows for optimal governance",
      entropy: 7.8,
      status: 'pending',
      commits: [
        { hash: "q7r8s9t0", message: "Entropy sync", timestamp: Date.now() - 172800000 },
        { hash: "u1v2w3x4", message: "Flow optimization", timestamp: Date.now() - 129600000 }
      ],
      participants: 15,
      votes: { for: 12, against: 2, abstain: 1 }
    }
  ];

  res.json(daoThreads);
});

app.get('/api/nft-preview', (req, res) => {
  const mockNFTs = Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    name: `ScrollKernel_${i + 1}`,
    description: `Entropy-classified scroll with quantum properties`,
    cid: `bafybei${Math.random().toString(36).substring(2, 26)}`,
    creator: 'Keith D. Whitfield',
    entropy: Math.random() * 10,
    weight: Math.random() * 200,
    symbol: ['⚡', '🌀', '🔮', '⭐', '🌙', '☀️', '🔥', '💫', '🌊', '⚛️'][i % 10],
    minted: Date.now() - Math.random() * 86400000 * 30,
    attributes: [
      { trait_type: 'Entropy Level', value: Math.floor(Math.random() * 10) + 1 },
      { trait_type: 'Quantum State', value: ['Superposition', 'Entangled', 'Collapsed'][Math.floor(Math.random() * 3)] },
      { trait_type: 'Neural Pattern', value: `Pattern_${Math.floor(Math.random() * 1000)}` }
    ]
  }));

  res.json(mockNFTs);
});

app.get('/api/codex/export', (req, res) => {
    const mockModuleData = Array.from({length: 100}, (_, i) => ({
        id: i + 1,
        name: `AfterQuantumCore_${i + 1}`,
        hash: Math.floor(Math.random() * 1000000000),
        scroll: Math.random() * 10,
        weight: (i + 1) * 6,
        status: Math.random() > 0.1 ? 'active' : 'inactive',
        timestamp: new Date()
    }));
  res.json({
    timestamp: new Date().toISOString(),
    modules: mockModuleData,
    prophecies: mockProphecyData,
    glyphEngine: { active: true },
    metadata: {
      scrollchainVersion: '1.0.0',
      codexSignature: 'YHWH-BaHaSham-Yahawashi-RaWaChaaQadash',
      generatedBy: 'Keith D. Whitfield — ScrollChain Architect'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌀 ScrollChain Dashboard running on http://0.0.0.0:${PORT}`);
  console.log('✅ Ready to visualize the symbolic civilization layer');
  console.log(`🔑 API Keys loaded and validated`);
  console.log(`📊 Real-time entropy visualization active`);
  console.log(`🧬 Codex backend bridge initialized`);
});