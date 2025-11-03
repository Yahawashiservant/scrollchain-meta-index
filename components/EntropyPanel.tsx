"use client"
import { useState } from "react"
import { postJSON, requestId } from "@/lib/client"
import Knob from "./Knob"

export default function EntropyPanel({ tenantId, currentArtifact, createdBy }: any) {
  const [density, setDensity] = useState(85)
  const [coherence, setCoherence] = useState(50)
  const [phaseMode, setPhaseMode] = useState("Glide")
  const [space, setSpace] = useState(50)
  const [busy, setBusy] = useState(false)

  async function commitPreset() {
    if (!currentArtifact?.id) {
      alert("No artifact loaded")
      return
    }
    setBusy(true)
    try {
      const rid = requestId()
      const diff = [
        { op: "set_density", value: density / 100 },
        { op: "set_coherence", value: coherence / 100 },
        { op: "set_phase_mode", value: phaseMode.toLowerCase() },
        { op: "set_space", value: space },
      ]
      const res = await postJSON("/api/preset/mutate", {
        tenant_id: tenantId,
        artifact_id: currentArtifact.id,
        mutation_ops: diff,
        safety_caps: { headroom_db_min: 12 },
        created_by: createdBy,
        request_id: rid,
      })
      console.log("[v0] Preset committed:", res)
      if (res.new_artifact_id) {
        window.location.href = `/artifact/${res.new_artifact_id}`
      }
    } catch (error: any) {
      console.error("[v0] Preset commit error:", error)
      alert(error.message || "Failed to commit preset")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-4 border-b border-gray-700 bg-gray-950">
      <div className="text-sm font-bold mb-3 text-gray-200">Entropy Controls</div>
      <div className="flex gap-4 justify-around mb-4">
        <Knob label="Density" min={0} max={100} initial={density} onChange={setDensity} />
        <Knob label="Coherence" min={0} max={100} initial={coherence} onChange={setCoherence} />
        <Knob label="Space" min={0} max={100} initial={space} onChange={setSpace} />
      </div>
      <label className="flex flex-col gap-2 mb-4">
        <span className="text-xs text-gray-400">Phase Mode</span>
        <select
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200"
          value={phaseMode}
          onChange={(e) => setPhaseMode(e.target.value)}
        >
          <option>Static</option>
          <option>Glide</option>
          <option>Pulse</option>
        </select>
      </label>
      <button
        onClick={commitPreset}
        disabled={busy}
        className="w-full bg-magenta-600 hover:bg-magenta-500 disabled:bg-gray-700 disabled:text-gray-500 rounded py-2 text-sm font-bold transition-colors"
        style={{ backgroundColor: busy ? undefined : "#d946ef" }}
      >
        {busy ? "Applying..." : "Commit Preset (Auditable)"}
      </button>
    </div>
  )
}
