"use client"

interface AssistChipsProps {
  onSelect: (action: string) => void
}

export function AssistChips({ onSelect }: AssistChipsProps) {
  const chips = [
    "Warmth +10%",
    "Open space",
    "Tighten transients",
    "Headroom +6 dB",
    "Add depth",
    "Brighten highs",
    "Deepen lows",
    "More air",
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors"
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
