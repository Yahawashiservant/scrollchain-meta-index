"use client"

import { useState } from "react"
import Sequencer from "@/components/Sequencer"
import Mixer from "@/components/Mixer"
import EntropyPanel from "@/components/EntropyPanel"
import LmSidebar from "@/components/LmSidebar"
import TransportBar from "@/components/TransportBar"
import ShaderVisualizer from "@/components/ShaderVisualizer"
import KernelViewer from "@/components/KernelViewer"
import AudioReactiveBackground from "@/components/AudioReactiveBackground"

export default function StudioPage() {
  const [context] = useState({
    tenantId: "default-tenant",
    createdBy: "user@example.com",
    currentArtifact: { id: "mock-artifact-id" },
  })

  const demoAudio = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artifacts/demo/render.wav`
    : undefined

  return (
    <div className="h-screen flex flex-col bg-[#0B0E13] text-white relative">
      <AudioReactiveBackground />

      <div className="relative z-10 h-full flex flex-col">
        <TransportBar audioUrl={demoAudio} />

        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r border-white/10 flex flex-col bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-2xl overflow-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <LmSidebar
              tenantId={context.tenantId}
              createdBy={context.createdBy}
              currentArtifact={context.currentArtifact}
            />
            <div className="p-4">
              <KernelViewer tenantId={context.tenantId} />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_60px_rgba(6,182,212,0.2),0_0_40px_rgba(6,182,212,0.1)]">
              <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Entropy Visualizer</div>
              <ShaderVisualizer />
            </div>

            <div className="flex-1 flex flex-col gap-6 overflow-auto">
              <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4 shadow-[0_20px_60px_rgba(168,85,247,0.15)]">
                <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Sequencer</div>
                <Sequencer
                  tenantId={context.tenantId}
                  createdBy={context.createdBy}
                  currentArtifact={context.currentArtifact}
                />
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4 shadow-[0_20px_60px_rgba(59,130,246,0.15)]">
                <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Mixer</div>
                <Mixer
                  tenantId={context.tenantId}
                  createdBy={context.createdBy}
                  currentArtifact={context.currentArtifact}
                />
              </div>
            </div>
          </div>

          <div className="w-80 border-l border-white/10 flex flex-col bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <EntropyPanel
              tenantId={context.tenantId}
              currentArtifact={context.currentArtifact}
              createdBy={context.createdBy}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
