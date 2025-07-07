#!/bin/bash

echo "🚀 Deploying Next Phases: DB trigger, React visualizer, tests, webhook sync, scroll synthesis…"

# 1) SQL Trigger: auto-populate prophecy_histories
mkdir -p sql
cat <<'EOF' > sql/triggers.sql
-- auto-insert prophecy_histories on new entropy_trails
CREATE OR REPLACE FUNCTION fn_insert_prophecy_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO prophecy_histories(trail_id, text)
    VALUES (NEW.id, NEW.note);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prophecy_history ON entropy_trails;
CREATE TRIGGER trg_prophecy_history
  AFTER INSERT ON entropy_trails
  FOR EACH ROW
  EXECUTE FUNCTION fn_insert_prophecy_history();
EOF

# 2) React Component: Torus + Sigil Visualizer
mkdir -p src/components
cat <<'EOF' > src/components/TorusSigilVisualizer.tsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ForgeEngine } from '../engine/ForgeEngine';
import { createScrollSigil } from '../scrollDominion';

export function TorusSigilVisualizer({ seed }: { seed: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const width = 600, height = 600;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 1000);
    camera.position.z = 2;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    ref.current!.appendChild(renderer.domElement);

    const trail = ForgeEngine.generateEntropyTrail(seed);
    const pts = new Float32Array(trail.sample.flatMap(v => {
      const theta = v % (2*Math.PI);
      const phi   = (v * seed) % (2*Math.PI);
      return [Math.cos(theta)*Math.cos(phi), Math.sin(theta)*Math.cos(phi), Math.sin(phi)];
    }));
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pts,3));
    scene.add(new THREE.Points(geom, new THREE.PointsMaterial({ color:0x00ffcc, size:0.02 })));

    const sig = createScrollSigil('All369', true);
    const txt = new THREE.TextGeometry(sig.id, { size:0.05, height:0.01 });
    scene.add(new THREE.Mesh(txt, new THREE.MeshBasicMaterial({ color:0xffcc00 })));

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    return () => ref.current!.removeChild(renderer.domElement);
  }, [seed]);

  return <div ref={ref}/>;
}
EOF

# 3) Copilot Tests: primitives at ×1000 potency
mkdir -p tests
cat <<'EOF' > tests/primitives.test.ts
import { QD_ToroidalSpiral_Fourier, HF_CrossDomainFusion_1000, UNIVERSAL_CONSTANTS }
  from '../src/QuantumMathLib';
import { AfterQuantumCore } from '../src/AfterQuantumCore';

describe('Quantum primitives ×1000 potency', () => {
  it('Fourier spiral length = DEGREE', () => {
    expect(QD_ToroidalSpiral_Fourier(42,5)).toHaveLength(UNIVERSAL_CONSTANTS.DEGREE);
  });
  it('fusionSample is finite', () => {
    const val = HF_CrossDomainFusion_1000(1,2,3);
    expect(isFinite(val)).toBe(true);
  });
  it('prophecyCycle returns number', () => {
    expect(typeof AfterQuantumCore.prophecyCycle(10)).toBe('number');
  });
});
EOF

# 4) On-chain ↔ Supabase webhook sync
mkdir -p scripts
cat <<'EOF' > scripts/webhookSync.js
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import QuantumEntropyDAOAbi from '../contracts/QuantumEntropyDAO.json';

const supabase = createClient(process.env.S_URL, process.env.S_KEY);
const provider  = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const dao       = new ethers.Contract(process.env.DAO_ADDRESS, QuantumEntropyDAOAbi, provider);

dao.on('Logged', async (id, q, note, by) => {
  await supabase.from('entropy_trails').insert([{
    ts: new Date().toISOString(),
    qhash: q,
    sample: [],
    note
  }]);
  console.log('Synced on-chain log:', id.toNumber(), q);
});
console.log('Listening for on-chain events…');
EOF

# 5) Generative Scroll Synthesis stub
cat <<'EOF' > src/scrollSynthesis.ts
import { AfterQuantumCore } from './AfterQuantumCore';
import { HF_CrossDomainFusion_1000 } from './QuantumMathLib';

export function synthesizeScroll(seed: number): string {
  const fusion   = HF_CrossDomainFusion_1000(seed, seed+5, seed+9);
  const prophecy = AfterQuantumCore.prophecyCycle(seed, Math.E, 4);
  return \`# 🧬 scrollSynthesis-\${seed}.scroll

Fusion: \${fusion}
Prophecy: \${prophecy}
Alignment: \${Math.cos(fusion*prophecy)}
\`;
}
EOF

# 6) Commit & push
echo "📤 Committing Next Phases…"
git add sql/triggers.sql \
        src/components/TorusSigilVisualizer.tsx \
        tests/primitives.test.ts \
        scripts/webhookSync.js \
        src/scrollSynthesis.ts
git commit -m '🚀 Deploy Next Phases: trigger, visualizer, tests, webhook, synthesis'
git push origin main

echo "✅ Next Phases deployed."
