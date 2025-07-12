import React, { useState, useEffect } from "react";

const sampleCIDs = [
  { cid: "bafybeia6…", label: "🧾 File Index Ledger", timestamp: "2025-07-12T03:30" },
  { cid: "bafybeigo…", label: "📜 DAO Proposal", timestamp: "2025-07-12T03:40" },
  { cid: "bafybeihv…", label: "🌐 MintLog Snapshot", timestamp: "2025-07-06T22:18" },
];

export default function CodexCIDMap() {
  const [hoverCID, setHoverCID] = useState(null);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🌌 Codex CID Constellation Map</h1>
      <svg width="800" height="500" style={{ border: "1px solid #ccc" }}>
        {sampleCIDs.map((c, i) => (
          <circle
            key={i}
            cx={150 + i * 200}
            cy={250}
            r={30}
            fill="#55f"
            onMouseEnter={() => setHoverCID(c)}
            onMouseLeave={() => setHoverCID(null)}
          />
        ))}
      </svg>
      {hoverCID && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #aaa", background: "#f9f9f9" }}>
          <h3>{hoverCID.label}</h3>
          <p><strong>CID:</strong> {hoverCID.cid}</p>
          <p><strong>Timestamp:</strong> {hoverCID.timestamp}</p>
          <p><strong>IPFS Viewer:</strong> <a href={`https://ipfs.io/ipfs/${hoverCID.cid}`} target="_blank" rel="noreferrer">Open</a></p>
        </div>
      )}
    </div>
  );
}
