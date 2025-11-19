"use client"
import { useState, useEffect, useRef } from "react"
import { postJSON, requestId } from "@/lib/client"
import Pad from "./Pad"
import { LatticeSynthesisEngine, type EntropyParams } from "@/lib/latticeSynthesis"
import { SequencerClock } from "@/lib/sequencerClock"
import { AudioEngine } from "@/lib/audioEngine"

export default function Sequencer({ tenantId, createdBy, currentArtifact }: any) {
  const tracks = [
    // DRUMS
    { name: "Kick Deep", sample: "kick_deep", color: "bg-red-500", category: "Drums" },
    { name: "Kick Punch", sample: "kick_punch", color: "bg-red-600", category: "Drums" },
    { name: "Kick 808", sample: "kick_808", color: "bg-red-700", category: "Drums" },
    { name: "Kick Acoustic", sample: "kick_acoustic", color: "bg-red-800", category: "Drums" },
    { name: "Snare Tight", sample: "snare_tight", color: "bg-orange-500", category: "Drums" },
    { name: "Snare Fat", sample: "snare_fat", color: "bg-orange-600", category: "Drums" },
    { name: "Snare Clap", sample: "snare_clap", color: "bg-orange-700", category: "Drums" },
    { name: "Rim", sample: "rim", color: "bg-yellow-500", category: "Drums" },
    { name: "HH Closed", sample: "hihat_closed", color: "bg-lime-500", category: "Drums" },
    { name: "HH Open", sample: "hihat_open", color: "bg-lime-600", category: "Drums" },
    { name: "HH Pedal", sample: "hihat_pedal", color: "bg-green-500", category: "Drums" },
    { name: "HH Sizzle", sample: "hihat_sizzle", color: "bg-green-600", category: "Drums" },
    { name: "Clap", sample: "clap", color: "bg-cyan-500", category: "Perc" },
    { name: "Snap", sample: "snap", color: "bg-cyan-600", category: "Perc" },
    { name: "Shaker", sample: "shaker", color: "bg-blue-500", category: "Perc" },
    { name: "Tambourine", sample: "tambourine", color: "bg-blue-600", category: "Perc" },
    // TOMS
    { name: "Tom Low", sample: "tom_low", color: "bg-purple-500", category: "Toms" },
    { name: "Tom Mid", sample: "tom_mid", color: "bg-purple-600", category: "Toms" },
    { name: "Tom High", sample: "tom_high", color: "bg-pink-500", category: "Toms" },
    { name: "Tom Floor", sample: "tom_floor", color: "bg-pink-600", category: "Toms" },
    // CYMBALS
    { name: "Crash", sample: "crash", color: "bg-rose-500", category: "Cymbals" },
    { name: "Ride", sample: "ride", color: "bg-rose-600", category: "Cymbals" },
    { name: "Splash", sample: "splash", color: "bg-rose-700", category: "Cymbals" },
    { name: "China", sample: "china", color: "bg-rose-800", category: "Cymbals" },
    // BASS
    { name: "Bass Sub", sample: "bass_sub", color: "bg-indigo-500", category: "Bass" },
    { name: "Bass 808", sample: "bass_808", color: "bg-indigo-600", category: "Bass" },
    { name: "Bass Synth", sample: "bass_synth", color: "bg-indigo-700", category: "Bass" },
    { name: "Bass Reese", sample: "bass_reese", color: "bg-indigo-800", category: "Bass" },
    { name: "Bass Wobble", sample: "bass_wobble", color: "bg-violet-500", category: "Bass" },
    { name: "Bass FM", sample: "bass_fm", color: "bg-violet-600", category: "Bass" },
    { name: "Bass Pluck", sample: "bass_pluck", color: "bg-violet-700", category: "Bass" },
    { name: "Bass Acid", sample: "bass_acid", color: "bg-violet-800", category: "Bass" },
    // PADS
    { name: "Pad Warm", sample: "pad_warm", color: "bg-amber-500", category: "Pads" },
    { name: "Pad Bright", sample: "pad_bright", color: "bg-amber-600", category: "Pads" },
    { name: "Pad Dark", sample: "pad_dark", color: "bg-amber-700", category: "Pads" },
    { name: "Pad Strings", sample: "pad_strings", color: "bg-amber-800", category: "Pads" },
    { name: "Pad Choir", sample: "pad_choir", color: "bg-yellow-600", category: "Pads" },
    { name: "Pad Ambient", sample: "pad_ambient", color: "bg-yellow-700", category: "Pads" },
    // LEADS
    { name: "Lead Saw", sample: "lead_saw", color: "bg-emerald-500", category: "Leads" },
    { name: "Lead Square", sample: "lead_square", color: "bg-emerald-600", category: "Leads" },
    { name: "Lead Pluck", sample: "lead_pluck", color: "bg-emerald-700", category: "Leads" },
    { name: "Lead FM", sample: "lead_fm", color: "bg-emerald-800", category: "Leads" },
    { name: "Lead Sync", sample: "lead_sync", color: "bg-teal-500", category: "Leads" },
    { name: "Lead Arp", sample: "lead_arp", color: "bg-teal-600", category: "Leads" },
    // KEYS
    { name: "Keys Piano", sample: "keys_piano", color: "bg-sky-500", category: "Keys" },
    { name: "Keys Electric", sample: "keys_electric", color: "bg-sky-600", category: "Keys" },
    { name: "Keys Organ", sample: "keys_organ", color: "bg-sky-700", category: "Keys" },
    { name: "Keys Bell", sample: "keys_bell", color: "bg-sky-800", category: "Keys" },
    // FX
    { name: "FX Riser", sample: "fx_riser", color: "bg-fuchsia-500", category: "FX" },
    { name: "FX Impact", sample: "fx_impact", color: "bg-fuchsia-600", category: "FX" },
    { name: "FX Sweep", sample: "fx_sweep", color: "bg-fuchsia-700", category: "FX" },
    { name: "FX Noise", sample: "fx_noise", color: "bg-fuchsia-800", category: "FX" },
    { name: "FX Glitch", sample: "fx_glitch", color: "bg-pink-700", category: "FX" },
    { name: "FX Reverse", sample: "fx_reverse", color: "bg-pink-800", category: "FX" },
  ]

  const [pattern, setPattern] = useState<Record<string, boolean[]>>(
    Object.fromEntries(tracks.map((t) => [t.name, Array(16).fill(false)])),
  )
  const [busy, setBusy] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [bpm, setBpm] = useState(120)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const [entropy, setEntropy] = useState<EntropyParams>({
    density: 0.5,
    coherence: 0.5,
    phase: 0.5,
    space: 0.5,
  })

  const engineRef = useRef<AudioEngine | null>(null)
  const playerRef = useRef<LatticeSynthesisEngine | null>(null)
  const clockRef = useRef<SequencerClock | null>(null)

  useEffect(() => {
    const init = async () => {
      const engine = new AudioEngine()
      await engine.boot()
      engineRef.current = engine

      const player = new LatticeSynthesisEngine(engine.ctx!)
      await player.generateAllInstruments(entropy)
      playerRef.current = player

      const clock = new SequencerClock(engine.ctx!)
      clock.bpm = bpm
      clock.onStep = (step) => {
        setCurrentStep(step)
        tracks.forEach((track) => {
          if (pattern[track.name][step]) {
            player.playSample(track.sample, engine.masterGain, 0.8)
          }
        })
      }
      clockRef.current = clock

      console.log("[v0] Lattice synthesis engine initialized")
    }
    init()
  }, [])

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.generateAllInstruments(entropy)
    }
  }, [entropy])

  useEffect(() => {
    if (clockRef.current) {
      clockRef.current.onStep = (step) => {
        setCurrentStep(step)
        tracks.forEach((track) => {
          if (pattern[track.name][step]) {
            playerRef.current?.playSample(track.sample, engineRef.current!.masterGain, 0.8)
          }
        })
      }
    }
  }, [pattern])

  function togglePlayback() {
    if (!clockRef.current) return
    if (isPlaying) {
      clockRef.current.stop()
      setIsPlaying(false)
      setCurrentStep(-1)
    } else {
      clockRef.current.start()
      setIsPlaying(true)
    }
  }

  function previewSound(sampleName: string) {
    if (playerRef.current && engineRef.current) {
      playerRef.current.playSample(sampleName, engineRef.current.masterGain, 0.8)
    }
  }

  async function writePattern() {
    setBusy(true)
    try {
      const rid = requestId()
      const ops = tracks.flatMap((t) =>
        pattern[t.name].map((on, step) => (on ? { op: "note_on", track: t.name, step } : null)).filter(Boolean),
      )
      
      // Save to localStorage first as backup
      localStorage.setItem('scrollchain_pattern', JSON.stringify(pattern))
      console.log("[v0] Pattern saved to localStorage")
      
      // Try to save to database if artifact exists
      const artifactId = currentArtifact?.id || `local_pattern_${Date.now()}`
      
      const res = await postJSON("/api/preset/mutate", {
        tenantId: tenantId || "default",
        userId: createdBy || "user",
        artifactId: artifactId,
        ops: ops,
      })
      
      console.log("[v0] Pattern committed:", res)
      alert("Pattern saved successfully!")
    } catch (error) {
      console.error("[v0] Pattern commit error:", error)
      console.log("[v0] Pattern saved to localStorage as fallback")
    } finally {
      setBusy(false)
    }
  }

  const categories = ["All", ...Array.from(new Set(tracks.map((t) => t.category)))]
  const filteredTracks = selectedCategory === "All" ? tracks : tracks.filter((t) => t.category === selectedCategory)

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-bold mb-3 text-purple-300">Lattice Entropy Controls</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs opacity-70 block mb-1">Density</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={entropy.density}
              onChange={(e) => setEntropy({ ...entropy, density: Number.parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-center mt-1">{(entropy.density * 100).toFixed(0)}%</div>
          </div>
          <div>
            <label className="text-xs opacity-70 block mb-1">Coherence</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={entropy.coherence}
              onChange={(e) => setEntropy({ ...entropy, coherence: Number.parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-center mt-1">{(entropy.coherence * 100).toFixed(0)}%</div>
          </div>
          <div>
            <label className="text-xs opacity-70 block mb-1">Phase</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={entropy.phase}
              onChange={(e) => setEntropy({ ...entropy, phase: Number.parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-center mt-1">{(entropy.phase * 100).toFixed(0)}%</div>
          </div>
          <div>
            <label className="text-xs opacity-70 block mb-1">Space</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={entropy.space}
              onChange={(e) => setEntropy({ ...entropy, space: Number.parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-center mt-1">{(entropy.space * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <button
          onClick={togglePlayback}
          className={`px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${
            isPlaying
              ? "bg-red-600 hover:bg-red-500 shadow-red-500/50"
              : "bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 shadow-lime-500/50"
          }`}
        >
          {isPlaying ? "⏸ Stop" : "▶ Play"}
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-70">BPM:</label>
          <input
            type="number"
            value={bpm}
            onChange={(e) => {
              const newBpm = Number.parseInt(e.target.value)
              setBpm(newBpm)
              if (clockRef.current) clockRef.current.setBPM(newBpm)
            }}
            className="w-20 px-2 py-1 rounded bg-black/40 border border-white/10"
            min="60"
            max="200"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-70">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 rounded bg-black/40 border border-white/10"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs opacity-50">
          {Object.keys(playerRef.current?.samples || {}).length} instruments loaded
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
        {filteredTracks.map((track, i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${track.color}`} />
                <div className="text-sm font-semibold text-gray-200">{track.name}</div>
                <div className="text-xs opacity-50">{track.category}</div>
              </div>
              <button
                onClick={() => previewSound(track.sample)}
                className="px-3 py-1 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
              >
                Preview
              </button>
            </div>
            <div className="grid grid-cols-16 gap-1">
              {Array.from({ length: 16 }).map((_, step) => (
                <Pad
                  key={step}
                  activeColor={track.color}
                  active={pattern[track.name][step]}
                  isPlaying={isPlaying && currentStep === step}
                  onToggle={(active: boolean) => {
                    const next = [...pattern[track.name]]
                    next[step] = active
                    setPattern({ ...pattern, [track.name]: next })
                    if (active) previewSound(track.sample)
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={writePattern}
        disabled={busy}
        className="mt-3 w-full bg-lime-600 hover:bg-lime-500 disabled:bg-gray-700 disabled:text-gray-500 rounded px-4 py-2 text-sm font-bold transition-colors"
      >
        {busy ? "Committing..." : "Commit Pattern (Auditable)"}
      </button>
    </div>
  )
}
