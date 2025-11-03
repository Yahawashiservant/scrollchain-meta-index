"use client"
import { useState } from "react"
import { postJSON, requestId } from "@/lib/client"
import Fader from "./Fader"
import Meter from "./Meter"

export default function Mixer({ tenantId, createdBy, currentArtifact }: any) {
  const channels = ["Bass", "Pad", "Drum", "Lead"]
  const [gains, setGains] = useState<Record<string, number>>(Object.fromEntries(channels.map((c) => [c, 75])))
  const [mutes, setMutes] = useState<Record<string, boolean>>(Object.fromEntries(channels.map((c) => [c, false])))
  const [busy, setBusy] = useState(false)

  async function commitMix() {
    if (!currentArtifact?.id) {
      alert("No artifact loaded")
      return
    }
    setBusy(true)
    try {
      const rid = requestId()
      const ops = [
        ...channels.map((c) => ({ op: "set_gain", channel: c, value: gains[c] })),
        ...channels.map((c) => ({ op: mutes[c] ? "mute" : "unmute", channel: c })),
      ]
      const res = await postJSON("/api/preset/mutate", {
        tenant_id: tenantId,
        artifact_id: currentArtifact.id,
        mutation_ops: ops,
        safety_caps: { headroom_db_min: 12 },
        created_by: createdBy,
        request_id: rid,
      })
      console.log("[v0] Mix committed:", res)
      if (res.new_artifact_id) {
        window.location.href = `/artifact/${res.new_artifact_id}`
      }
    } catch (error) {
      console.error("[v0] Mix commit error:", error)
      alert("Failed to commit mix")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-4 border-t border-gray-700 bg-gray-950">
      <div className="text-sm font-bold mb-3 text-gray-200">Mixer</div>
      <div className="flex gap-4 justify-around">
        {channels.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Meter level={gains[c]} />
            <Fader label={c} initial={gains[c]} onChange={(v: number) => setGains({ ...gains, [c]: v })} />
            <button
              onClick={() => setMutes({ ...mutes, [c]: !mutes[c] })}
              className={`mt-2 text-xs px-3 py-1 rounded transition-colors ${
                mutes[c] ? "bg-red-500/50 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {mutes[c] ? "Muted" : "Mute"}
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={commitMix}
        disabled={busy}
        className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 rounded py-2 text-sm font-bold transition-colors"
      >
        {busy ? "Committing..." : "Commit Mix (Auditable)"}
      </button>
    </div>
  )
}
