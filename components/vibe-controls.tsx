"use client"

interface VibeControlsProps {
  values: {
    mood: string
    intensity: "low" | "medium" | "high"
    space: "tight" | "open" | "vast"
    motion: "static" | "glide" | "pulse"
  }
  onChange: (values: VibeControlsProps["values"]) => void
}

export function VibeControls({ values, onChange }: VibeControlsProps) {
  return (
    <div className="space-y-4">
      <div className="text-xs uppercase tracking-wider opacity-70">Vibe controls</div>

      <div className="space-y-3">
        <label className="space-y-2">
          <div className="text-sm opacity-90">Mood</div>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm"
            placeholder="e.g., dark, warm, ethereal"
            value={values.mood}
            onChange={(e) => onChange({ ...values, mood: e.target.value })}
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm opacity-90">Intensity</div>
          <select
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm"
            value={values.intensity}
            onChange={(e) => onChange({ ...values, intensity: e.target.value as "low" | "medium" | "high" })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="space-y-2">
          <div className="text-sm opacity-90">Space</div>
          <select
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm"
            value={values.space}
            onChange={(e) => onChange({ ...values, space: e.target.value as "tight" | "open" | "vast" })}
          >
            <option value="tight">Tight</option>
            <option value="open">Open</option>
            <option value="vast">Vast</option>
          </select>
        </label>

        <label className="space-y-2">
          <div className="text-sm opacity-90">Motion</div>
          <select
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm"
            value={values.motion}
            onChange={(e) => onChange({ ...values, motion: e.target.value as "static" | "glide" | "pulse" })}
          >
            <option value="static">Static</option>
            <option value="glide">Glide</option>
            <option value="pulse">Pulse</option>
          </select>
        </label>
      </div>
    </div>
  )
}
