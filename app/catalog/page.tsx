"use client"
import useSWR from "swr"
import Link from "next/link"
import { LuxuryCard, IconBox } from "@/components/LuxuryCard"
import AudioReactiveBackground from "@/components/AudioReactiveBackground"
import { Music, AudioWaveform as Waveform, Sparkles } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CatalogPage() {
  const { data, error } = useSWR("/api/audit", fetcher)
  const artifacts = data?.artifacts ?? []

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B0E13] via-[#0F1419] to-[#0B0E13] relative">
      <AudioReactiveBackground />

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(6,182,212,0.5)]">
              Catalog
            </h1>
            <p className="text-xl text-gray-300 font-light">
              {artifacts.length} {artifacts.length === 1 ? "artifact" : "artifacts"} in your library
            </p>
          </div>

          {error && (
            <div className="rounded-2xl p-6 bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 text-red-300 backdrop-blur-xl shadow-[0_8px_32px_rgba(239,68,68,0.2)]">
              <p className="font-semibold">Failed to load artifacts</p>
              <p className="text-sm mt-1 opacity-80">Please try refreshing the page</p>
            </div>
          )}

          {!data && !error && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500" />
              <p className="mt-4 text-gray-400">Loading artifacts...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artifacts.map((a: any, index: number) => (
              <Link key={a.id} href={`/artifact/${a.id}`}>
                <LuxuryCard delay={index * 100}>
                  <div className="p-6 space-y-4">
                    {/* Icon based on artifact kind */}
                    <div>
                      {a.kind === "plugin" && <IconBox icon={Sparkles} gradient="from-purple-500 to-pink-500" />}
                      {a.kind === "preset" && <IconBox icon={Waveform} gradient="from-cyan-500 to-blue-500" />}
                      {!a.kind && <IconBox icon={Music} gradient="from-blue-500 to-purple-500" />}
                    </div>

                    {/* Artifact info */}
                    <div className="space-y-2">
                      <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                        {a.kind || "Audio"}
                      </div>
                      <h3 className="text-xl font-bold text-white truncate">{a.name ?? a.id}</h3>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            a.status === "ready" ? "bg-green-400" : "bg-yellow-400"
                          } shadow-[0_0_8px_currentColor] animate-pulse`}
                        />
                        <span className="text-sm text-gray-400 capitalize">{a.status || "unknown"}</span>
                      </div>
                    </div>

                    {/* Waveform visualization */}
                    <div className="h-16 rounded-lg bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 flex items-end gap-1 p-2">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-cyan-400 to-blue-400 rounded-sm opacity-50"
                          style={{
                            height: `${Math.random() * 100}%`,
                            animation: `pulse ${1 + Math.random()}s ease-in-out infinite`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </LuxuryCard>
              </Link>
            ))}
          </div>

          {artifacts.length === 0 && data && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                <Music className="w-10 h-10 text-cyan-400" />
              </div>
              <p className="text-xl text-gray-300 mb-2">No artifacts yet</p>
              <p className="text-gray-500">Create your first artifact in the Studio</p>
              <Link
                href="/studio"
                className="inline-block mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:shadow-[0_0_60px_rgba(6,182,212,0.8)] transition-all duration-300 hover:scale-105"
              >
                Go to Studio
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
