"use client"
import { useEffect, useRef, useState } from "react"
import type React from "react"

import { AudioEngine } from "@/lib/audioEngine"

interface TransportBarProps {
  engineRef?: React.MutableRefObject<AudioEngine | null>
  artifacts?: Record<string, { storage_uri: string }>
  onPlayStateChange?: (isPlaying: boolean) => void
}

export default function TransportBar({ engineRef, artifacts, onPlayStateChange }: TransportBarProps) {
  const localEngineRef = useRef<AudioEngine | null>(null)
  const engine = engineRef || localEngineRef
  const [state, setState] = useState<"stopped" | "playing">("stopped")
  const [bpm, setBpm] = useState(120)
  const [masterGain, setMasterGain] = useState(90)

  useEffect(() => {
    if (!engineRef) {
      engine.current = new AudioEngine()
      engine.current.boot()
    }
  }, [engineRef, engine])

  async function play() {
    if (!engine.current) return

    if (engine.current.ctx?.state === "suspended") {
      await engine.current.ctx.resume()
    }

    setState("playing")
    onPlayStateChange?.(true)
    await engine.current.boot()

    if (artifacts) {
      const storageBase = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL || ""
      for (const [name, art] of Object.entries(artifacts)) {
        if (!["Bass", "Pad", "Drum", "Lead"].includes(name)) continue
        const url = `${storageBase}/${art.storage_uri}`
        try {
          await engine.current.loadChannelBuffer(name as any, url)
          engine.current.playChannel(name as any, true)
          console.log(`[v0] Playing ${name} from ${url}`)
        } catch (error) {
          console.error(`[v0] Failed to load ${name}:`, error)
        }
      }
    } else {
      ;(["Bass", "Pad", "Drum", "Lead"] as const).forEach((name) => {
        if (engine.current!.channels[name].buffer) {
          engine.current!.playChannel(name, true)
        }
      })
    }

    engine.current.setMasterGain(masterGain / 100)
  }

  function stop() {
    engine.current?.stop()
    setState("stopped")
    onPlayStateChange?.(false)
  }

  function handleMasterGain(value: number) {
    setMasterGain(value)
    engine.current?.setMasterGain(value / 100)
  }

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={state === "playing" ? stop : play}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center"
          >
            {state === "playing" ? (
              <div className="w-4 h-4 bg-white rounded-sm" />
            ) : (
              <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
            )}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          </button>

          <div className="flex flex-col">
            <div className="text-xs uppercase tracking-widest opacity-50">Transport</div>
            <div className="text-sm font-semibold">{state === "playing" ? "Playing" : "Stopped"}</div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <span className="text-xs uppercase tracking-widest opacity-50">Tempo</span>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-16 rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-center text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-xs uppercase tracking-widest opacity-50 mb-1">Master Gain</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={masterGain}
                onChange={(e) => handleMasterGain(Number(e.target.value))}
                className="w-32 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="text-sm font-mono w-12 text-right">{masterGain}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
