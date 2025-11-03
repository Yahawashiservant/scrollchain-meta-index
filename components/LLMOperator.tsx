"use client"
import { useState } from "react"
import { useAtomicReload } from "@/hooks/useAtomicReload"

export default function LLMOperator({
  engine,
  tenantId,
  createdBy,
  currentArtifact,
}: {
  engine: any
  tenantId: string
  createdBy: string
  currentArtifact?: { id: string }
}) {
  const [prompt, setPrompt] = useState("")
  const [options, setOptions] = useState<any[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const { trigger } = useAtomicReload(engine)

  async function suggest() {
    if (!prompt.trim()) return
    setBusy(true)
    setError("")

    try {
      const res = await fetch("/api/lm/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          context: { tenant_id: tenantId, current_artifact_id: currentArtifact?.id },
        }),
      })

      if (!res.ok) throw new Error("Suggestion failed")
      const data = await res.json()
      setOptions(data.options ?? [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function execute(ops: any[]) {
    setBusy(true)
    setError("")

    try {
      const request_id = crypto.randomUUID()
      const payload = {
        tenant_id: tenantId,
        artifact_id: currentArtifact?.id,
        mutation_ops: ops,
        safety_caps: { headroom_db_min: 12 },
        created_by: createdBy,
        request_id,
      }

      const r = await fetch("/api/preset/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!r.ok) throw new Error("Execution failed")

      await trigger() // Reload buffers from latest artifacts
      setOptions([]) // Clear options after successful execution
      setPrompt("") // Clear prompt
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="text-sm uppercase tracking-widest opacity-70 mb-3">LM Operator</div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your intent... (e.g., 'Make this a midnight water dub but club-ready')"
        className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-gray-100 placeholder:text-gray-500 mb-3 min-h-[100px] resize-none"
        disabled={busy}
      />

      <button
        onClick={suggest}
        disabled={busy || !prompt.trim()}
        className="w-full bg-cyan-600/80 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg py-2 font-semibold transition-colors"
      >
        {busy ? "Thinking..." : "Suggest Options"}
      </button>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <div className="mt-4 space-y-3">
        {options.map((o, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
            <div className="font-semibold text-cyan-400">{o.name}</div>
            <div className="text-xs opacity-70 mt-1">{o.why}</div>
            {o.acceptance && (
              <div className="mt-2 text-xs opacity-60">
                <div className="font-semibold mb-1">Acceptance:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {o.acceptance.map((a: string, j: number) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={() => execute(o.ops)}
              disabled={busy}
              className="mt-3 bg-lime-500 hover:bg-lime-400 disabled:bg-gray-700 text-black font-semibold rounded-lg px-4 py-1.5 transition-colors"
            >
              Execute
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
