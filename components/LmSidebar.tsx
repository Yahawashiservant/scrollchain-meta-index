"use client"
import { useState } from "react"
import { postJSON, requestId } from "@/lib/client"

interface Suggestion {
  name: string
  why: string
  params?: any
}

export default function LmSidebar({ tenantId, createdBy, currentArtifact }: any) {
  const [prompt, setPrompt] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [busy, setBusy] = useState(false)

  async function fetchSuggestions() {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const lmRes = await postJSON("/api/lm/suggest", {
        prompt,
        context: { tenant_id: tenantId, current_artifact_id: currentArtifact?.id },
      })
      setSuggestions(lmRes.options || [])
    } catch (error) {
      console.error("[v0] LM suggest error:", error)
      alert("Failed to generate suggestions")
    } finally {
      setBusy(false)
    }
  }

  async function applySuggestion(s: Suggestion) {
    setBusy(true)
    try {
      const rid = requestId()
      const gen = await postJSON("/api/lattice/generate", {
        tenant_id: tenantId,
        created_by: createdBy,
        kind: "sound",
        name: s.name,
        seed: s.params?.seed,
        dimensions: s.params?.dimensions ?? 12,
        density_target: s.params?.density_target ?? 0.85,
        psychoacoustic_profile: s.params?.psychoacoustic_profile ?? {
          phase: "adaptive",
          headroom_db: 18,
        },
        request_id: rid,
      })
      console.log("[v0] Suggestion applied:", gen)
      if (gen.artifact_id) {
        window.location.href = `/artifact/${gen.artifact_id}`
      }
    } catch (error) {
      console.error("[v0] Apply suggestion error:", error)
      alert("Failed to apply suggestion")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-4 flex-1 overflow-auto bg-gray-950">
      <div className="text-sm font-bold mb-2 text-gray-200">LM Maestro</div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your vibe... e.g., 'midnight water bass'"
        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-gray-200 mb-2 text-sm resize-none focus:border-cyan-500 focus:outline-none"
        rows={4}
      />
      <button
        onClick={fetchSuggestions}
        disabled={busy}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 rounded py-2 text-sm font-bold transition-colors"
      >
        {busy ? "Thinking..." : "Generate Suggestions"}
      </button>
      <div className="mt-3 space-y-2">
        {suggestions.map((s, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 p-2 rounded">
            <div className="font-semibold text-xs text-gray-200">{s.name}</div>
            <div className="text-xs text-gray-400 my-1">{s.why}</div>
            <button
              onClick={() => applySuggestion(s)}
              disabled={busy}
              className="text-xs bg-lime-600 hover:bg-lime-500 disabled:bg-gray-700 px-2 py-1 rounded transition-colors"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
