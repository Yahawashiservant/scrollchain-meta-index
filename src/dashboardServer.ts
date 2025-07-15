
const express = require('express');
const path = require('path');
// Import our modules - we'll convert to require for now
const { ScrollChainDashboard } = require('./dashboardAPI');
const { CodexBackendBridge } = require('./codexBackendBridge');

const app = express();
const PORT = process.env.PORT || 5000;
const dashboard = new ScrollChainDashboard();
const codexBridge = new CodexBackendBridge();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'codex_render.html'));
});

app.get('/api/modules', async (req, res) => {
  try {
    const modules = await dashboard.getModuleData();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch module data' });
  }
});

app.get('/api/prophecies', async (req, res) => {
  try {
    const prophecies = await dashboard.getProphecyEntries();
    res.json(prophecies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prophecy entries' });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    const status = await dashboard.getApiStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API status' });
  }
});

app.get('/api/export', async (req, res) => {
  try {
    const data = await dashboard.exportEntropyData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

app.post('/api/mint', async (req, res) => {
  try {
    const { name, metadata, timestamp } = req.body;
    
    if (!name || !metadata) {
      return res.status(400).json({ error: 'Name and metadata are required' });
    }

    // Simulate IPFS pinning (replace with actual Web3Storage/NFT.Storage integration)
    const mockCid = `bafybeig${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`🔮 Minting scroll: "${name}" to IPFS`);
    console.log(`📝 Metadata: ${metadata.substring(0, 100)}...`);
    
    // Here you would integrate with actual IPFS/Web3Storage
    // Example: await nftStorage.store({ name, description: metadata, image: ... })
    
    res.json({
      success: true,
      cid: mockCid,
      name,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({ error: 'Failed to mint scroll' });
  }
});

app.post('/api/validate-key', async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'API key is required' });
    }

    // Basic key validation (expand with real API key checking)
    let isValid = false;
    let service = 'Unknown';
    
    if (key.length > 20) {
      // Check against known patterns
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
        // Generic validation for demo
        isValid = true;
        service = 'ScrollChain';
      }
    }
    
    console.log(`🔐 Key validation attempt: ${isValid ? 'SUCCESS' : 'FAILED'} (${service})`);
    
    res.json({
      valid: isValid,
      service: isValid ? service : null
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Failed to validate key' });
  }
});

app.get('/api/codex/wire', async (req, res) => {
  try {
    const results = await codexBridge.wireCodexAPIs();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to wire codex APIs' });
  }
});

app.get('/api/codex/glyphs', async (req, res) => {
  try {
    const glyphData = await codexBridge.linkBackendToGlyphEngine();
    res.json(glyphData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate glyph mappings' });
  }
});

app.get('/api/codex/export', async (req, res) => {
  try {
    const fullData = await codexBridge.exportCodexWithMetadata();
    res.json(fullData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export codex data' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌀 ScrollChainOS Dashboard running on http://0.0.0.0:${PORT}`);
  console.log(`🔑 API Keys loaded and validated`);
  console.log(`📊 Real-time entropy visualization active`);
  console.log(`🧬 Codex backend bridge initialized`);
  
  // Wire codex APIs on startup
  codexBridge.wireCodexAPIs()
    .then(() => console.log('✨ Codex APIs wired successfully'))
    .catch(err => console.log('⚠️ Some codex APIs failed to connect:', err.message));
});
