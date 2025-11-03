type ChannelName = "Bass" | "Pad" | "Drum" | "Lead" | "Master"
type FxName = "Reverb" | "Delay"

export class AudioEngine {
  ctx: AudioContext | null = null

  // Master bus
  masterGain!: GainNode
  masterAnalyser!: AnalyserNode

  // Mastering chain nodes
  multiband!: {
    lowFilter: BiquadFilterNode
    midFilter: BiquadFilterNode
    highFilter: BiquadFilterNode
    lowComp: DynamicsCompressorNode
    midComp: DynamicsCompressorNode
    highComp: DynamicsCompressorNode
    merger: GainNode
  }
  limiter!: DynamicsCompressorNode

  // Channels
  channels: Record<
    ChannelName,
    {
      gain: GainNode
      pan: StereoPannerNode
      analyser: AnalyserNode
      source?: AudioBufferSourceNode
      buffer?: AudioBuffer
      sends: Record<FxName, GainNode>
      eq: {
        low: BiquadFilterNode
        mid: BiquadFilterNode
        high: BiquadFilterNode
      }
      comp: DynamicsCompressorNode
      muted: boolean
    }
  > = {} as any

  // FX buses
  fx: Record<
    FxName,
    {
      in: GainNode
      node: AudioNode
      out: GainNode
      analyser: AnalyserNode
    }
  > = {} as any

  // Spectra
  fftSize = 1024
  spectrumArrays: Record<string, Uint8Array> = {} as any

  async boot() {
    if (this.ctx) return
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Multiband compression
    const lowFilter = this.ctx.createBiquadFilter()
    lowFilter.type = "lowshelf"
    lowFilter.frequency.value = 180
    const midFilter = this.ctx.createBiquadFilter()
    midFilter.type = "peaking"
    midFilter.frequency.value = 1500
    midFilter.Q.value = 0.7
    const highFilter = this.ctx.createBiquadFilter()
    highFilter.type = "highshelf"
    highFilter.frequency.value = 6000

    const lowComp = this.ctx.createDynamicsCompressor()
    lowComp.threshold.value = -24
    lowComp.ratio.value = 3
    lowComp.attack.value = 0.01
    lowComp.release.value = 0.15

    const midComp = this.ctx.createDynamicsCompressor()
    midComp.threshold.value = -20
    midComp.ratio.value = 2.5
    midComp.attack.value = 0.005
    midComp.release.value = 0.1

    const highComp = this.ctx.createDynamicsCompressor()
    highComp.threshold.value = -18
    highComp.ratio.value = 2
    highComp.attack.value = 0.003
    highComp.release.value = 0.08

    const merger = this.ctx.createGain()

    lowFilter.connect(lowComp)
    lowComp.connect(merger)
    midFilter.connect(midComp)
    midComp.connect(merger)
    highFilter.connect(highComp)
    highComp.connect(merger)

    this.multiband = { lowFilter, midFilter, highFilter, lowComp, midComp, highComp, merger }

    // Limiter
    this.limiter = this.ctx.createDynamicsCompressor()
    this.limiter.threshold.value = -1
    this.limiter.ratio.value = 20
    this.limiter.attack.value = 0.003
    this.limiter.release.value = 0.1

    // Master
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.9
    this.masterAnalyser = this.ctx.createAnalyser()
    this.masterAnalyser.fftSize = this.fftSize
    this.masterAnalyser.smoothingTimeConstant = 0.8

    merger.connect(this.limiter)
    this.limiter.connect(this.masterGain)
    this.masterGain.connect(this.masterAnalyser)
    this.masterAnalyser.connect(this.ctx.destination)
    this.spectrumArrays["Master"] = new Uint8Array(this.masterAnalyser.frequencyBinCount)

    // FX: Reverb bus
    const revIn = this.ctx.createGain()
    revIn.gain.value = 0.0
    const revConv = this.ctx.createConvolver()
    const revOut = this.ctx.createGain()
    revOut.gain.value = 0.5
    const revAnal = this.ctx.createAnalyser()
    revAnal.fftSize = this.fftSize
    revIn.connect(revConv)
    revConv.connect(revOut)
    revOut.connect(revAnal)
    revOut.connect(this.masterGain)
    this.fx["Reverb"] = { in: revIn, node: revConv, out: revOut, analyser: revAnal }
    this.spectrumArrays["FX:Reverb"] = new Uint8Array(revAnal.frequencyBinCount)

    // FX: Delay bus
    const delIn = this.ctx.createGain()
    delIn.gain.value = 0.0
    const delay = this.ctx.createDelay()
    delay.delayTime.value = 0.35
    const delFb = this.ctx.createGain()
    delFb.gain.value = 0.35
    const delOut = this.ctx.createGain()
    delOut.gain.value = 0.6
    const delAnal = this.ctx.createAnalyser()
    delAnal.fftSize = this.fftSize
    delIn.connect(delay)
    delay.connect(delFb)
    delFb.connect(delay)
    delay.connect(delOut)
    delOut.connect(delAnal)
    delOut.connect(this.masterGain)
    this.fx["Delay"] = { in: delIn, node: delay, out: delOut, analyser: delAnal }
    this.spectrumArrays["FX:Delay"] = new Uint8Array(delAnal.frequencyBinCount)

    // Channels
    ;(["Bass", "Pad", "Drum", "Lead"] as ChannelName[]).forEach((name) => {
      const gain = this.ctx!.createGain()
      const pan = this.ctx!.createStereoPanner()

      // Per-channel EQ (3-band)
      const eqLow = this.ctx!.createBiquadFilter()
      eqLow.type = "lowshelf"
      eqLow.frequency.value = 120
      eqLow.gain.value = 0

      const eqMid = this.ctx!.createBiquadFilter()
      eqMid.type = "peaking"
      eqMid.frequency.value = 1000
      eqMid.Q.value = 1
      eqMid.gain.value = 0

      const eqHigh = this.ctx!.createBiquadFilter()
      eqHigh.type = "highshelf"
      eqHigh.frequency.value = 6500
      eqHigh.gain.value = 0

      // Per-channel compression
      const comp = this.ctx!.createDynamicsCompressor()
      comp.threshold.value = -24
      comp.ratio.value = 4
      comp.attack.value = 0.01
      comp.release.value = 0.12

      const analyser = this.ctx!.createAnalyser()
      analyser.fftSize = this.fftSize
      analyser.smoothingTimeConstant = 0.7

      gain.connect(eqLow)
      eqLow.connect(eqMid)
      eqMid.connect(eqHigh)
      eqHigh.connect(comp)
      comp.connect(pan)
      pan.connect(analyser)
      analyser.connect(this.multiband.lowFilter)
      analyser.connect(this.multiband.midFilter)
      analyser.connect(this.multiband.highFilter)

      const sends: Record<FxName, GainNode> = {
        Reverb: this.ctx!.createGain(),
        Delay: this.ctx!.createGain(),
      }
      sends.Reverb.gain.value = 0.0
      sends.Delay.gain.value = 0.0

      const splitter = this.ctx!.createGain()
      gain.connect(splitter)
      splitter.connect(sends.Reverb)
      splitter.connect(sends.Delay)
      sends.Reverb.connect(this.fx.Reverb.in)
      sends.Delay.connect(this.fx.Delay.in)

      this.channels[name] = {
        gain,
        pan,
        analyser,
        sends,
        eq: { low: eqLow, mid: eqMid, high: eqHigh },
        comp,
        muted: false,
      }
      this.spectrumArrays[name] = new Uint8Array(analyser.frequencyBinCount)
    })
  }

  async loadChannelBuffer(name: ChannelName, url: string) {
    if (!this.ctx) await this.boot()
    const data = await (await fetch(url)).arrayBuffer()
    const buffer = await this.ctx!.decodeAudioData(data)
    this.channels[name].buffer = buffer
  }

  playChannel(name: ChannelName, loop = true) {
    if (!this.ctx) return
    const ch = this.channels[name]
    if (!ch.buffer) return
    if (ch.source)
      try {
        ch.source.stop()
      } catch {}
    ch.source = this.ctx!.createBufferSource()
    ch.source.buffer = ch.buffer!
    ch.source.loop = loop
    ch.source.connect(ch.gain)
    ch.source.start(0)
  }

  stopChannel(name: ChannelName) {
    try {
      this.channels[name].source?.stop()
    } catch {}
    this.channels[name].source = undefined
  }

  setChannelGain(name: ChannelName, v: number) {
    this.channels[name].gain.gain.value = v
  }

  setChannelPan(name: ChannelName, v: number) {
    this.channels[name].pan.pan.value = v
  }

  setMasterGain(v: number) {
    this.masterGain.gain.value = v
  }

  setSend(name: ChannelName, fx: FxName, v: number) {
    this.channels[name].sends[fx].gain.value = v
  }

  setFxOut(fx: FxName, v: number) {
    this.fx[fx].out.gain.value = v
  }

  sampleSpectra() {
    Object.entries(this.channels).forEach(([name, ch]) => ch.analyser.getByteFrequencyData(this.spectrumArrays[name]))
    this.masterAnalyser.getByteFrequencyData(this.spectrumArrays["Master"])
    this.fx.Reverb.analyser.getByteFrequencyData(this.spectrumArrays["FX:Reverb"])
    this.fx.Delay.analyser.getByteFrequencyData(this.spectrumArrays["FX:Delay"])
  }

  getSpectrum(key: string) {
    return this.spectrumArrays[key]
  }

  async play(audioUrl?: string, onEnded?: () => void) {
    if (!this.ctx) await this.boot()

    // Play all channels that have buffers loaded
    const channelNames: ChannelName[] = ["Bass", "Pad", "Drum", "Lead"]
    channelNames.forEach((name) => {
      if (this.channels[name].buffer) {
        this.playChannel(name, true)
      }
    })

    // If a specific audio URL is provided, load and play it on the Master
    if (audioUrl) {
      try {
        const data = await (await fetch(audioUrl)).arrayBuffer()
        const buffer = await this.ctx!.decodeAudioData(data)
        const source = this.ctx!.createBufferSource()
        source.buffer = buffer
        source.connect(this.masterGain)
        if (onEnded) source.onended = onEnded
        source.start(0)
      } catch (error) {
        console.error("[v0] Failed to load audio:", error)
      }
    }
  }

  stop() {
    const channelNames: ChannelName[] = ["Bass", "Pad", "Drum", "Lead"]
    channelNames.forEach((name) => this.stopChannel(name))
  }

  // EQ control methods
  setEQ(name: ChannelName, band: "low" | "mid" | "high", gainDb: number, freq?: number) {
    const filter = this.channels[name].eq[band]
    filter.gain.value = gainDb
    if (freq) filter.frequency.value = freq
  }

  // Compression control methods
  setComp(name: ChannelName, params: { threshold?: number; ratio?: number; attack?: number; release?: number }) {
    const comp = this.channels[name].comp
    if (params.threshold !== undefined) comp.threshold.value = params.threshold
    if (params.ratio !== undefined) comp.ratio.value = params.ratio
    if (params.attack !== undefined) comp.attack.value = params.attack
    if (params.release !== undefined) comp.release.value = params.release
  }

  // Multiband control
  setMultiband(params: {
    lowFreq?: number
    midFreq?: number
    lowRatio?: number
    midRatio?: number
    highRatio?: number
  }) {
    if (params.lowFreq) this.multiband.lowFilter.frequency.value = params.lowFreq
    if (params.midFreq) this.multiband.midFilter.frequency.value = params.midFreq
    if (params.lowRatio) this.multiband.lowComp.ratio.value = params.lowRatio
    if (params.midRatio) this.multiband.midComp.ratio.value = params.midRatio
    if (params.highRatio) this.multiband.highComp.ratio.value = params.highRatio
  }

  // Limiter control
  setLimiter(params: { threshold?: number; attack?: number; release?: number; ratio?: number }) {
    if (params.threshold !== undefined) this.limiter.threshold.value = params.threshold
    if (params.attack !== undefined) this.limiter.attack.value = params.attack
    if (params.release !== undefined) this.limiter.release.value = params.release
    if (params.ratio !== undefined) this.limiter.ratio.value = params.ratio
  }

  // Mute/unmute
  muteChannel(name: ChannelName) {
    this.channels[name].muted = true
    this.channels[name].gain.gain.value = 0
  }

  unmuteChannel(name: ChannelName) {
    this.channels[name].muted = false
    this.channels[name].gain.gain.value = 0.75
  }
}

// Helper to load artifacts from storage and play
export async function reloadArtifacts(
  engine: AudioEngine,
  artifactsByChannel: Record<string, { storage_uri: string }>,
) {
  await engine.boot()
  const storageBase = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL || ""

  for (const [name, art] of Object.entries(artifactsByChannel)) {
    if (!["Bass", "Pad", "Drum", "Lead"].includes(name)) continue
    const url = `${storageBase}/${art.storage_uri}`
    try {
      await engine.loadChannelBuffer(name as ChannelName, url)
      console.log(`[v0] Loaded ${name} from ${url}`)
    } catch (error) {
      console.error(`[v0] Failed to load ${name}:`, error)
    }
  }
  // Play all loaded channels
  ;(["Bass", "Pad", "Drum", "Lead"] as ChannelName[]).forEach((name) => {
    if (engine.channels[name].buffer) {
      engine.playChannel(name, true)
    }
  })

  engine.setMasterGain(0.9)
  console.log("[v0] Artifacts reloaded and playing")
}
