"use client"
import { useState } from "react"

export interface LmOption {
  name: string
  why: string
  params: {
    dimensions?: number
    density_target?: number
    psychoacoustic_profile?: {
      phase?: string
      headroom_db?: number
    }
    [key: string]: any
  }
}

export interface LmResponse {
  summary: string
  options: LmOption[]
  next_suggestions: string[]
}

export function useLmMaestro() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<LmResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generate(prompt: {
    vibe?: string
    intensity?: "low" | "medium" | "high"
    space?: "tight" | "open" | "vast"
    motion?: "static" | "glide" | "pulse"
    constraints?: any
    goal?: "performance" | "studio" | "museum"
  }) {
    setLoading(true)
    setError(null)

    try {
      // Simulate LM response - in production, this would call an LLM API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockResponse: LmResponse = {
        summary: generateSummary(prompt),
        options: generateOptions(prompt),
        next_suggestions: generateSuggestions(prompt),
      }

      setResponse(mockResponse)
      return mockResponse
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function refine(currentParams: any, changeRequest: string) {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockResponse: LmResponse = {
        summary: `Refined: ${changeRequest}`,
        options: [
          {
            name: "Refined version",
            why: "Adjusted parameters to match your request while preserving core character",
            params: { ...currentParams, refined: true },
          },
        ],
        next_suggestions: ["Try adding more space", "Increase intensity", "Tighten transients"],
      }

      setResponse(mockResponse)
      return mockResponse
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to refine"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { generate, refine, loading, response, error }
}

function generateSummary(prompt: any): string {
  const vibes = {
    "midnight water": "Subharmonic dusk: slow bloom, clean floor, velvet mid-pressure",
    "sunset dub": "Warm decay with golden harmonics and spacious reverb tails",
    "glacial techno": "Crystalline precision with icy transients and minimal warmth",
    "cinematic ambient": "Vast soundscapes with evolving textures and emotional depth",
  }

  const vibe = prompt.vibe?.toLowerCase() || ""
  for (const [key, value] of Object.entries(vibes)) {
    if (vibe.includes(key)) return value
  }

  return `${prompt.intensity || "Medium"} intensity ${prompt.space || "open"} space with ${prompt.motion || "glide"} motion`
}

function generateOptions(prompt: any): LmOption[] {
  const intensity = prompt.intensity || "medium"
  const space = prompt.space || "open"

  const densityMap = { low: 0.65, medium: 0.85, high: 0.95 }
  const dimensionsMap = { tight: 8, open: 12, vast: 16 }

  return [
    {
      name: "Subharmonic dusk",
      why: "Darker, sparse, elastic — darkness from compact harmonic clustering",
      params: {
        dimensions: dimensionsMap[space as keyof typeof dimensionsMap] || 12,
        density_target: densityMap[intensity as keyof typeof densityMap] - 0.1,
        psychoacoustic_profile: { phase: "adaptive", headroom_db: 18 },
      },
    },
    {
      name: "Velvet pressure",
      why: "Denser, slower decay — rich mid-range with controlled low-end",
      params: {
        dimensions: dimensionsMap[space as keyof typeof dimensionsMap] || 12,
        density_target: densityMap[intensity as keyof typeof densityMap],
        psychoacoustic_profile: { phase: "minimal", headroom_db: 15 },
      },
    },
    {
      name: "Nocturne glide",
      why: "Cinematic, more reverb air — expansive with emotional depth",
      params: {
        dimensions: (dimensionsMap[space as keyof typeof dimensionsMap] || 12) + 2,
        density_target: densityMap[intensity as keyof typeof densityMap] - 0.05,
        psychoacoustic_profile: { phase: "wide", headroom_db: 20 },
      },
    },
  ]
}

function generateSuggestions(prompt: any): string[] {
  return [
    "Try 'glide motion' for cinematic depth",
    "Increase space for more reverb air",
    "Add warmth with mid-harmonic boost",
    "Tighten transients for clarity",
  ]
}
