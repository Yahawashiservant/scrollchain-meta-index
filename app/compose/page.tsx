"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Music, Video, Download } from "lucide-react"
import AudioReactiveBackground from "@/components/AudioReactiveBackground"
import { LuxuryCard } from "@/components/LuxuryCard"
import { GENRE_TEMPLATES } from "@/lib/musicTheory"

export default function ComposePage() {
  const [prompt, setPrompt] = useState("")
  const [genre, setGenre] = useState("edm")
  const [composition, setComposition] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [generatingVideo, setGeneratingVideo] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/compose/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          genre,
          key: 60, // C4
          scale: GENRE_TEMPLATES[genre as keyof typeof GENRE_TEMPLATES]?.scale || "minor",
        }),
      })
      const data = await res.json()
      setComposition(data)
    } catch (error) {
      console.error("Failed to generate composition:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateVideo = async () => {
    setGeneratingVideo(true)
    // Simulate video generation
    setTimeout(() => {
      setGeneratingVideo(false)
      alert("Video generated! (This is a demo - real video generation would use AI models)")
    }, 3000)
  }

  return (
    <div className="min-h-screen relative">
      <AudioReactiveBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Music Composer
            </h1>
            <p className="text-xl text-white/70">
              Create any type of music with AI assistance and generate synchronized videos
            </p>
          </div>

          {/* Composition Input */}
          <LuxuryCard className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Describe your music</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create an uplifting EDM track with energetic drops and emotional melodies..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Genre</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.keys(GENRE_TEMPLATES).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenre(g)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        genre === g
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                      }`}
                    >
                      {g.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-6 text-lg"
              >
                {loading ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Music with AI
                  </>
                )}
              </Button>
            </div>
          </LuxuryCard>

          {/* Composition Result */}
          {composition && (
            <div className="grid md:grid-cols-2 gap-6">
              <LuxuryCard className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Music className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">Composition</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-white/60 mb-1">Melody</div>
                      <div className="flex gap-1">
                        {composition.melody?.map((note: number, i: number) => (
                          <div
                            key={i}
                            className="h-8 w-8 bg-cyan-500/20 border border-cyan-500/50 rounded flex items-center justify-center text-xs text-cyan-400"
                          >
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-white/60 mb-1">AI Suggestion</div>
                      <p className="text-white/80 text-sm leading-relaxed">{composition.suggestion}</p>
                    </div>

                    <div>
                      <div className="text-sm text-white/60 mb-1">Arrangement</div>
                      <div className="flex flex-wrap gap-2">
                        {composition.arrangement?.map((section: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs text-purple-400"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </LuxuryCard>

              <LuxuryCard className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Video className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">Video Generation</h3>
                  </div>

                  <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 rounded-lg flex items-center justify-center">
                    {generatingVideo ? (
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                        <p className="text-white/60">Generating video...</p>
                      </div>
                    ) : (
                      <p className="text-white/40">Video preview will appear here</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleGenerateVideo}
                      disabled={generatingVideo}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Generate Video
                    </Button>
                    <Button variant="outline" className="border-white/20 hover:bg-white/5 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </LuxuryCard>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
