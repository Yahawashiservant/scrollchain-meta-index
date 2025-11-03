"use client"
import { useEffect, useState } from "react"
import { reloadEngineFromArtifacts } from "@/lib/reloadHelper"

type Channel = "Bass" | "Pad" | "Drum" | "Lead"
type Artifact = { id: string; name?: string; storage_uri: string }

export default function SessionPlayer({
  engine,
  initialMap,
  onSave,
  artifactsCatalog,
}: {
  engine: any
  initialMap?: Partial<Record<Channel, Artifact>>
  onSave?: (map: Partial<Record<Channel, Artifact>>) => Promise<void> | void
  artifactsCatalog: Artifact[]
}) {
  const [map, setMap] = useState<Partial<Record<Channel, Artifact>>>(initialMap ?? {})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (artifactsCatalog.length === 0) return
    ;["Bass", "Pad", "Drum", "Lead"].forEach((ch) => {
      if (!map[ch as Channel]) {
        const pick = artifactsCatalog.find((a) => (a.name ?? "").toLowerCase().startsWith(ch.toLowerCase()))
        if (pick) setMap((m) => ({ ...m, [ch]: pick }))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artifactsCatalog])

  function select(ch: Channel, id: string) {
    const art = artifactsCatalog.find((a) => a.id === id)
    if (!art) return
    setMap({ ...map, [ch]: art })
  }

  async function play() {
    const hasArtifacts = Object.values(map).some((art) => art && art.storage_uri)
    if (!hasArtifacts) {
      console.log("[v0] No artifacts selected to play")
      return
    }

    setBusy(true)
    try {
      await reloadEngineFromArtifacts(engine, map as any, { loop: true, masterGain: 0.9 })
    } catch (error) {
      console.error("[v0] Session play error:", error)
    }
    setBusy(false)
  }

  async function save() {
    if (!onSave) return
    await onSave(map)
  }

  if (artifactsCatalog.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="text-sm uppercase tracking-widest opacity-70 mb-2">Play Session</div>
        <div className="text-sm opacity-50 py-8 text-center">
          No artifacts available. Generate some audio in the Studio first.
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="text-sm uppercase tracking-widest opacity-70">Play Session</div>
      <div className="grid grid-cols-2 gap-4">
        {(["Bass", "Pad", "Drum", "Lead"] as Channel[]).map((ch) => (
          <div key={ch} className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs uppercase opacity-70 mb-2">{ch}</div>
            <select
              className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              value={map[ch]?.id ?? ""}
              onChange={(e) => select(ch, e.target.value)}
            >
              <option value="">Select artifact</option>
              {artifactsCatalog.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name ?? a.id}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={play}
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-semibold hover:from-lime-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-lime-500/20"
        >
          {busy ? "Loading…" : "Play Session"}
        </button>
        <button
          onClick={save}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          Save Mapping
        </button>
      </div>
    </div>
  )
}
