
// 🧠 ScrollChainOS Deployment Server
const express = require('express');
const cors = require('cors');

const dashboardAPI = require('./dashboard-api');
const extendedAPI = require('./dashboard-extended-api');
const biosystemAPI = require('./biosystem-api'); // ✅ Add biosystem API

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'));
app.use('/viewer', express.static(__dirname + '/../public/viewer'));
app.use('/api', dashboardAPI);
app.use('/api', extendedAPI);
app.use('/api/biosystem', biosystemAPI); // ✅ Mount biosystem API

// Serve biosystem dashboard
app.get('/biosystem', (req, res) => {
  res.sendFile(__dirname + '/../ScrollBiosystem-Dashboard.html');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ScrollChainOS is alive',
    biosystem: 'active',
    entropy: 10.0,
    quantumState: 'aligned'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧠 ScrollChainOS server running on port ${PORT}`);
  console.log(`🌀 Biosystem dashboard: http://0.0.0.0:${PORT}/biosystem`);
});
