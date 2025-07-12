#!/usr/bin/env bash
echo "🧭 Forging MetaIndex UI Shell — routing core + layout..."

mkdir -p scrollchain-meta-index/src/components
mkdir -p scrollchain-meta-index/src/pages

# === Main Layout ===
cat <<'EOF' > scrollchain-meta-index/src/components/MainLayout.tsx
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "sans-serif", margin: "2rem" }}>
      <nav>
        <a href="/codex-cid-map">🔭 CID Map</a> | 
        <a href="/codex-vault">📜 Vault</a> | 
        <a href="/codex-cloud-dashboard">☁️ Cloud Dashboard</a> | 
        <a href="/codex-observatory">🧬 Observatory</a>
      </nav>
      <hr />
      {children}
    </div>
  );
}
EOF

# === App Router ===
cat <<'EOF' > scrollchain-meta-index/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import CodexCIDMap from "./pages/CodexCIDMap";
import CodexVault from "./pages/CodexVault";
import CodexCloudDashboard from "./pages/CodexCloudDashboard";
import CodexObservatory from "./pages/CodexObservatory";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/codex-cid-map" element={<MainLayout><CodexCIDMap /></MainLayout>} />
        <Route path="/codex-vault" element={<MainLayout><CodexVault /></MainLayout>} />
        <Route path="/codex-cloud-dashboard" element={<MainLayout><CodexCloudDashboard /></MainLayout>} />
        <Route path="/codex-observatory" element={<MainLayout><CodexObservatory /></MainLayout>} />
      </Routes>
    </Router>
  );
}
EOF

echo "✅ MetaIndex UI shell scaffolded: App.tsx + MainLayout"
