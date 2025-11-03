"use client"
import { useEffect } from "react"
import { reloadEngineFromArtifacts } from "@/lib/reloadHelper"

export function useNatsBus(engine: any, tenantId: string) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BUS_URL) {
      console.log("[v0] NATS bus URL not configured, skipping subscription")
      return
    }

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BUS_URL}/ws?tenant=${tenantId}`)

    ws.onopen = () => console.log("[v0] NATS bus connected")
    ws.onerror = (err) => console.error("[v0] NATS bus error:", err)

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data)
        const subject = msg.subject as string

        if (subject?.includes("music.session.updated.") && msg.value) {
          console.log("[v0] Session update received")
          const mapping = Object.fromEntries(
            Object.entries(msg.value).map(([ch, v]: any) => [ch, { id: v.artifact_id, storage_uri: v.storage_uri }]),
          )
          await reloadEngineFromArtifacts(engine, mapping)
        } else if (subject?.includes("music.scene.triggered.") && msg.value) {
          console.log("[v0] Scene triggered:", msg.value.name)
          await reloadEngineFromArtifacts(engine, msg.value.mapping)
        }
        // Handle generic artifact updates
        else if (subject?.startsWith("music.") && msg.artifacts) {
          console.log("[v0] NATS event received:", subject)
          await reloadEngineFromArtifacts(engine, msg.artifacts)
        }
      } catch (error) {
        console.error("[v0] NATS message error:", error)
      }
    }

    return () => {
      ws.close()
      console.log("[v0] NATS bus disconnected")
    }
  }, [engine, tenantId])
}
