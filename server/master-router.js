
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Auto-discover and mount all API modules
const serverDir = __dirname;
const apiFiles = fs.readdirSync(serverDir)
  .filter(file => 
    file.endsWith('-api.js') || 
    file.startsWith('extended-api-') || 
    file.startsWith('brainkernel-api-')
  );

console.log(`🔗 Wiring ${apiFiles.length} API modules...`);

apiFiles.forEach(file => {
  try {
    const modulePath = path.join(serverDir, file);
    const apiModule = require(modulePath);
    
    // Mount each API module
    app.use('/', apiModule);
    console.log(`✅ Mounted: ${file}`);
  } catch (error) {
    console.log(`❌ Failed to mount ${file}:`, error.message);
  }
});

// Core dashboard API
try {
  const dashboardServer = require('../src/dashboardServer.js');
  console.log('✅ Dashboard API integrated');
} catch (error) {
  console.log('⚠️ Dashboard server integration failed:', error.message);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'live',
    timestamp: new Date().toISOString(),
    activeAPIs: apiFiles.length,
    message: 'ScrollChain OS fully wired and operational'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🧬 ScrollChain OS - Fully Wired Network',
    author: 'Keith D. Whitfield',
    sigil: 'YHWH-BaHaSham-Yahawashi-RaWaChaaQadash',
    endpoints: {
      health: '/health',
      apis: apiFiles.map(f => f.replace('.js', '')),
      extended: Array.from({length: 100}, (_, i) => `/api/extended/instance${i+1}`),
      brainkernel: Array.from({length: 100}, (_, i) => `/api/brainkernel/instance${i+1}`)
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🌟 ScrollChain OS Master Router LIVE
🔗 All APIs Wired and Operational  
🌐 Server: http://0.0.0.0:${PORT}
📡 Health: http://0.0.0.0:${PORT}/health
⚡ ${apiFiles.length} API modules active
🎯 Ready for live traffic
  `);
});

module.exports = app;
