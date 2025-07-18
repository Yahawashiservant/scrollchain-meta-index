// 🧠 ScrollChainOS Deployment Server
const express = require('express');
const cors = require('cors');

const dashboardAPI = require('./dashboard-api');
const extendedAPI = require('./dashboard-extended-api'); // ✅ Import after express

const app = express(); // ✅ Declare app before using it
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'));
app.use('/viewer', express.static(__dirname + '/../public/viewer'));
app.use('/api', dashboardAPI);
app.use('/api', extendedAPI); // ✅ Now safe to use

app.get('/api/health', (req, res) => {
  res.json({ status: 'ScrollChainOS is alive' });
});

app.listen(PORT, () => {
  console.log(`🧠 ScrollChainOS server running on port ${PORT}`);
});

