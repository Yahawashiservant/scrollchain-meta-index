"use client"
import { postJSON, requestId } from "@/lib/client"

export default function Actions({ id, tenantId, createdBy, lineageRef }: any) {
  async function buildPlugin() {
    try {
      const rid = requestId()
      await postJSON("/api/plugin/build", {
        tenant_id: tenantId,
        artifact_id: id,
        targets: ["vst3", "au", "lv2"],
        os_targets: ["macos", "win", "linux"],
        request_id: rid,
      })
      alert("Plugin build started! Check receipts for status.")
      window.location.reload()
    } catch (error) {
      console.error("[v0] Plugin build error:", error)
      alert("Failed to build plugin")
    }
  }

  async function revertToParent() {
    if (!lineageRef) return
    window.location.href = `/artifact/${lineageRef}`
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={buildPlugin}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
      >
        Build Plugin
      </button>
      <button
        onClick={revertToParent}
        disabled={!lineageRef}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors text-sm"
      >
        {lineageRef ? "Revert to Parent" : "No Parent"}
      </button>
    </div>
  )
}
