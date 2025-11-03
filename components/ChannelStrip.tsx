"use client"
import Fader from "./Fader"
import Knob from "./Knob"
import Meter from "./Meter"

export default function ChannelStrip({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 w-24 p-3 rounded-xl bg-gradient-to-br from-[#0E1218] to-[#0A0D12] border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
      <div className="text-xs tracking-wider uppercase opacity-70">{label}</div>
      <Meter level={64} />
      <div className="flex gap-2">
        <Knob label="Pan" size="sm" />
        <Knob label="Space" size="sm" />
      </div>
      <Fader label="Gain" />
      <div className="flex gap-2">
        <button className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          Mute
        </button>
        <button className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          Solo
        </button>
      </div>
    </div>
  )
}
