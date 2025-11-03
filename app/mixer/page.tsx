"use client"
import { useEffect, useRef, useState } from "react"
import { AudioEngine } from "@/lib/audioEngine"
import Spectrogram from "@/components/Spectrogram"
import ShaderSpectrum from "@/components/ShaderSpectrum"
import ChannelStripFx from "@/components/ChannelStripFx"
import MasteringChain from "@/components/MasteringChain"
import TransportBar from "@/components/TransportBar"
import Sequencer from "@/components/Sequencer"
import AudioReactiveBackground from "@/components/AudioReactiveBackground"

export default function MixerBoard() {
  const engineRef = useRef<AudioEngine | null>(null)
  const [ready, setReady] = useState(false)
  const channels = ["Bass", "Pad", "Drum", "Lead"] as const

  useEffect(() => {
    const engine = new AudioEngine()
    engineRef.current = engine
    ;(async () => {
      await engine.boot()
      setReady(true)
    })()
  }, [])

  if (!ready)
    return (
      <main className="min-h-screen bg-[#0B0E13] text-gray-100 p-8 flex items-center justify-center relative">
        <AudioReactiveBackground />
        <div className="relative z-10 text-center space-y-4">
          <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Mixer Console
          </div>
          <div className="text-sm opacity-70 animate-pulse">Booting audio engine...</div>
        </div>
      </main>
    )

  const engine = engineRef.current!

  return (
    <main className="flex flex-col min-h-screen bg-[#0B0E13] text-gray-100 relative">
      <AudioReactiveBackground />

      <div className="relative z-10">
        <TransportBar engineRef={engineRef} />

        <section className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_60px_rgba(6,182,212,0.2),0_0_40px_rgba(6,182,212,0.1)]">
              <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Master Spectrum</div>
              <ShaderSpectrum engine={engine} channel="Master" />
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4 shadow-[0_20px_60px_rgba(168,85,247,0.15)]">
              <div className="text-sm uppercase tracking-widest opacity-70 mb-3">
                Master Spectrogram (time × frequency)
              </div>
              <Spectrogram engine={engine} sourceKey="Master" />
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4 shadow-[0_20px_60px_rgba(59,130,246,0.15)]">
              <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Sequencer</div>
              <Sequencer tenantId="default-tenant" createdBy="user@example.com" currentArtifact={{ id: "demo" }} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
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
                    onEQ={(band, gainDb) => engine.setEQ(c, band, gainDb)}
                    onComp={(params) => engine.setComp(c, params)}
                    onMute={() => (engine.channels[c].muted ? engine.unmuteChannel(c) : engine.muteChannel(c))}
                    spectrum={<ShaderSpectrum engine={engine} channel={c} />}
                    spectrogram={<Spectrogram engine={engine} sourceKey={c} />}
                  />
                ))}
                <ChannelStripFx
                  label="Master"
                  onGain={(v: number) => engine.setMasterGain(v / 100)}
                  spectrum={<ShaderSpectrum engine={engine} channel="Master" />}
                  spectrogram={<Spectrogram engine={engine} sourceKey="Master" />}
                />
              </div>
            </div>

            <MasteringChain
              onMultiband={(params) => engine.setMultiband(params)}
              onLimiter={(params) => engine.setLimiter(params)}
            />

            <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4 shadow-[0_20px_60px_rgba(34,197,94,0.15)]">
              <div className="text-sm uppercase tracking-widest opacity-70 mb-3">FX Returns</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 p-3 bg-white/[0.06]">
                  <div className="text-xs uppercase opacity-70 mb-2">Reverb Out</div>
                  <Spectrogram engine={engine} sourceKey="FX:Reverb" />
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs opacity-70">Level</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      defaultValue={50}
                      onChange={(e) => engine.setFxOut("Reverb", Number(e.target.value) / 100)}
                      className="flex-1 h-1 bg-white/10 rounded-full"
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 p-3 bg-white/[0.06]">
                  <div className="text-xs uppercase opacity-70 mb-2">Delay Out</div>
                  <Spectrogram engine={engine} sourceKey="FX:Delay" />
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs opacity-70">Level</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      defaultValue={60}
                      onChange={(e) => engine.setFxOut("Delay", Number(e.target.value) / 100)}
                      className="flex-1 h-1 bg-white/10 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
