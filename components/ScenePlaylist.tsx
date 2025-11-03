"use client"
import { useState } from "react"
import { reloadEngineFromArtifacts } from "@/lib/reloadHelper"

type Channel = "Bass" | "Pad" | "Drum" | "Lead"
type Artifact = { id: string; name?: string; storage_uri: string }
type Scene = {
  id: string
  name: string
  mapping: Partial<Record<Channel, Artifact>>
  duration?: number
  crossfade?: number
}

export default function ScenePlaylist({
  engine,
  initialScenes,
  onSave,
}: {
  engine: any
  initialScenes?: Scene[]
  onSave?: (scenes: Scene[]) => Promise<void> | void
}) {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes ?? [])
  const [current, setCurrent] = useState<number>(-1)
  const [busy, setBusy] = useState(false)

  async function triggerScene(idx: number) {
    const scene = scenes[idx]
    if (!scene) return
    setBusy(true)
    try {
      await reloadEngineFromArtifacts(engine, scene.mapping as any, { loop: true, masterGain: 0.9 })
      setCurrent(idx)
      console.log("[v0] Scene triggered:", scene.name)
      // TODO: publish over bus: music.scene.triggered
    } catch (error) {
      console.error("[v0] Scene trigger error:", error)
    }
    setBusy(false)
  }

  function addScene() {
    const id = crypto.randomUUID()
    setScenes([...scenes, { id, name: `Scene ${scenes.length + 1}`, mapping: {} }])
  }

  function updateSceneName(idx: number, name: string) {
    const ns = [...scenes]
    ns[idx].name = name
    setScenes(ns)
  }

  function removeScene(idx: number) {
    setScenes(scenes.filter((_, i) => i !== idx))
    if (current === idx) setCurrent(-1)
  }

  async function save() {
    if (onSave) await onSave(scenes)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="flex justify-between items-center">
        <div className="text-sm uppercase tracking-widest opacity-70">Scene Playlist</div>
        <button
          onClick={addScene}
          className="px-3 py-1 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-sm transition-colors"
        >
          + Add Scene
        </button>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {scenes.length === 0 ? (
          <div className="text-center py-8 opacity-50 text-sm">No scenes yet. Add one to get started.</div>
        ) : (
          scenes.map((s, i) => (
            <div
              key={s.id}
              className={`rounded-xl border p-3 transition-colors ${
                i === current ? "border-lime-400 bg-lime-500/10" : "border-white/10 bg-black/20"
              }`}
            >
              <div className="flex justify-between items-center gap-2">
                <input
                  value={s.name}
                  onChange={(e) => updateSceneName(i, e.target.value)}
                  className="bg-transparent font-semibold flex-1 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => triggerScene(i)}
                    disabled={busy}
                    className="px-2 py-1 rounded bg-lime-500 text-black text-xs font-semibold hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {busy && current === i ? "Loading…" : "Play"}
                  </button>
                  <button
                    onClick={() => removeScene(i)}
                    className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-xs opacity-70 mt-1">Channels: {Object.keys(s.mapping).length}</div>
            </div>
          ))
        )}
      </div>
      <button
        onClick={save}
        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        Save Playlist
      </button>
    </div>
  )
}
