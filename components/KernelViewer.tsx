"use client"
import { useEffect, useState } from "react"

export default function KernelViewer({ tenantId }: { tenantId: string }) {
  const [log, setLog] = useState<any[]>([])
  const [summary, setSummary] = useState("")
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Mock NATS subscription - in production this would be a WebSocket
    const interval = setInterval(() => {
      // Simulate receiving mesh events
      const mockEvent = {
        subject: `music.preset.mutated.${tenantId}`,
        timestamp: new Date().toISOString(),
        data: { op: "sample_mutation", artifact_id: "mock-id" },
      }
      setLog((l) => [mockEvent, ...l].slice(0, 50))
    }, 10000)

    return () => clearInterval(interval)
  }, [tenantId])

  async function askLLM() {
    if (!question.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/lm/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context: log }),
      })
      const data = await res.json()
      setSummary(data.answer || "No response")
    } catch (error) {
      console.error("[v0] LLM query failed:", error)
      setSummary("Failed to get response")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4 space-y-3">
      <div className="text-sm uppercase tracking-widest opacity-70">Kernel Viewer</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") askLLM()
          }}
          placeholder="Ask about mesh state..."
          className="flex-1 p-2 rounded bg-black/40 border border-white/10 text-sm"
        />
        <button
          onClick={askLLM}
          disabled={loading}
          className="px-4 py-2 rounded bg-lime-600 hover:bg-lime-500 disabled:bg-gray-700 text-sm font-bold transition-colors"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>
      {summary && <div className="p-3 rounded bg-black/40 border border-white/10 text-sm opacity-90">{summary}</div>}
      <div className="max-h-64 overflow-y-auto text-xs font-mono space-y-1">
        {log.map((m, i) => (
          <div key={i} className="p-2 rounded bg-black/20 border border-white/5">
            <div className="text-lime-400">{m.subject}</div>
            <div className="opacity-60">{m.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
