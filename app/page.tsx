"use client"

import Link from "next/link"
import { Sparkles, AudioWaveform as Waveform, Grid3x3, Receipt, Activity, Sliders } from "lucide-react"
import { AudioReactiveBackground } from "@/components/AudioReactiveBackground"
import { HolographicFeature } from "@/components/HolographicFeature"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  const [audioLevel, setAudioLevel] = useState(0)
  const audioContextRef = useRef<AudioContext>()
  const analyserRef = useRef<AnalyserNode>()

  useEffect(() => {
    const initAudio = async () => {
      try {
        const ctx = new AudioContext()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256

        const oscillator = ctx.createOscillator()
        oscillator.frequency.value = 0.5
        oscillator.connect(analyser)
        analyser.connect(ctx.destination)
        oscillator.start()

        audioContextRef.current = ctx
        analyserRef.current = analyser

        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        const updateLevel = () => {
          analyser.getByteFrequencyData(dataArray)
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255
          setAudioLevel(avg * 0.3)
          requestAnimationFrame(updateLevel)
        }
        updateLevel()
      } catch (err) {
        console.error("Audio init failed:", err)
      }
    }

    const handleClick = () => {
      initAudio()
      document.removeEventListener("click", handleClick)
    }
    document.addEventListener("click", handleClick)

    return () => document.removeEventListener("click", handleClick)
  }, [])

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0B0E13] via-[#0F1419] to-[#0B0E13] text-gray-100 overflow-hidden">
      <AudioReactiveBackground audioContext={audioContextRef.current} analyser={analyserRef.current} />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 backdrop-blur-xl mb-4 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-sm text-cyan-400 font-semibold tracking-wide">3D Neural Console · AR Studio</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              ScrollChain
            </span>
            <br />
            <span className="text-5xl md:text-7xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(6,182,212,0.5)] animate-pulse">
              Lattice Studio
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Generate, mutate, and mix audio artifacts in a virtual 3D studio.
            <br />
            Professional DAW with AR visualization and AI-powered lattice entropy synthesis.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/neural"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:shadow-[0_0_80px_rgba(6,182,212,0.8)] transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: "0 0 40px rgba(6,182,212,0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Launch Neural Console
              </span>
            </Link>
            <Link
              href="/studio"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:from-white/15 hover:to-white/10 transition-all duration-300 font-bold hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Waveform className="w-5 h-5" />
                Classic Studio
              </span>
            </Link>
            <Link
              href="/mixer"
              className="px-8 py-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:from-white/15 hover:to-white/10 transition-all duration-300 font-bold flex items-center gap-2 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              <Sliders className="w-5 h-5" />
              Mixer
            </Link>
          </div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/15 rounded-full blur-2xl animate-pulse delay-1500" />
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Professional Audio Workflow
            </h2>
            <p className="text-xl text-gray-400">Everything you need to create, mix, and manage lattice audio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="md:col-span-2 lg:col-span-3">
              <HolographicFeature
                icon={Sparkles}
                title="Neural Console"
                description="Immersive 3D virtual studio with AR visualization, AI copilot, session management, and real-time mesh orchestration. The future of audio production."
                href="/neural"
                gradient="from-cyan-500 via-blue-500 to-purple-500"
                index={0}
                audioLevel={audioLevel}
              />
            </div>

            <HolographicFeature
              icon={Waveform}
              title="Studio"
              description="Generate lattice artifacts with AI-powered synthesis, sequencer, and entropy controls"
              href="/studio"
              gradient="from-cyan-500 to-blue-500"
              index={1}
              audioLevel={audioLevel * 0.8}
            />

            <HolographicFeature
              icon={Sliders}
              title="Mixer"
              description="Professional mixing console with FX sends, spectrograms, and real-time visualization"
              href="/mixer"
              gradient="from-blue-500 to-purple-500"
              index={2}
              audioLevel={audioLevel * 1.2}
            />

            <HolographicFeature
              icon={Grid3x3}
              title="Catalog"
              description="Browse and manage your complete library of generated audio artifacts"
              href="/catalog"
              gradient="from-purple-500 to-pink-500"
              index={3}
              audioLevel={audioLevel * 0.9}
            />

            <HolographicFeature
              icon={Receipt}
              title="Receipts"
              description="Auditable operation logs with full lineage tracking and cryptographic verification"
              href="/receipts"
              gradient="from-emerald-500 to-teal-500"
              index={4}
              audioLevel={audioLevel * 0.7}
            />

            <HolographicFeature
              icon={Sparkles}
              title="Sessions"
              description="Save and compare project states with A/B testing and version control"
              href="/sessions"
              gradient="from-orange-500 to-red-500"
              index={5}
              audioLevel={audioLevel * 1.1}
            />

            <HolographicFeature
              icon={Activity}
              title="Health"
              description="System monitoring, performance metrics, and integration status checks"
              href="/health"
              gradient="from-green-500 to-emerald-500"
              index={6}
              audioLevel={audioLevel * 0.6}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10 z-10">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>ScrollChain Lattice Studio · Cryptographic Audio Generation</p>
        </div>
      </footer>
    </main>
  )
}
