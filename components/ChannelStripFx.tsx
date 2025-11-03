"use client"
import Fader from "./Fader"
import type React from "react"

import Knob from "./Knob"

export default function ChannelStripFx({
  label,
  onGain,
  onPan,
  onSendRev,
  onSendDel,
  onEQ,
  onComp,
  onMute,
  spectrum,
  spectrogram,
}: {
  label: string
  onGain?: (v: number) => void
  onPan?: (v: number) => void
  onSendRev?: (v: number) => void
  onSendDel?: (v: number) => void
  onEQ?: (band: "low" | "mid" | "high", gainDb: number) => void
  onComp?: (params: { threshold?: number; ratio?: number }) => void
  onMute?: () => void
  spectrum?: React.ReactNode
  spectrogram?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 w-56 p-3 rounded-xl bg-gradient-to-br from-[#0E1218] to-[#0A0D12] border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
      <div className="text-xs tracking-wider uppercase opacity-70">{label}</div>
      {spectrum && <div className="rounded-xl overflow-hidden border border-white/10">{spectrum}</div>}
      {spectrogram && <div className="rounded-xl overflow-hidden border border-white/10">{spectrogram}</div>}

      <div className="flex justify-between">
        <Knob label="Pan" initial={50} onChange={onPan} />
        <Fader label="Gain" initial={75} onChange={onGain} />
      </div>

      {onEQ && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-xs uppercase opacity-70">EQ</div>
          <div className="flex gap-2">
            <Knob label="Low" initial={50} onChange={(v) => onEQ("low", (v - 50) / 5)} size="sm" />
            <Knob label="Mid" initial={50} onChange={(v) => onEQ("mid", (v - 50) / 5)} size="sm" />
            <Knob label="High" initial={50} onChange={(v) => onEQ("high", (v - 50) / 5)} size="sm" />
          </div>
        </div>
      )}

      {onComp && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-xs uppercase opacity-70">Comp</div>
          <div className="flex gap-2">
            <Knob label="Thresh" initial={30} onChange={(v) => onComp({ threshold: -40 + v * 0.4 })} size="sm" />
            <Knob label="Ratio" initial={40} onChange={(v) => onComp({ ratio: 1 + v * 0.1 })} size="sm" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70 w-12">Rev</span>
          <input
            type="range"
            min={0}
            max={100}
            defaultValue={0}
            onChange={(e) => onSendRev?.(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70 w-12">Delay</span>
          <input
            type="range"
            min={0}
            max={100}
            defaultValue={0}
            onChange={(e) => onSendDel?.(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onMute}
          className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          Mute
        </button>
        <button className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
          Solo
        </button>
      </div>
    </div>
  )
}
