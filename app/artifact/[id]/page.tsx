"use client"
import { useParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import { useState } from "react"
import { AssistChips } from "@/components/assist-chips"
import { EntropyBloom } from "@/components/entropy-bloom"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ArtifactDetail() {
  const params = useParams()
  const id = params?.id as string
  const { data } = useSWR("/api/audit", fetcher)
  const a = (data?.artifacts ?? []).find((x: any) => x.id === id)
  const [showTechnical, setShowTechnical] = useState(false)

  if (!data) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center py-12 opacity-70">Loading...</div>
      </main>
    )
  }

  if (!a) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-xl p-6 bg-red-500/10 border border-red-500/20 text-red-400">Artifact not found</div>
          <Link
            href="/catalog"
            className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Back to Catalog
          </Link>
        </div>
      </main>
    )
  }

  const audioUrl = a.storage_uri ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${a.storage_uri}` : null

  async function handleAssistChip(action: string) {
    const res = await fetch("/api/preset/mutate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artifact_id: id,
        change_request: action,
      }),
    })

    if (res.ok) {
      alert(`Applied: ${action}`)
      window.location.reload()
    } else {
      alert("Failed to apply refinement")
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/catalog" className="inline-block text-sm opacity-70 hover:opacity-100 transition-opacity">
          ← Back to Catalog
        </Link>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider opacity-70">{a.kind}</div>
          <h1 className="text-3xl font-bold">{a.name ?? a.id}</h1>
          {a.description && <p className="opacity-70">{a.description}</p>}
          <div className="text-sm opacity-50">Status: {a.status}</div>
        </div>

        {audioUrl && (
          <div className="rounded-xl backdrop-blur bg-white/5 border border-white/10 p-6">
            <div className="text-sm font-medium mb-3">Audio Preview</div>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium opacity-90">Lattice visualization</div>
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              {showTechnical ? "Hide technical" : "Show technical"}
            </button>
          </div>
          <EntropyBloom
            dimensions={a.lattice_manifest?.dimensions || 12}
            density={a.lattice_manifest?.density_target || 0.85}
            phase={a.lattice_manifest?.psychoacoustic_profile?.phase || "adaptive"}
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium opacity-90">Quick refinements</div>
          <AssistChips onSelect={handleAssistChip} />
        </div>

        {showTechnical && (
          <div className="rounded-xl backdrop-blur bg-white/5 border border-white/10 p-6">
            <div className="text-sm font-medium mb-3">Lattice Manifest</div>
            <pre className="rounded-lg bg-black/40 p-4 text-xs overflow-x-auto">
              {JSON.stringify(a.lattice_manifest ?? {}, null, 2)}
            </pre>
          </div>
        )}

        <Actions id={id} />
      </div>
    </main>
  )
}

function Actions({ id }: { id: string }) {
  async function buildPlugin() {
    const res = await fetch("/api/plugin/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artifact_id: id,
        targets: ["vst3", "au", "lv2"],
        os_targets: ["macos", "win", "linux"],
      }),
    })
    if (!res.ok) {
      alert("Plugin build failed")
      return
    }
    location.reload()
  }

  async function mutatePreset() {
    const res = await fetch("/api/preset/mutate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artifact_id: id,
        mutation_ops: [{ op: "density+0.1" }],
      }),
    })
    if (!res.ok) {
      alert("Preset mutate failed")
      return
    }
    location.reload()
  }

  return (
    <div className="rounded-xl backdrop-blur bg-white/5 border border-white/10 p-6">
      <div className="text-sm font-medium mb-4">Actions</div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={buildPlugin}
          className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
        >
          Build plugin
        </button>
        <button
          onClick={mutatePreset}
          className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
        >
          Mutate preset
        </button>
      </div>
    </div>
  )
}
