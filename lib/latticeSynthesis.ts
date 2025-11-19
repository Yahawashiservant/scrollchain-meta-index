import type { AudioContext } from "standardized-audio-context"

export interface EntropyParams {
  density: number
  coherence: number
  phase: number
  space: number
}

export class LatticeSynthesisEngine {
  ctx: AudioContext
  samples: Record<string, AudioBuffer> = {}

  constructor(ctx: AudioContext) {
    this.ctx = ctx
  }

  // Now accepts the full configuration object from the server
  async generateFromConfig(config: any) {
    // DRUMS
    this.samples["kick_deep"] = await this.generateKick(config.kick_deep)
    this.samples["kick_punch"] = await this.generateKick(config.kick_punch)
    this.samples["kick_808"] = await this.generate808Kick(config.kick_808)
    this.samples["kick_acoustic"] = await this.generateKick(config.kick_acoustic || { baseFreq: 55, duration: 0.7, pitchRange: 100, harmonicStrength: 0, decayRate: 8, clickAmount: 0.3 })

    this.samples["snare_tight"] = await this.generateSnare(config.snare_tight)
    this.samples["snare_fat"] = await this.generateSnare(config.snare_fat)
    this.samples["snare_clap"] = await this.generateSnare(config.snare_clap)
    this.samples["rim"] = await this.generateRim(config.rim)

    this.samples["hihat_closed"] = await this.generateHiHat(config.hihat_closed)
    this.samples["hihat_open"] = await this.generateHiHat(config.hihat_open)
    this.samples["hihat_pedal"] = await this.generateHiHat(config.hihat_pedal)
    this.samples["hihat_sizzle"] = await this.generateHiHat(config.hihat_sizzle)

    this.samples["clap"] = await this.generateClap(config.clap)
    this.samples["snap"] = await this.generateSnap(config.snap)
    this.samples["shaker"] = await this.generateShaker(config.shaker)
    this.samples["tambourine"] = await this.generateTambourine(config.tambourine)

    // TOMS
    this.samples["tom_low"] = await this.generateTom(config.tom_low)
    this.samples["tom_mid"] = await this.generateTom(config.tom_mid)
    this.samples["tom_high"] = await this.generateTom(config.tom_high)
    this.samples["tom_floor"] = await this.generateTom(config.tom_floor)

    // CYMBALS
    this.samples["crash"] = await this.generateCrash(config.crash)
    this.samples["ride"] = await this.generateRide(config.ride)
    this.samples["splash"] = await this.generateCrash(config.splash)
    this.samples["china"] = await this.generateCrash(config.china)

    // BASS
    this.samples["bass_sub"] = await this.generateSubBass(config.bass_sub)
    this.samples["bass_808"] = await this.generate808Bass(config.bass_808)
    this.samples["bass_synth"] = await this.generateSynthBass(config.bass_synth)
    this.samples["bass_reese"] = await this.generateReeseBass(config.bass_reese)
    this.samples["bass_wobble"] = await this.generateWobbleBass(config.bass_wobble)
    this.samples["bass_fm"] = await this.generateFMBass(config.bass_fm)
    this.samples["bass_pluck"] = await this.generatePluckBass(config.bass_pluck)
    this.samples["bass_acid"] = await this.generateAcidBass(config.bass_acid)

    // PADS
    this.samples["pad_warm"] = await this.generatePad(config.pad_warm)
    this.samples["pad_bright"] = await this.generatePad(config.pad_bright)
    this.samples["pad_dark"] = await this.generatePad(config.pad_dark)
    this.samples["pad_strings"] = await this.generatePad(config.pad_strings)
    this.samples["pad_choir"] = await this.generatePad(config.pad_choir)
    this.samples["pad_ambient"] = await this.generatePad(config.pad_ambient)

    // LEADS
    this.samples["lead_saw"] = await this.generateLead(config.lead_saw)
    this.samples["lead_square"] = await this.generateLead(config.lead_square)
    this.samples["lead_pluck"] = await this.generateLead(config.lead_pluck)
    this.samples["lead_fm"] = await this.generateLead(config.lead_fm)
    this.samples["lead_sync"] = await this.generateLead(config.lead_sync)
    this.samples["lead_arp"] = await this.generateLead(config.lead_arp)

    // KEYS
    this.samples["keys_piano"] = await this.generateKeys(config.keys_piano)
    this.samples["keys_electric"] = await this.generateKeys(config.keys_electric)
    this.samples["keys_organ"] = await this.generateKeys(config.keys_organ)
    this.samples["keys_bell"] = await this.generateKeys(config.keys_bell)

    // FX
    this.samples["fx_riser"] = await this.generateRiser(config.fx_riser)
    this.samples["fx_impact"] = await this.generateImpact(config.fx_impact)
    this.samples["fx_sweep"] = await this.generateSweep(config.fx_sweep)
    this.samples["fx_noise"] = await this.generateNoise(config.fx_noise)
    this.samples["fx_glitch"] = await this.generateGlitch(config.fx_glitch)
    this.samples["fx_reverse"] = await this.generateReverse(config.fx_reverse)

    // JAZZ & SOUL
    this.samples["jazz_upright"] = await this.generateUprightBass(config.jazz_upright)
    this.samples["jazz_rhodes"] = await this.generateRhodes(config.jazz_rhodes)
    this.samples["jazz_trumpet"] = await this.generateTrumpet(config.jazz_trumpet)
    this.samples["jazz_sax"] = await this.generateSaxophone(config.jazz_sax)
    this.samples["soul_organ"] = await this.generateJazzOrgan(config.soul_organ)
    this.samples["hiphop_kick"] = await this.generateMPCKick(config.hiphop_kick)
    this.samples["hiphop_snare"] = await this.generateMPCSnare(config.hiphop_snare)

    console.log(`[v0] Generated ${Object.keys(this.samples).length} instruments from server config`)
  }

  // DRUM SYNTHESIS
  private async generateKick(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const pitchEnv = params.baseFreq + params.pitchRange * Math.exp(-t * 50)
      const phase = 2 * Math.PI * pitchEnv * t
      let osc = Math.sin(phase)

      if (params.harmonicStrength > 0) {
        osc += Math.sin(phase * 2) * params.harmonicStrength
      }

      const env = Math.exp(-t * params.decayRate) * (1 + 0.5 * Math.exp(-t * 100))
      const click = Math.exp(-t * 200) * params.clickAmount
      data[i] = (osc * env + click) * 0.9
    }
    return buffer
  }

  private async generate808Kick(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const pitchEnv = 50 + params.pitchEnvAmount * Math.exp(-t * params.pitchDecay)
      const phase = 2 * Math.PI * pitchEnv * t
      let osc = Math.sin(phase)

      if (params.harmonicStrength > 0) {
        osc += Math.sin(phase * 1.5) * params.harmonicStrength
      }

      const env = Math.exp(-t * params.decayRate)
      data[i] = osc * env * 0.85
    }
    return buffer
  }

  private async generateSnare(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let body = Math.sin(2 * Math.PI * params.bodyFreq * t) * 0.4
      if (params.harmonicStrength > 0) {
        body += Math.sin(2 * Math.PI * params.bodyFreq * 1.5 * t) * params.harmonicStrength
      }

      const noise = (Math.random() * 2 - 1) * params.noiseAmount
      const env = Math.exp(-t * params.decayRate)
      data[i] = (body + noise) * env * 0.8
    }
    return buffer
  }

  private async generateRim(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const tone = Math.sin(2 * Math.PI * params.freq * t) * 0.5
      const noise = (Math.random() * 2 - 1) * params.noiseAmount
      const env = Math.exp(-t * params.decayRate)
      data[i] = (tone + noise) * env * 0.7
    }
    return buffer
  }

  private async generateHiHat(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let noise = Math.random() * 2 - 1
      if (Math.random() > params.brightness) noise *= 0.5
      const env = Math.exp(-t * params.decayRate)
      data[i] = noise * env * 0.4
    }
    return buffer
  }

  private async generateClap(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = Math.random() * 2 - 1
      const hit1 = Math.exp(-t * 100)
      const hit2 = Math.exp(-(t - params.spread) * 80) * (t > params.spread ? 1 : 0)
      const hit3 = Math.exp(-(t - params.spread * 2) * 60) * (t > params.spread * 2 ? 1 : 0)
      const env = hit1 + hit2 * 0.7 + hit3 * 0.5
      data[i] = noise * env * 0.6
    }
    return buffer
  }

  private async generateSnap(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const click = Math.sin(2 * Math.PI * params.freq * t) * 0.6
      const noise = (Math.random() * 2 - 1) * 0.4
      const env = Math.exp(-t * params.decayRate)
      data[i] = (click + noise) * env * 0.7
    }
    return buffer
  }

  private async generateShaker(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1) * params.noiseAmount
      const env = Math.exp(-t * params.decayRate)
      data[i] = noise * env * 0.5
    }
    return buffer
  }

  private async generateTambourine(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const jingle1 = Math.sin(2 * Math.PI * params.jingleFreq1 * t) * 0.3
      const jingle2 = Math.sin(2 * Math.PI * params.jingleFreq2 * t) * 0.25
      const jingle3 = Math.sin(2 * Math.PI * 4200 * t) * 0.2
      const noise = (Math.random() * 2 - 1) * 0.3
      const env = Math.exp(-t * params.decayRate)
      data[i] = (jingle1 + jingle2 + jingle3 + noise) * env * 0.6
    }
    return buffer
  }

  private async generateTom(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const pitchEnv = params.freq * (1 + 0.5 * Math.exp(-t * 15))
      let osc = Math.sin(2 * Math.PI * pitchEnv * t)

      if (params.harmonicStrength > 0) {
        osc += Math.sin(2 * Math.PI * pitchEnv * 1.5 * t) * params.harmonicStrength
      }

      const env = Math.exp(-t * params.decayRate)
      data[i] = osc * env * 0.75
    }
    return buffer
  }

  private async generateCrash(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1) * 0.7
      const ring1 = Math.sin(2 * Math.PI * params.ringFreq1 * t) * 0.15
      const ring2 = Math.sin(2 * Math.PI * params.ringFreq2 * t) * 0.1
      const env = Math.exp(-t * params.decayRate)
      data[i] = (noise + ring1 + ring2) * env * 0.65
    }
    return buffer
  }

  private async generateRide(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * params.duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1) * 0.4
      const bell = Math.sin(2 * Math.PI * params.bellFreq * t) * 0.5
      const env = Math.exp(-t * params.decayRate)
      data[i] = (noise + bell) * env * 0.6
    }
    return buffer
  }

  // BASS SYNTHESIS
  private async generateSubBass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = Math.sin(2 * Math.PI * params.freq * t)

      if (params.harmonicStrength > 0) {
        osc += Math.sin(2 * Math.PI * params.freq * 2 * t) * params.harmonicStrength
      }

      const attack = Math.min(t / 0.01, 1)
      const decay = t < 0.1 ? 1 : Math.exp(-(t - 0.1) * 3)
      const env = attack * decay
      data[i] = osc * env * 0.8
    }
    return buffer
  }

  private async generate808Bass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.8, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const osc1 = Math.sin(2 * Math.PI * params.freq * t)
      const osc2 = Math.sin(2 * Math.PI * params.freq * 2 * t) * params.harmonicStrength
      const osc3 = Math.sin(2 * Math.PI * params.freq * 3 * t) * (params.harmonicStrength * 0.5)
      const env = Math.exp(-t * 5)
      data[i] = (osc1 + osc2 + osc3) * env * 0.75
    }
    return buffer
  }

  private async generateSynthBass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.6, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0
      for (let h = 1; h <= params.harmonics; h++) {
        osc += Math.sin(2 * Math.PI * params.freq * h * t) / h
      }
      const filterEnv = Math.exp(-t * 10)
      const env = Math.exp(-t * 6)
      data[i] = osc * filterEnv * env * 0.3
    }
    return buffer
  }

  private async generateReeseBass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc1 = 0
      let osc2 = 0
      for (let h = 1; h <= 6; h++) {
        osc1 += Math.sin(2 * Math.PI * params.freq * h * t) / h
        osc2 += Math.sin(2 * Math.PI * (params.freq + params.detune) * h * t) / h
      }
      const env = Math.exp(-t * 2)
      data[i] = (osc1 + osc2) * env * 0.25
    }
    return buffer
  }

  private async generateWobbleBass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const lfo = Math.sin(2 * Math.PI * params.lfoRate * t) * 0.5 + 0.5
      let osc = 0
      for (let h = 1; h <= 8; h++) {
        osc += Math.sin(2 * Math.PI * params.freq * h * t) / h
      }
      const filterMod = lfo * params.filterMod
      const env = Math.exp(-t * 3)
      data[i] = osc * filterMod * env * 0.4
    }
    return buffer
  }

  private async generateFMBass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.7, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const modFreq = params.freq * 2
      const modulator = Math.sin(2 * Math.PI * modFreq * t) * params.modIndex
      const carrier = Math.sin(2 * Math.PI * params.freq * t + modulator)
      const env = Math.exp(-t * 7)
      data[i] = carrier * env * 0.6
    }
    return buffer
  }

  private async generatePluckBass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.5, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0
      for (let h = 1; h <= 6; h++) {
        osc += Math.sin(2 * Math.PI * params.freq * h * t) / h
      }
      const attack = Math.min(t / 0.001, 1)
      const decay = Math.exp(-t * 15)
      const env = attack * decay
      data[i] = osc * env * 0.5
    }
    return buffer
  }

  private async generateAcidBass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.6, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const square = Math.sin(2 * Math.PI * params.freq * t) > 0 ? 1 : -1
      const filterEnv = Math.exp(-t * params.filterDecay)
      const env = Math.exp(-t * 8)
      data[i] = square * filterEnv * params.resonance * env * 0.3
    }
    return buffer
  }

  // PAD SYNTHESIS
  private async generatePad(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 3.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0

      for (let h = 1; h <= params.harmonics; h++) {
        const amp = 1 / h
        osc += Math.sin(2 * Math.PI * params.freq * h * t) * amp
      }

      const attack = Math.min(t / 0.5, 1)
      const release = t < 2.5 ? 1 : Math.exp(-(t - 2.5) * 4)
      const env = attack * release

      const vibrato = Math.sin(2 * Math.PI * 5 * t) * params.vibratoDepth
      data[i] = osc * env * (0.3 + vibrato)
    }
    return buffer
  }

  // LEAD SYNTHESIS
  private async generateLead(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0

      if (params.type === "saw") {
        for (let h = 1; h <= 10; h++) {
          osc += Math.sin(2 * Math.PI * params.freq * h * t) / h
        }
      } else if (params.type === "square") {
        for (let h = 1; h <= 10; h += 2) {
          osc += Math.sin(2 * Math.PI * params.freq * h * t) / h
        }
      } else if (params.type === "pluck") {
        osc = Math.sin(2 * Math.PI * params.freq * t)
      } else if (params.type === "fm") {
        const modulator = Math.sin(2 * Math.PI * params.freq * 2 * t) * params.modIndex
        osc = Math.sin(2 * Math.PI * params.freq * t + modulator)
      } else {
        osc = Math.sin(2 * Math.PI * params.freq * t)
      }

      const attack = Math.min(t / 0.01, 1)
      const decay = t < 0.1 ? 1 : Math.exp(-(t - 0.1) * 4)
      const env = attack * decay
      data[i] = osc * env * 0.4
    }
    return buffer
  }

  // KEYS SYNTHESIS
  private async generateKeys(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 2.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0

      if (params.type === "piano") {
        osc = Math.sin(2 * Math.PI * params.freq * t)
        osc += Math.sin(2 * Math.PI * params.freq * 2.01 * t) * 0.5
        osc += Math.sin(2 * Math.PI * params.freq * 3.02 * t) * 0.3
      } else if (params.type === "electric") {
        for (let h = 1; h <= 6; h++) {
          osc += Math.sin(2 * Math.PI * params.freq * h * t) / (h * h)
        }
      } else if (params.type === "organ") {
        osc = Math.sin(2 * Math.PI * params.freq * t) * 0.8
        osc += Math.sin(2 * Math.PI * params.freq * 2 * t) * 0.6
        osc += Math.sin(2 * Math.PI * params.freq * 3 * t) * 0.4
      } else if (params.type === "bell") {
        osc = Math.sin(2 * Math.PI * params.freq * t)
        osc += Math.sin(2 * Math.PI * params.freq * 2.76 * t) * 0.4
        osc += Math.sin(2 * Math.PI * params.freq * 5.4 * t) * 0.2
      }

      const attack = Math.min(t / 0.02, 1)
      const decay = Math.exp(-t * 2)
      const env = attack * decay
      data[i] = osc * env * 0.4
    }
    return buffer
  }

  // FX SYNTHESIS
  private async generateRiser(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 2.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const progress = t / duration
      const freq = params.startFreq + (params.endFreq - params.startFreq) * progress
      const osc = Math.sin(2 * Math.PI * freq * t)
      const noise = (Math.random() * 2 - 1) * 0.3
      const env = progress
      data[i] = (osc + noise) * env * 0.5
    }
    return buffer
  }

  private async generateImpact(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.5, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const thump = Math.sin(2 * Math.PI * params.freq * t) * 0.7
      const noise = (Math.random() * 2 - 1) * 0.5
      const env = Math.exp(-t * 10)
      data[i] = (thump + noise) * env * 0.8
    }
    return buffer
  }

  private async generateSweep(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.5
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const progress = t / duration
      const freq = params.startFreq - (params.startFreq - params.endFreq) * progress
      const noise = Math.random() * 2 - 1
      const filtered = Math.sin(2 * Math.PI * freq * t) * noise
      const env = 1 - progress * 0.5
      data[i] = filtered * env * 0.4
    }
    return buffer
  }

  private async generateNoise(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1) * params.amount
      const env = Math.exp(-t * 3)
      data[i] = noise * env
    }
    return buffer
  }

  private async generateGlitch(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.3, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const freq = Math.random() > 0.5 ? params.freq1 : params.freq2
      const osc = Math.sin(2 * Math.PI * freq * t)
      const noise = (Math.random() * 2 - 1) * 0.5
      const amp = Math.random() > 0.7 ? 1 : 0.3
      data[i] = (osc + noise) * amp * 0.4
    }
    return buffer
  }

  private async generateReverse(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const progress = 1 - t / duration
      const freq = params.startFreq + (params.endFreq - params.startFreq) * progress
      const osc = Math.sin(2 * Math.PI * freq * t)
      const env = progress
      data[i] = osc * env * 0.5
    }
    return buffer
  }

  // JAZZ & SOUL SYNTHESIS METHODS
  private async generateUprightBass(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.5, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const sine = Math.sin(2 * Math.PI * params.freq * t)
      const tri = (Math.abs(((params.freq * t) % 1) * 4 - 2) - 1) * 0.5
      
      const buzz = (Math.random() * 2 - 1) * Math.exp(-t * 50) * params.buzzAmount
      
      const env = Math.exp(-t * params.decayRate)
      data[i] = (sine + tri + buzz) * env * 0.6
    }
    return buffer
  }

  private async generateRhodes(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 2.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = Math.sin(2 * Math.PI * params.freq * t)
      osc += Math.sin(2 * Math.PI * params.freq * 2 * t) * params.harmonicAmount
      osc += Math.sin(2 * Math.PI * params.freq * 3 * t) * 0.1
      
      const tremolo = 1 + Math.sin(2 * Math.PI * params.tremoloSpeed * t) * 0.2
      
      const env = Math.exp(-t * 1.5)
      data[i] = osc * tremolo * env * 0.5
    }
    return buffer
  }

  private async generateTrumpet(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.0, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0
      for(let h=1; h<=12; h++) {
         osc += Math.sin(2 * Math.PI * params.freq * h * t) / h
      }
      
      const attack = Math.min(t / 0.05, 1)
      const decay = Math.exp(-(t - 0.05) * 2)
      const env = attack * (t < 0.05 ? 1 : decay)
      
      const vibrato = Math.sin(2 * Math.PI * 5 * t) * params.vibratoDepth
      
      data[i] = osc * env * (1 + vibrato) * 0.3
    }
    return buffer
  }

  private async generateSaxophone(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.2, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0
      for(let h=1; h<=10; h++) {
         const amp = h % 2 === 1 ? 1/h : 0.3/h
         osc += Math.sin(2 * Math.PI * params.freq * h * t) * amp
      }
      
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 2) * params.breathAmount
      
      const env = Math.min(t / 0.1, 1) * Math.exp(-(t - 0.1) * 1.5)
      data[i] = (osc + noise) * env * 0.3
    }
    return buffer
  }

  private async generateJazzOrgan(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 1.5, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = Math.sin(2 * Math.PI * params.freq * t)
      osc += Math.sin(2 * Math.PI * params.freq * 2 * t) * 0.5
      osc += Math.sin(2 * Math.PI * params.freq * 3 * t) * 0.3
      
      const leslie = 1 + Math.sin(2 * Math.PI * params.leslieSpeed * t) * 0.3
      
      const env = Math.min(t / 0.02, 1) * Math.exp(-t * 0.5)
      data[i] = osc * leslie * env * 0.4
    }
    return buffer
  }

  private async generateMPCKick(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.4, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const freq = 60 * Math.exp(-t * 15)
      const osc = Math.sin(2 * Math.PI * freq * t)
      const clipped = Math.tanh(osc * params.saturation)
      const env = Math.exp(-t * 8)
      data[i] = clipped * env * 0.8
    }
    return buffer
  }

  private async generateMPCSnare(params: any): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * 0.2, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const tone = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 20)
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 15)
      const raw = (tone + noise) * 0.8
      const crushed = Math.round(raw * params.crushFactor) / params.crushFactor
      data[i] = crushed
    }
    return buffer
  }

  playSample(name: string, destination: AudioNode, velocity = 1.0) {
    const buffer = this.samples[name]
    if (!buffer) {
      // console.warn(`[v0] Sample ${name} not found`)
      return
    }

    const source = this.ctx.createBufferSource()
    const gain = this.ctx.createGain()
    gain.gain.value = velocity
    source.buffer = buffer
    source.connect(gain)
    gain.connect(destination)
    source.start(0)
  }
}
