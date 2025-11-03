export function emitSessionMapOps(map: Record<string, { artifact_id: string }>) {
  return [{ op: "set_session_map", value: map }]
}

export function emitScenePlaylistOps(scenes: any[]) {
  return [
    {
      op: "set_scene_playlist",
      value: scenes.map((s) => ({
        id: s.id,
        name: s.name,
        mapping: Object.fromEntries(Object.entries(s.mapping).map(([ch, art]: any) => [ch, { artifact_id: art.id }])),
        duration: s.duration,
        crossfade: s.crossfade,
      })),
    },
  ]
}
