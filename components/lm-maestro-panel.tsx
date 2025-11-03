"use client"
import type { LmResponse } from "@/hooks/use-lm-maestro"

interface LmMaestroPanelProps {
  response: LmResponse | null
  loading: boolean
  sessionMemory?: {
    vibe?: string
    targetSystem?: string
    favoriteTextures?: string[]
    recentActions?: string[]
  }
}

export function LmMaestroPanel({ response, loading, sessionMemory }: LmMaestroPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wider opacity-70">LM Maestro</div>
        <div className="text-sm leading-relaxed">
          {loading && <div className="opacity-70 animate-pulse">Thinking...</div>}
          {!loading && !response && (
            <div className="opacity-70">
              Describe what you want to create, and I'll guide you through the possibilities.
            </div>
          )}
          {!loading && response && <div className="text-white/90">{response.summary}</div>}
        </div>
      </div>

      {sessionMemory && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="text-xs uppercase tracking-wider opacity-70">Session memory</div>
          {sessionMemory.vibe && (
            <div className="text-sm">
              <span className="opacity-70">Vibe:</span> {sessionMemory.vibe}
            </div>
          )}
          {sessionMemory.targetSystem && (
            <div className="text-sm">
              <span className="opacity-70">Target:</span> {sessionMemory.targetSystem}
            </div>
          )}
          {sessionMemory.favoriteTextures && sessionMemory.favoriteTextures.length > 0 && (
            <div className="text-sm">
              <span className="opacity-70">Textures:</span> {sessionMemory.favoriteTextures.join(", ")}
            </div>
          )}
        </div>
      )}

      {response && response.next_suggestions.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="text-xs uppercase tracking-wider opacity-70">Try next</div>
          <div className="flex flex-wrap gap-2">
            {response.next_suggestions.map((suggestion, i) => (
              <button
                key={i}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
