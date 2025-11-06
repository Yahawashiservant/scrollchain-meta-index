"use client"
import { useCallback, useEffect, useState } from "react"
import { useNatsBus } from "@/hooks/useNatsBus"
import { useAudioEngine } from "@/hooks/useAudioEngine"
import ShaderSpectrum from "@/components/ShaderSpectrum"
import Spectrogram from "@/components/Spectrogram"
import ChannelStripFx from "@/components/ChannelStripFx"
import MasteringChain from "@/components/MasteringChain"
import LLMOperator from "@/components/LLMOperator"
import TransportBar from "@/components/TransportBar"
import SessionPlayer from "@/components/SessionPlayer"
import ScenePlaylist from "@/components/ScenePlaylist"
import { emitSessionMapOps, emitScenePlaylistOps } from "@/lib/sessionOps"
import Studio3D from "@/components/Studio3D"
import AudioReactiveBackground from "@/components/AudioReactiveBackground"
import EngineBootScreen from "@/components/layout/EngineBootScreen"

export default function NeuralConsole() {
  const [catalog, setCatalog] = useState<any[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [spectrum, setSpectrum] = useState<Float32Array>()
  const channels = ["Bass", "Pad", "Drum", "Lead"] as const
  const tenantId = "default-tenant"
  const createdBy = "user@example.com"

  const { engine, engineRef, ready, status, error, boot } = useAudioEngine({
    onReady: useCallback(async () => {
      try {
        const res = await fetch("/api/audit")
        const data = await res.json()
        setCatalog(data.artifacts ?? [])
      } catch (fetchError) {
        console.error("[v0] Failed to fetch artifacts:", fetchError)
      }
    }, []),
  })

  useNatsBus(engine, tenantId)

  useEffect(() => {
    if (!ready) return

    let animationId: number
    const animate = () => {
      engine.sampleSpectra()
      const masterSpectrum = engine.getSpectrum("Master")
      if (masterSpectrum) {
        const normalized = new Float32Array(masterSpectrum.length)
        for (let i = 0; i < masterSpectrum.length; i++) {
          normalized[i] = masterSpectrum[i] / 255
        }
        setSpectrum(normalized)
      }
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationId)
  }, [engine, ready])

  async function saveSessionMap(map: any) {
    const request_id = crypto.randomUUID()
    const value = Object.fromEntries(Object.entries(map).map(([ch, art]: any) => [ch, { artifact_id: art.id }]))
    const ops = emitSessionMapOps(value)
    try {
      await fetch("/api/preset/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          artifact_id: "SESSION",
          mutation_ops: ops,
          safety_caps: { headroom_db_min: 12 },
          created_by: createdBy,
          request_id,
        }),
      })
      console.log("[v0] Session map saved")
    } catch (error) {
      console.error("[v0] Failed to save session map:", error)
    }
  }

  async function saveScenePlaylist(scenes: any[]) {
    const request_id = crypto.randomUUID()
    const ops = emitScenePlaylistOps(scenes)
    try {
      await fetch("/api/preset/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          artifact_id: "PLAYLIST",
          mutation_ops: ops,
          safety_caps: { headroom_db_min: 12 },
          created_by: createdBy,
          request_id,
        }),
      })
      console.log("[v0] Scene playlist saved")
    } catch (error) {
      console.error("[v0] Failed to save scene playlist:", error)
    }
  }

  if (!ready)
    return (
      <EngineBootScreen
        title="Neural Console"
        message={status === "error" ? "Audio engine failed to initialize." : "Initializing audio engine..."}
        className="bg-gradient-to-br from-[#0B0E13] via-[#1a1f2e] to-[#0B0E13]"
      >
        {status === "error" ? (
          <button
            onClick={() => void boot()}
            className="mx-auto inline-flex items-center justify-center rounded-lg bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors"
          >
            Retry
          </button>
        ) : (
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse" style={{ width: "60%" }} />
          </div>
        )}
        {error ? (
          <div className="text-xs text-red-400/80">{error instanceof Error ? error.message : "Unknown error"}</div>
        ) : null}
      </EngineBootScreen>
    )

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#0B0E13] via-[#1a1f2e] to-[#0B0E13] text-gray-100 relative">
      <AudioReactiveBackground />

      <div className="relative z-10">
        <section className="h-[50vh] relative border-b border-white/10">
          <Studio3D spectrum={spectrum} isPlaying={isPlaying} />
          <div className="absolute top-4 left-4 z-10">
            <div className="text-xs uppercase tracking-widest opacity-50">Live 3D Visualization</div>
          </div>
        </section>

        <TransportBar engineRef={engineRef} onPlayStateChange={(playing) => setIsPlaying(playing)} />

        <section className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <SessionPlayer engine={engine} artifactsCatalog={catalog} initialMap={undefined} onSave={saveSessionMap} />
            <ScenePlaylist engine={engine} initialScenes={[]} onSave={saveScenePlaylist} />
          </div>

          <div className="col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Master Spectrum</div>
              <ShaderSpectrum engine={engine} channel="Master" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4">
              <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Master Spectrogram</div>
              <Spectrogram engine={engine} sourceKey="Master" />
            </div>
          </div>
        </section>

        {/* LLM operator */}
        <section className="px-6 pb-6">
          <LLMOperator engine={engine} tenantId={tenantId} createdBy={createdBy} currentArtifact={{ id: "current" }} />
        </section>

        {/* Mixer and inserts */}
        <section className="px-6 pb-6 grid grid-cols-1 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4">
            <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Mixer & Sends</div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {channels.map((c, i) => (
                <ChannelStripFx
                  key={i}
                  label={c}
                  onGain={(v: number) => engine.setChannelGain(c, v / 100)}
                  onPan={(v: number) => engine.setChannelPan(c, (v - 50) / 50)}
                  onSendRev={(v: number) => engine.setSend(c, "Reverb", v / 100)}
                  onSendDel={(v: number) => engine.setSend(c, "Delay", v / 100)}
                  onEQ={(band: "low" | "mid" | "high", gainDb: number) => engine.setEQ(c, band, gainDb)}
                  onComp={(params: any) => engine.setComp(c, params)}
                  onMute={() => (engine.channels[c].muted ? engine.unmuteChannel(c) : engine.muteChannel(c))}
                  spectrum={<ShaderSpectrum engine={engine} channel={c} />}
                  spectrogram={<Spectrogram engine={engine} sourceKey={c} />}
                />
              ))}
            </div>
          </div>

          <MasteringChain
            onMultiband={(params: any) => engine.setMultiband(params)}
            onLimiter={(params: any) => engine.setLimiter(params)}
          />
        </section>
      </div>
    </main>
  )
}
