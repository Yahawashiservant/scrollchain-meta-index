import type { AudioContext } from "standardized-audio-context"

export interface EntropyParams {
  density: number // 0-1: affects harmonic complexity
  coherence: number // 0-1: affects phase relationships
  phase: number // 0-1: affects modulation depth
  space: number // 0-1: affects stereo width and reverb
}

export class LatticeSynthesisEngine {
  ctx: AudioContext
  samples: Record<string, AudioBuffer> = {}

  constructor(ctx: AudioContext) {
    this.ctx = ctx
  }

  async generateAllInstruments(entropy: EntropyParams = { density: 0.5, coherence: 0.5, phase: 0.5, space: 0.5 }) {
    // DRUMS (16 variations)
    this.samples["kick_deep"] = await this.generateKick(40, 0.6, entropy)
    this.samples["kick_punch"] = await this.generateKick(60, 0.5, entropy)
    this.samples["kick_808"] = await this.generate808Kick(entropy)
    this.samples["kick_acoustic"] = await this.generateKick(55, 0.7, entropy)

    this.samples["snare_tight"] = await this.generateSnare(200, 0.12, entropy)
    this.samples["snare_fat"] = await this.generateSnare(180, 0.18, entropy)
    this.samples["snare_clap"] = await this.generateSnare(220, 0.15, entropy)
    this.samples["rim"] = await this.generateRim(entropy)

    this.samples["hihat_closed"] = await this.generateHiHat(0.05, 8000, entropy)
    this.samples["hihat_open"] = await this.generateHiHat(0.3, 6000, entropy)
    this.samples["hihat_pedal"] = await this.generateHiHat(0.08, 7000, entropy)
    this.samples["hihat_sizzle"] = await this.generateHiHat(0.4, 9000, entropy)

    this.samples["clap"] = await this.generateClap(entropy)
    this.samples["snap"] = await this.generateSnap(entropy)
    this.samples["shaker"] = await this.generateShaker(entropy)
    this.samples["tambourine"] = await this.generateTambourine(entropy)

    // TOMS (4 variations)
    this.samples["tom_low"] = await this.generateTom(80, 0.4, entropy)
    this.samples["tom_mid"] = await this.generateTom(120, 0.35, entropy)
    this.samples["tom_high"] = await this.generateTom(180, 0.3, entropy)
    this.samples["tom_floor"] = await this.generateTom(65, 0.5, entropy)

    // CYMBALS (4 variations)
    this.samples["crash"] = await this.generateCrash(2.0, entropy)
    this.samples["ride"] = await this.generateRide(1.2, entropy)
    this.samples["splash"] = await this.generateCrash(0.8, entropy)
    this.samples["china"] = await this.generateCrash(1.5, entropy)

    // BASS (8 variations)
    this.samples["bass_sub"] = await this.generateSubBass(40, entropy)
    this.samples["bass_808"] = await this.generate808Bass(55, entropy)
    this.samples["bass_synth"] = await this.generateSynthBass(65, entropy)
    this.samples["bass_reese"] = await this.generateReeseBass(50, entropy)
    this.samples["bass_wobble"] = await this.generateWobbleBass(60, entropy)
    this.samples["bass_fm"] = await this.generateFMBass(70, entropy)
    this.samples["bass_pluck"] = await this.generatePluckBass(80, entropy)
    this.samples["bass_acid"] = await this.generateAcidBass(55, entropy)

    // SYNTHS - PADS (6 variations)
    this.samples["pad_warm"] = await this.generatePad(220, "warm", entropy)
    this.samples["pad_bright"] = await this.generatePad(330, "bright", entropy)
    this.samples["pad_dark"] = await this.generatePad(165, "dark", entropy)
    this.samples["pad_strings"] = await this.generatePad(196, "strings", entropy)
    this.samples["pad_choir"] = await this.generatePad(262, "choir", entropy)
    this.samples["pad_ambient"] = await this.generatePad(110, "ambient", entropy)

    // SYNTHS - LEADS (6 variations)
    this.samples["lead_saw"] = await this.generateLead(440, "saw", entropy)
    this.samples["lead_square"] = await this.generateLead(440, "square", entropy)
    this.samples["lead_pluck"] = await this.generateLead(440, "pluck", entropy)
    this.samples["lead_fm"] = await this.generateLead(440, "fm", entropy)
    this.samples["lead_sync"] = await this.generateLead(440, "sync", entropy)
    this.samples["lead_arp"] = await this.generateLead(440, "arp", entropy)

    // KEYS (4 variations)
    this.samples["keys_piano"] = await this.generateKeys(262, "piano", entropy)
    this.samples["keys_electric"] = await this.generateKeys(262, "electric", entropy)
    this.samples["keys_organ"] = await this.generateKeys(262, "organ", entropy)
    this.samples["keys_bell"] = await this.generateKeys(262, "bell", entropy)

    // FX (6 variations)
    this.samples["fx_riser"] = await this.generateRiser(entropy)
    this.samples["fx_impact"] = await this.generateImpact(entropy)
    this.samples["fx_sweep"] = await this.generateSweep(entropy)
    this.samples["fx_noise"] = await this.generateNoise(entropy)
    this.samples["fx_glitch"] = await this.generateGlitch(entropy)
    this.samples["fx_reverse"] = await this.generateReverse(entropy)

    // JAZZ & SOUL (New Category)
    this.samples["jazz_upright"] = await this.generateUprightBass(45, entropy)
    this.samples["jazz_rhodes"] = await this.generateRhodes(261.63, entropy)
    this.samples["jazz_trumpet"] = await this.generateTrumpet(440, entropy)
    this.samples["jazz_sax"] = await this.generateSaxophone(330, entropy)
    this.samples["soul_organ"] = await this.generateJazzOrgan(261.63, entropy)
    this.samples["hiphop_kick"] = await this.generateMPCKick(entropy)
    this.samples["hiphop_snare"] = await this.generateMPCSnare(entropy)

    console.log(`[v0] Generated ${Object.keys(this.samples).length} lattice-based instruments with entropy shaping`)
  }

  // DRUM SYNTHESIS
  private async generateKick(baseFreq: number, duration: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Entropy affects pitch sweep range
      const pitchRange = baseFreq * (2 + entropy.density)
      const pitchEnv = baseFreq + pitchRange * Math.exp(-t * 50)
      const phase = 2 * Math.PI * pitchEnv * t
      let osc = Math.sin(phase)

      // Entropy affects harmonic content
      if (entropy.density > 0.3) {
        osc += Math.sin(phase * 2) * 0.3 * entropy.density
      }

      // Envelope with entropy-based decay
      const decayRate = 8 * (1 + entropy.coherence)
      const env = Math.exp(-t * decayRate) * (1 + 0.5 * Math.exp(-t * 100))
      const click = Math.exp(-t * 200) * 0.3
      data[i] = (osc * env + click) * 0.9
    }
    return buffer
  }

  private async generate808Kick(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0 * (1 + entropy.space * 0.5)
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const pitchEnv = 50 + 100 * Math.exp(-t * 10)
      const phase = 2 * Math.PI * pitchEnv * t
      let osc = Math.sin(phase)

      // Add harmonics based on density
      if (entropy.density > 0.5) {
        osc += Math.sin(phase * 1.5) * 0.2 * entropy.density
      }

      const env = Math.exp(-t * (3 * entropy.coherence))
      data[i] = osc * env * 0.85
    }
    return buffer
  }

  private async generateSnare(bodyFreq: number, duration: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Body with entropy-based harmonics
      let body = Math.sin(2 * Math.PI * bodyFreq * t) * 0.4
      if (entropy.density > 0.4) {
        body += Math.sin(2 * Math.PI * bodyFreq * 1.5 * t) * 0.2 * entropy.density
      }

      // Noise with entropy-based filtering
      const noise = (Math.random() * 2 - 1) * (0.6 + entropy.phase * 0.3)
      const env = Math.exp(-t * (20 * entropy.coherence))
      data[i] = (body + noise) * env * 0.8
    }
    return buffer
  }

  private async generateRim(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.08
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const freq = 400 * (1 + entropy.phase * 0.5)
      const tone = Math.sin(2 * Math.PI * freq * t) * 0.5
      const noise = (Math.random() * 2 - 1) * 0.5
      const env = Math.exp(-t * 50)
      data[i] = (tone + noise) * env * 0.7
    }
    return buffer
  }

  private async generateHiHat(duration: number, freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let noise = Math.random() * 2 - 1
      // Entropy affects brightness
      if (Math.random() > 0.3 - entropy.density * 0.2) noise *= 0.5
      const env = Math.exp(-t * (duration < 0.1 ? 40 : 8) * entropy.coherence)
      data[i] = noise * env * 0.4
    }
    return buffer
  }

  private async generateClap(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.15
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = Math.random() * 2 - 1
      // Multiple hits with entropy-based spacing
      const hit1 = Math.exp(-t * 100)
      const hit2 = Math.exp(-(t - 0.02 * entropy.phase) * 80) * (t > 0.02 * entropy.phase ? 1 : 0)
      const hit3 = Math.exp(-(t - 0.04 * entropy.phase) * 60) * (t > 0.04 * entropy.phase ? 1 : 0)
      const env = hit1 + hit2 * 0.7 + hit3 * 0.5
      data[i] = noise * env * 0.6
    }
    return buffer
  }

  private async generateSnap(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.06
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const freq = 1200 * (1 + entropy.density * 0.3)
      const click = Math.sin(2 * Math.PI * freq * t) * 0.6
      const noise = (Math.random() * 2 - 1) * 0.4
      const env = Math.exp(-t * 80)
      data[i] = (click + noise) * env * 0.7
    }
    return buffer
  }

  private async generateShaker(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.12
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1) * (0.8 + entropy.phase * 0.2)
      const env = Math.exp(-t * 15)
      data[i] = noise * env * 0.5
    }
    return buffer
  }

  private async generateTambourine(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.25
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Multiple jingles with entropy-based detuning
      const jingle1 = Math.sin(2 * Math.PI * 3000 * (1 + entropy.phase * 0.1) * t) * 0.3
      const jingle2 = Math.sin(2 * Math.PI * 3500 * (1 - entropy.phase * 0.1) * t) * 0.25
      const jingle3 = Math.sin(2 * Math.PI * 4200 * t) * 0.2
      const noise = (Math.random() * 2 - 1) * 0.3
      const env = Math.exp(-t * 12)
      data[i] = (jingle1 + jingle2 + jingle3 + noise) * env * 0.6
    }
    return buffer
  }

  private async generateTom(freq: number, duration: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const pitchEnv = freq * (1 + 0.5 * Math.exp(-t * 15))
      let osc = Math.sin(2 * Math.PI * pitchEnv * t)

      // Add harmonics based on density
      if (entropy.density > 0.3) {
        osc += Math.sin(2 * Math.PI * pitchEnv * 1.5 * t) * 0.3 * entropy.density
      }

      const env = Math.exp(-t * 8)
      data[i] = osc * env * 0.75
    }
    return buffer
  }

  private async generateCrash(duration: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1) * 0.7
      // Entropy affects ring frequencies
      const ring1 = Math.sin(2 * Math.PI * 2000 * (1 + entropy.phase * 0.2) * t) * 0.15
      const ring2 = Math.sin(2 * Math.PI * 3500 * (1 - entropy.phase * 0.2) * t) * 0.1
      const env = Math.exp(-t * (2.5 * entropy.coherence))
      data[i] = (noise + ring1 + ring2) * env * 0.65
    }
    return buffer
  }

  private async generateRide(duration: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1) * 0.4
      const bell = Math.sin(2 * Math.PI * 2500 * (1 + entropy.density * 0.1) * t) * 0.5
      const env = Math.exp(-t * 4)
      data[i] = (noise + bell) * env * 0.6
    }
    return buffer
  }

  // BASS SYNTHESIS
  private async generateSubBass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = Math.sin(2 * Math.PI * freq * t)

      // Add subtle harmonics based on density
      if (entropy.density > 0.5) {
        osc += Math.sin(2 * Math.PI * freq * 2 * t) * 0.1 * entropy.density
      }

      const attack = Math.min(t / 0.01, 1)
      const decay = t < 0.1 ? 1 : Math.exp(-(t - 0.1) * 3)
      const env = attack * decay
      data[i] = osc * env * 0.8
    }
    return buffer
  }

  private async generate808Bass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.8
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Harmonics controlled by density
      const osc1 = Math.sin(2 * Math.PI * freq * t)
      const osc2 = Math.sin(2 * Math.PI * freq * 2 * t) * (0.4 * entropy.density)
      const osc3 = Math.sin(2 * Math.PI * freq * 3 * t) * (0.2 * entropy.density)
      const env = Math.exp(-t * 5)
      data[i] = (osc1 + osc2 + osc3) * env * 0.75
    }
    return buffer
  }

  private async generateSynthBass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.6
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Sawtooth with entropy-controlled harmonics
      let osc = 0
      const harmonics = Math.floor(8 * (1 + entropy.density))
      for (let h = 1; h <= harmonics; h++) {
        osc += Math.sin(2 * Math.PI * freq * h * t) / h
      }
      const filterEnv = Math.exp(-t * 10)
      const env = Math.exp(-t * 6)
      data[i] = osc * filterEnv * env * 0.3
    }
    return buffer
  }

  private async generateReeseBass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Detuned saws with entropy-based detune amount
      const detune = 5 * entropy.phase
      let osc1 = 0
      let osc2 = 0
      for (let h = 1; h <= 6; h++) {
        osc1 += Math.sin(2 * Math.PI * freq * h * t) / h
        osc2 += Math.sin(2 * Math.PI * (freq + detune) * h * t) / h
      }
      const env = Math.exp(-t * 2)
      data[i] = (osc1 + osc2) * env * 0.25
    }
    return buffer
  }

  private async generateWobbleBass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // LFO-modulated filter with entropy-based rate
      const lfoRate = 4 * (1 + entropy.phase)
      const lfo = Math.sin(2 * Math.PI * lfoRate * t) * 0.5 + 0.5
      let osc = 0
      for (let h = 1; h <= 8; h++) {
        osc += Math.sin(2 * Math.PI * freq * h * t) / h
      }
      const filterMod = lfo * entropy.density
      const env = Math.exp(-t * 3)
      data[i] = osc * filterMod * env * 0.4
    }
    return buffer
  }

  private async generateFMBass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.7
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // FM synthesis with entropy-based modulation index
      const modIndex = 5 * entropy.density
      const modFreq = freq * 2
      const modulator = Math.sin(2 * Math.PI * modFreq * t) * modIndex
      const carrier = Math.sin(2 * Math.PI * freq * t + modulator)
      const env = Math.exp(-t * 7)
      data[i] = carrier * env * 0.6
    }
    return buffer
  }

  private async generatePluckBass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.5
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0
      for (let h = 1; h <= 6; h++) {
        osc += Math.sin(2 * Math.PI * freq * h * t) / h
      }
      // Very fast attack, fast decay
      const attack = Math.min(t / 0.001, 1)
      const decay = Math.exp(-t * 15)
      const env = attack * decay
      data[i] = osc * env * 0.5
    }
    return buffer
  }

  private async generateAcidBass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.6
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Square wave with resonant filter sweep
      const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1
      const filterEnv = Math.exp(-t * (12 * entropy.coherence))
      const resonance = 1 + entropy.density * 3
      const env = Math.exp(-t * 8)
      data[i] = square * filterEnv * resonance * env * 0.3
    }
    return buffer
  }

  // PAD SYNTHESIS
  private async generatePad(freq: number, type: string, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 3.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0

      // Different harmonic content based on type
      const harmonics = type === "bright" ? 12 : type === "dark" ? 4 : 8
      for (let h = 1; h <= harmonics; h++) {
        const amp = 1 / (h * (1 + entropy.coherence))
        osc += Math.sin(2 * Math.PI * freq * h * t) * amp
      }

      // Slow attack and release
      const attack = Math.min(t / 0.5, 1)
      const release = t < 2.5 ? 1 : Math.exp(-(t - 2.5) * 4)
      const env = attack * release

      // Add subtle vibrato based on phase
      const vibrato = Math.sin(2 * Math.PI * 5 * t) * entropy.phase * 0.01
      data[i] = osc * env * (0.3 + vibrato)
    }
    return buffer
  }

  // LEAD SYNTHESIS
  private async generateLead(freq: number, type: string, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0

      if (type === "saw") {
        for (let h = 1; h <= 10; h++) {
          osc += Math.sin(2 * Math.PI * freq * h * t) / h
        }
      } else if (type === "square") {
        for (let h = 1; h <= 10; h += 2) {
          osc += Math.sin(2 * Math.PI * freq * h * t) / h
        }
      } else if (type === "pluck") {
        osc = Math.sin(2 * Math.PI * freq * t)
      } else if (type === "fm") {
        const modIndex = 3 * entropy.density
        const modulator = Math.sin(2 * Math.PI * freq * 2 * t) * modIndex
        osc = Math.sin(2 * Math.PI * freq * t + modulator)
      }

      const attack = Math.min(t / 0.01, 1)
      const decay = t < 0.1 ? 1 : Math.exp(-(t - 0.1) * 4)
      const env = attack * decay
      data[i] = osc * env * 0.4
    }
    return buffer
  }

  // KEYS SYNTHESIS
  private async generateKeys(freq: number, type: string, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 2.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0

      if (type === "piano") {
        // Inharmonic partials for piano-like sound
        osc = Math.sin(2 * Math.PI * freq * t)
        osc += Math.sin(2 * Math.PI * freq * 2.01 * t) * 0.5
        osc += Math.sin(2 * Math.PI * freq * 3.02 * t) * 0.3
      } else if (type === "electric") {
        // Bell-like harmonics
        for (let h = 1; h <= 6; h++) {
          osc += Math.sin(2 * Math.PI * freq * h * t) / (h * h)
        }
      } else if (type === "organ") {
        // Drawbar-style harmonics
        osc = Math.sin(2 * Math.PI * freq * t) * 0.8
        osc += Math.sin(2 * Math.PI * freq * 2 * t) * 0.6
        osc += Math.sin(2 * Math.PI * freq * 3 * t) * 0.4
      } else if (type === "bell") {
        // Metallic harmonics
        osc = Math.sin(2 * Math.PI * freq * t)
        osc += Math.sin(2 * Math.PI * freq * 2.76 * t) * 0.4
        osc += Math.sin(2 * Math.PI * freq * 5.4 * t) * 0.2
      }

      const attack = Math.min(t / 0.02, 1)
      const decay = Math.exp(-t * 2)
      const env = attack * decay
      data[i] = osc * env * 0.4
    }
    return buffer
  }

  // FX SYNTHESIS
  private async generateRiser(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 2.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const progress = t / duration
      // Pitch rises with entropy-based range
      const freq = 100 + 2000 * progress * (1 + entropy.density)
      const osc = Math.sin(2 * Math.PI * freq * t)
      const noise = (Math.random() * 2 - 1) * 0.3
      const env = progress
      data[i] = (osc + noise) * env * 0.5
    }
    return buffer
  }

  private async generateImpact(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.5
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Low frequency thump + noise burst
      const thump = Math.sin(2 * Math.PI * 60 * t) * 0.7
      const noise = (Math.random() * 2 - 1) * 0.5
      const env = Math.exp(-t * 10)
      data[i] = (thump + noise) * env * 0.8
    }
    return buffer
  }

  private async generateSweep(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.5
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const progress = t / duration
      // Frequency sweeps down
      const freq = 5000 - 4500 * progress
      const noise = Math.random() * 2 - 1
      // Bandpass effect
      const filtered = Math.sin(2 * Math.PI * freq * t) * noise
      const env = 1 - progress * 0.5
      data[i] = filtered * env * 0.4
    }
    return buffer
  }

  private async generateNoise(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1) * (0.5 + entropy.density * 0.5)
      const env = Math.exp(-t * 3)
      data[i] = noise * env
    }
    return buffer
  }

  private async generateGlitch(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.3
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Random frequency jumps
      const freq = Math.random() > 0.5 ? 1000 : 2000
      const osc = Math.sin(2 * Math.PI * freq * t)
      const noise = (Math.random() * 2 - 1) * 0.5
      // Random amplitude
      const amp = Math.random() > 0.7 ? 1 : 0.3
      data[i] = (osc + noise) * amp * 0.4
    }
    return buffer
  }

  private async generateReverse(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    // Generate forward, then reverse
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const progress = 1 - t / duration
      const freq = 200 + 1000 * progress
      const osc = Math.sin(2 * Math.PI * freq * t)
      const env = progress
      data[i] = osc * env * 0.5
    }
    return buffer
  }

  // JAZZ & SOUL SYNTHESIS METHODS
  private async generateUprightBass(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.5
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const sine = Math.sin(2 * Math.PI * freq * t)
      const tri = (Math.abs(((freq * t) % 1) * 4 - 2) - 1) * 0.5
      
      // Entropy affects "woodiness" (noise/buzz)
      const buzz = (Math.random() * 2 - 1) * Math.exp(-t * 50) * 0.2 * (1 + entropy.density)
      
      const env = Math.exp(-t * (3 * entropy.coherence))
      data[i] = (sine + tri + buzz) * env * 0.6
    }
    return buffer
  }

  private async generateRhodes(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 2.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = Math.sin(2 * Math.PI * freq * t)
      // Entropy adds more tines/harmonics
      osc += Math.sin(2 * Math.PI * freq * 2 * t) * 0.2 * (1 + entropy.density)
      osc += Math.sin(2 * Math.PI * freq * 3 * t) * 0.1
      
      // Entropy affects tremolo speed
      const tremolo = 1 + Math.sin(2 * Math.PI * (6 * entropy.phase) * t) * 0.2
      
      const env = Math.exp(-t * 1.5)
      data[i] = osc * tremolo * env * 0.5
    }
    return buffer
  }

  private async generateTrumpet(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0
      for(let h=1; h<=12; h++) {
         osc += Math.sin(2 * Math.PI * freq * h * t) / h
      }
      
      const attack = Math.min(t / 0.05, 1)
      const decay = Math.exp(-(t - 0.05) * 2)
      const env = attack * (t < 0.05 ? 1 : decay)
      
      // Entropy affects vibrato depth
      const vibrato = Math.sin(2 * Math.PI * 5 * t) * 0.02 * (1 + entropy.phase)
      
      data[i] = osc * env * (1 + vibrato) * 0.3
    }
    return buffer
  }

  private async generateSaxophone(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.2
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = 0
      for(let h=1; h<=10; h++) {
         const amp = h % 2 === 1 ? 1/h : 0.3/h
         osc += Math.sin(2 * Math.PI * freq * h * t) * amp
      }
      
      // Entropy affects breath noise
      const noise = (Math.random() * 2 - 1) * 0.1 * Math.exp(-t * 2) * (1 + entropy.density)
      
      const env = Math.min(t / 0.1, 1) * Math.exp(-(t - 0.1) * 1.5)
      data[i] = (osc + noise) * env * 0.3
    }
    return buffer
  }

  private async generateJazzOrgan(freq: number, entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.5
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let osc = Math.sin(2 * Math.PI * freq * t)
      osc += Math.sin(2 * Math.PI * freq * 2 * t) * 0.5
      osc += Math.sin(2 * Math.PI * freq * 3 * t) * 0.3
      
      // Entropy affects Leslie speed
      const leslie = 1 + Math.sin(2 * Math.PI * (4 * entropy.phase) * t) * 0.3
      
      const env = Math.min(t / 0.02, 1) * Math.exp(-t * 0.5)
      data[i] = osc * leslie * env * 0.4
    }
    return buffer
  }

  private async generateMPCKick(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.4
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const freq = 60 * Math.exp(-t * 15)
      const osc = Math.sin(2 * Math.PI * freq * t)
      // Entropy affects saturation/clipping
      const clipped = Math.tanh(osc * (2 + entropy.density))
      const env = Math.exp(-t * 8)
      data[i] = clipped * env * 0.8
    }
    return buffer
  }

  private async generateMPCSnare(entropy: EntropyParams): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.2
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const tone = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 20)
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 15)
      const raw = (tone + noise) * 0.8
      // Entropy affects bitcrushing
      const crushFactor = 16 - (entropy.density * 12) // Lower is more crushed
      const crushed = Math.round(raw * crushFactor) / crushFactor
      data[i] = crushed
    }
    return buffer
  }

  playSample(name: string, destination: AudioNode, velocity = 1.0) {
    const buffer = this.samples[name]
    if (!buffer) {
      console.warn(`[v0] Sample ${name} not found`)
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
