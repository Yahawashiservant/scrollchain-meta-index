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
app.use('/viewer', express.static(__dirname + '/../public/viewer'));

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

// Start server
app.listen(PORT, () => {
  console.log(`🧠 ScrollChainOS server running on port ${PORT}`);
});

