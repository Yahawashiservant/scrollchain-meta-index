// 🧠 ScrollChainOS Deployment Server
const express = require('express');
const cors = require('cors');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/viewer', express.static(__dirname + '/../viewer'));
app.use('/public/viewer', express.static(__dirname + '/../public/viewer'));
app.use('/brainkernels', express.static(__dirname + '/../brainkernels'));
app.use('/cli_exports', express.static(__dirname + '/../cli_exports'));
app.use('/governance', express.static(__dirname + '/../governance'));
app.use('/licenses', express.static(__dirname + '/../licenses'));
app.use('/sigils', express.static(__dirname + '/../sigils'));
app.use('/agents', express.static(__dirname + '/../agents'));

// Import APIs (after app is initialized)
const dashboardAPI = require('./dashboard-api');
const extendedAPI = require('./extended-api');
const brainkernelAPI = require('./brainkernel-api');
const fusionAPI = require('./fusion-api');
const prophecyAPI = require('./prophecy-api');
const consultationAPI = require('./consultation-api');
const blueprintAPI = require('./blueprint-api');
const bigqueryAPI = require('./bigquery-api');
const exportAPI = require('./export-api');

// API Routing
app.use('/api', dashboardAPI);
app.use('/api', extendedAPI);
app.use('/api', brainkernelAPI);
app.use('/api', fusionAPI);
app.use('/api', prophecyAPI);
app.use('/api', consultationAPI);
app.use('/api', blueprintAPI);
app.use('/api', bigqueryAPI);
app.use('/api', exportAPI);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ScrollChainOS is alive' });
});

// Start server with fallback ports
const startServer = (port) => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🧠 ScrollChainOS server running on port ${port}`);
    console.log(`🌐 Access your luxury dashboard at: http://0.0.0.0:${port}`);
    console.log(`📡 API Health Check: http://0.0.0.0:${port}/api/health`);
    console.log(`🧬 Kernel Status: http://0.0.0.0:${port}/api/kernel/status`);
    console.log(`🤖 Agents: http://0.0.0.0:${port}/api/agents`);
    console.log(`📜 Scrolls: http://0.0.0.0:${port}/api/scrolls`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);

