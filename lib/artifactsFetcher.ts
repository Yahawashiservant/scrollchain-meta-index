export async function fetchLatestChannelArtifacts(): Promise<Record<string, any>> {
  try {
    const res = await fetch("/api/audit")
    if (!res.ok) return {}
    const audit = await res.json()
    const artifacts: any[] = audit.artifacts ?? []

    // Pick newest artifact per channel by name prefix
    const pick = (prefix: string) =>
      artifacts
        .filter((a) => (a.name ?? "").toLowerCase().startsWith(prefix.toLowerCase()) && a.storage_uri)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

    return {
      Bass: pick("bass"),
      Pad: pick("pad"),
      Drum: pick("drum"),
      Lead: pick("lead"),
    }
  } catch (error) {
    console.error("[v0] Failed to fetch artifacts:", error)
    return {}
  }
}
