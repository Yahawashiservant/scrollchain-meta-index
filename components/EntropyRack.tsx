"use client"
import Knob from "./Knob"

export default function EntropyRack() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-6">
      <div className="text-sm uppercase tracking-widest opacity-70 mb-4">Lattice Controls</div>
      <div className="grid grid-cols-3 gap-6">
        <Knob label="Density" />
        <Knob label="Coherence" />
        <Knob label="Headroom" />
      </div>
      <div className="mt-6 flex gap-3">
        <button className="flex-1 px-4 py-2 rounded-lg bg-lime-500 text-black font-semibold shadow-[0_0_20px_rgba(132,204,22,0.5)] hover:brightness-110 transition-all">
          Commit
        </button>
        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          Revert
        </button>
      </div>
    </div>
  )
}
