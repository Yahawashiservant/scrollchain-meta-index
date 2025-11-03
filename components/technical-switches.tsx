"use client"

interface TechnicalSwitchesProps {
  values: {
    dimensions: number
    density_target: number
    phase_mode: string
    headroom_db: number
  }
  onChange: (values: TechnicalSwitchesProps["values"]) => void
}

export function TechnicalSwitches({ values, onChange }: TechnicalSwitchesProps) {
  return (
    <div className="space-y-4">
      <div className="text-xs uppercase tracking-wider opacity-70">Technical switches</div>

      <div className="space-y-3">
        <label className="space-y-2">
          <div className="text-sm opacity-90">Dimensions</div>
          <input
            type="number"
            min="4"
            max="32"
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm"
            value={values.dimensions}
            onChange={(e) => onChange({ ...values, dimensions: Number(e.target.value) })}
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm opacity-90">Density target</div>
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm"
            value={values.density_target}
            onChange={(e) => onChange({ ...values, density_target: Number(e.target.value) })}
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm opacity-90">Phase mode</div>
          <select
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm"
            value={values.phase_mode}
            onChange={(e) => onChange({ ...values, phase_mode: e.target.value })}
          >
            <option value="adaptive">Adaptive</option>
            <option value="minimal">Minimal</option>
            <option value="wide">Wide</option>
          </select>
        </label>

        <label className="space-y-2">
          <div className="text-sm opacity-90">Headroom (dB)</div>
          <input
            type="number"
            min="6"
            max="24"
            step="1"
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm"
            value={values.headroom_db}
            onChange={(e) => onChange({ ...values, headroom_db: Number(e.target.value) })}
          />
        </label>
      </div>
    </div>
  )
}
