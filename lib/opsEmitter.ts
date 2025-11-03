export function emitMixOps({
  gain,
  pan,
  mutes,
}: {
  gain: Record<string, number>
  pan: Record<string, number>
  mutes: Record<string, boolean>
}) {
  return [
    ...Object.entries(gain).map(([channel, v]) => ({ op: "set_gain", channel, value: v })),
    ...Object.entries(pan).map(([channel, v]) => ({ op: "set_pan", channel, value: v })),
    ...Object.entries(mutes).map(([channel, is]) => ({ op: is ? "mute" : "unmute", channel })),
  ]
}

export function emitFxOps({ sends }: { sends: Record<string, { Reverb: number; Delay: number }> }) {
  const ops: any[] = []
  Object.entries(sends).forEach(([channel, fx]) => {
    ops.push({ op: "set_send", channel, fx: "Reverb", value: fx.Reverb })
    ops.push({ op: "set_send", channel, fx: "Delay", value: fx.Delay })
  })
  return ops
}

export function emitInsertOps({
  eq,
  comp,
  pre,
}: {
  eq: Record<string, { low: any; mid: any; high: any }>
  comp: Record<string, any>
  pre: Record<string, boolean>
}) {
  const ops: any[] = []
  Object.entries(eq).forEach(([channel, bands]) => {
    ops.push({ op: "set_eq", channel, band: "low", gain_db: bands.low.gain, freq: bands.low.freq })
    ops.push({
      op: "set_eq",
      channel,
      band: "mid",
      gain_db: bands.mid.gain,
      freq: bands.mid.freq,
      q: bands.mid.q,
    })
    ops.push({ op: "set_eq", channel, band: "high", gain_db: bands.high.gain, freq: bands.high.freq })
  })
  Object.entries(comp).forEach(([channel, params]) => ops.push({ op: "set_comp", channel, params }))
  Object.entries(pre).forEach(([channel, isPre]) => ops.push({ op: "set_insert_position", channel, pre: isPre }))
  return ops
}

export function emitMasterOps({ multiband, limiter }: { multiband: any; limiter: any }) {
  return [
    { op: "set_multiband", params: multiband },
    { op: "set_limiter", params: limiter },
  ]
}
