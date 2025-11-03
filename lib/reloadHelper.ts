type Channel = "Bass" | "Pad" | "Drum" | "Lead"
type Artifact = { id: string; storage_uri: string }
type ChannelArtifacts = Partial<Record<Channel, Artifact>>

function storageUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  return `${base}/storage/v1/object/public/${path}`
}

export async function reloadEngineFromArtifacts(
  engine: any,
  mapping: ChannelArtifacts,
  opts?: { loop?: boolean; masterGain?: number },
) {
  const loop = opts?.loop ?? true
  const master = opts?.masterGain ?? 0.9

  await engine.boot()

  // Parallel fetch+decode for speed
  const tasks: Promise<void>[] = []
  for (const [channel, art] of Object.entries(mapping)) {
    if (!art || !art.storage_uri) continue
    const url = storageUrl(art.storage_uri)
    tasks.push(
      (async () => {
        await engine.loadChannelBuffer(channel as Channel, url)
      })(),
    )
  }
  await Promise.all(tasks)

  // Stop and restart channels quickly
  for (const channel of Object.keys(mapping) as Channel[]) {
    engine.stopChannel(channel)
    engine.playChannel(channel, loop)
  }

  engine.setMasterGain(master)
  console.log("[v0] Engine reloaded from artifacts")
}
