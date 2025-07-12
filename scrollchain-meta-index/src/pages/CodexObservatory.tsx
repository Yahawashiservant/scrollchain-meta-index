import React, { useEffect, useState } from "react";

export default function CodexObservatory() {
  const [events, setEvents] = useState([]);
  const [cid, setCID] = useState("bafybeia6..."); // ← Replace with actual pinned CID

  useEffect(() => {
    const interval = setInterval(() => {
      const tick = {
        timestamp: new Date().toISOString(),
        entropy: Math.floor(Math.random() * 100),
        minted: "SCROLL-" + Math.floor(Date.now() / 1000),
        symbol: ["Ω", "Δ", "π", "∴", "↯"][Math.floor(Math.random() * 5)]
      };
      setEvents(prev => [tick, ...prev.slice(0, 49)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🪐 Codex Observatory</h1>
      <h2>📌 Monitoring IPFS CID: {cid}</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>⏱ Timestamp</th>
            <th>🔥 Entropy</th>
            <th>🪙 Mint ID</th>
            <th>🔔 Symbol</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i}>
              <td>{e.timestamp}</td>
              <td>{e.entropy}</td>
              <td>{e.minted}</td>
              <td>{e.symbol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
