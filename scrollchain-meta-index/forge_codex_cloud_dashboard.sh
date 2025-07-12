#!/usr/bin/env bash
echo "🌐 Forging /codex-cloud-dashboard view..."

DASH_PATH="scrollchain-meta-index/src/pages/CodexCloudDashboard.tsx"
mkdir -p scrollchain-meta-index/src/pages

cat <<'EOF' > $DASH_PATH
import React from 'react';

const services = [
  { name: "Google Cloud Billing API", status: "✅ Connected", trigger: "PricingModelEngine" },
  { name: "Pub/Sub — Entropy Broadcast", status: "⚡ Live", trigger: "CodexEntropyListener" },
  { name: "Cloud Function — Scroll Mint Trigger", status: "✅ Listening", trigger: "CodexMintTriggerListener" },
  { name: "Sheets — ScrollMintLogs", status: "📋 Syncing", trigger: "Mint Receipt Generation" },
  { name: "BigQuery — Symbol Entropy Correlation", status: "📊 Bound", trigger: "SymbolEntropyBinder" }
];

const ledgers = [
  "GoogleCloudSyncLedger.md",
  "ScrollChainDAO_NotarizationLedger.md",
  "ScrollChain_Module_Validator.md"
];

export default function CodexCloudDashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>☁️ Codex Cloud Dashboard</h1>

      <h2>📦 Google Cloud Services</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr><th>Service</th><th>Status</th><th>Trigger Module</th></tr>
        </thead>
        <tbody>
          {services.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.status}</td>
              <td>{s.trigger}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>📜 Synced Ledgers</h2>
      <ul>
        {ledgers.map((l, i) => <li key={i}>{l}</li>)}
      </ul>

      <h2>🧬 Codex Triggers</h2>
      <ul>
        <li>/mint ➝ CloudFunction ➝ DAO sync</li>
        <li>/entropy ➝ PubSub ➝ BigQuery bind</li>
        <li>/pricing ➝ BillingAPI ➝ Sheet sync</li>
      </ul>
    </div>
  );
}
EOF

echo "✅ Codex Cloud Dashboard view created at $DASH_PATH"
