
import express from 'express';
import path from 'path';
import { ScrollChainDashboard } from './dashboardAPI.js';

const app = express();
const PORT = process.env.PORT || 5000;
const dashboard = new ScrollChainDashboard();

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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌀 ScrollChainOS Dashboard running on http://0.0.0.0:${PORT}`);
  console.log(`🔑 API Keys loaded and validated`);
  console.log(`📊 Real-time entropy visualization active`);
});
