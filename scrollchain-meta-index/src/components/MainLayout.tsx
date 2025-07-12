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
