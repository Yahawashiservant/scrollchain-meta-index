const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/export-kernels', (req, res) => {
  const kernelDir = path.join(__dirname, '../brainkernels');
  const exportDir = path.join(__dirname, '../cli_exports');
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

  const files = fs.readdirSync(kernelDir).filter(f => f.endsWith('.scroll'));
  const exported = [];

  files.forEach(file => {
    const base = path.basename(file, '.scroll');
    const outPath = path.join(exportDir, `${base}.js`);
    const content = `
      // Exported from ScrollChainOS
      module.exports = function(env) {
        return {
          name: '${base}',
          traits: ['SovereignMemory', 'DAOCompliance'],
          sigil: 'RaWaChaaQadash',
          envHooks: env
        };
      };
    `;
    fs.writeFileSync(outPath, content.trim());
    exported.push(`${base}.js`);
  });

  res.json({ status: 'Export complete', files: exported });
});

module.exports = router;

router.get('/export/formats', (req, res) => {
  res.json({
    supported_formats: ['JSON', 'CSV', 'XML', 'SCROLL'],
    exports_today: 10000
  });
});

