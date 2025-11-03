"use client"
import { useState } from "react"
import { EntropyBloom } from "@/components/entropy-bloom"

interface SessionPin {
  id: string
  name: string
  timestamp: string
  params: {
    dimensions: number
    density_target: number
    phase_mode: string
    headroom_db: number
  }
  notes: string
}

export default function SessionsPage() {
  const [pins, setPins] = useState<SessionPin[]>([
    {
      id: "1",
      name: "Midnight exploration",
      timestamp: new Date().toISOString(),
      params: { dimensions: 12, density_target: 0.85, phase_mode: "adaptive", headroom_db: 18 },
      notes: "Deep subharmonic character with clean low-end",
    },
    {
      id: "2",
      name: "Bright morning",
      timestamp: new Date().toISOString(),
      params: { dimensions: 16, density_target: 0.75, phase_mode: "wide", headroom_db: 20 },
      notes: "Open space with crystalline highs",
    },
  ])

  const [compareMode, setCompareMode] = useState(false)
  const [selectedPins, setSelectedPins] = useState<string[]>([])

  function togglePinSelection(id: string) {
    if (selectedPins.includes(id)) {
      setSelectedPins(selectedPins.filter((p) => p !== id))
    } else if (selectedPins.length < 2) {
      setSelectedPins([...selectedPins, id])
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Sessions</h1>
            <p className="text-sm opacity-70">Save and compare interesting states</p>
          </div>
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              compareMode ? "bg-blue-500/20 border border-blue-500/30 text-blue-400" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {compareMode ? "Exit compare" : "Compare mode"}
          </button>
        </div>

        {compareMode && selectedPins.length === 2 && (
          <div className="grid md:grid-cols-2 gap-4">
            {selectedPins.map((pinId) => {
              const pin = pins.find((p) => p.id === pinId)
              if (!pin) return null
              return (
                <div key={pin.id} className="space-y-3">
                  <div className="text-sm font-medium">{pin.name}</div>
                  <EntropyBloom
                    dimensions={pin.params.dimensions}
                    density={pin.params.density_target}
                    phase={pin.params.phase_mode}
                  />
                </div>
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pins.map((pin) => (
            <div
              key={pin.id}
              onClick={() => compareMode && togglePinSelection(pin.id)}
              className={`rounded-xl backdrop-blur border p-5 transition-colors ${
                compareMode
                  ? selectedPins.includes(pin.id)
                    ? "bg-blue-500/10 border-blue-500/30 cursor-pointer"
                    : "bg-white/5 border-white/10 cursor-pointer hover:bg-white/10"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="space-y-3">
                <div>
                  <div className="text-lg font-semibold mb-1">{pin.name}</div>
                  <div className="text-xs opacity-70">{new Date(pin.timestamp).toLocaleString()}</div>
                </div>

                <div className="text-sm opacity-70 text-pretty">{pin.notes}</div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="opacity-70">Dimensions:</span> {pin.params.dimensions}
                  </div>
                  <div>
                    <span className="opacity-70">Density:</span> {(pin.params.density_target * 100).toFixed(0)}%
                  </div>
                  <div>
                    <span className="opacity-70">Phase:</span> {pin.params.phase_mode}
                  </div>
                  <div>
                    <span className="opacity-70">Headroom:</span> {pin.params.headroom_db} dB
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pins.length === 0 && (
          <div className="text-center py-12 opacity-70">No session pins yet. Create one in the Studio.</div>
        )}
      </div>
    </main>
  )
}
