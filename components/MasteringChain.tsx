"use client"
import Knob from "./Knob"

export default function MasteringChain({
  onMultiband,
  onLimiter,
}: {
  onMultiband?: (params: {
    lowFreq?: number
    midFreq?: number
    lowRatio?: number
    midRatio?: number
    highRatio?: number
  }) => void
  onLimiter?: (params: { threshold?: number; ratio?: number }) => void
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-4 space-y-4">
      <div className="text-sm uppercase tracking-widest opacity-70">Mastering Chain</div>

      <div className="space-y-3">
        <div className="text-xs uppercase opacity-70">Multiband Compression</div>
        <div className="flex gap-3">
          <Knob label="Low Ratio" initial={30} onChange={(v) => onMultiband?.({ lowRatio: 1 + v * 0.05 })} />
          <Knob label="Mid Ratio" initial={25} onChange={(v) => onMultiband?.({ midRatio: 1 + v * 0.04 })} />
          <Knob label="High Ratio" initial={20} onChange={(v) => onMultiband?.({ highRatio: 1 + v * 0.03 })} />
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-white/10">
        <div className="text-xs uppercase opacity-70">Limiter</div>
        <div className="flex gap-3">
          <Knob label="Threshold" initial={90} onChange={(v) => onLimiter?.({ threshold: -10 + v * 0.1 })} />
          <Knob label="Ratio" initial={80} onChange={(v) => onLimiter?.({ ratio: 10 + v * 0.2 })} />
        </div>
      </div>
    </div>
  )
}
