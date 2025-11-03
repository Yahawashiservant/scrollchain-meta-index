"use client"
import { useRef } from "react"
import { fetchLatestChannelArtifacts } from "@/lib/artifactsFetcher"
import { reloadEngineFromArtifacts } from "@/lib/reloadHelper"

export function useAtomicReload(engine: any) {
  const timer = useRef<any>(null)

  async function trigger() {
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const latest = await fetchLatestChannelArtifacts()
        await reloadEngineFromArtifacts(engine, latest as any, { loop: true, masterGain: 0.9 })
      } catch (error) {
        console.error("[v0] Reload failed:", error)
      }
    }, 250)
  }

  return { trigger }
}
