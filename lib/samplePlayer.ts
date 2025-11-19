export class SamplePlayer {
  ctx: AudioContext
  samples: Record<string, AudioBuffer> = {}

  constructor(ctx: AudioContext) {
    this.ctx = ctx
  }

  // Generate drum sounds using oscillators
  async generateDrumSounds() {
    // Professional Kicks with pitch envelope and filtering
    this.samples["kick1"] = await this.generateProfessionalKick(60, 0.5)
    this.samples["kick2"] = await this.generateProfessionalKick(50, 0.6)
    this.samples["kick3"] = await this.generateProfessionalKick(45, 0.7)
    this.samples["kick_808"] = await this.generate808Kick()

    // Professional Snares with body + noise
    this.samples["snare1"] = await this.generateProfessionalSnare(200, 0.15)
    this.samples["snare2"] = await this.generateProfessionalSnare(180, 0.18)
    this.samples["rim"] = await this.generateRimshot()

    // Hi-Hats with bandpass filtering
    this.samples["hihat_closed"] = await this.generateProfessionalHiHat(0.05, 8000, 12000)
    this.samples["hihat_open"] = await this.generateProfessionalHiHat(0.3, 6000, 10000)
    this.samples["hihat_pedal"] = await this.generateProfessionalHiHat(0.08, 7000, 11000)

    // Percussion
    this.samples["clap"] = await this.generateProfessionalClap()
    this.samples["snap"] = await this.generateSnap()
    this.samples["shaker"] = await this.generateShaker()
    this.samples["tambourine"] = await this.generateTambourine()

    // Toms with resonance
    this.samples["tom_low"] = await this.generateProfessionalTom(80, 0.4)
    this.samples["tom_mid"] = await this.generateProfessionalTom(120, 0.35)
    this.samples["tom_high"] = await this.generateProfessionalTom(180, 0.3)

    // Cymbals with complex harmonics
    this.samples["crash"] = await this.generateProfessionalCrash()
    this.samples["ride"] = await this.generateProfessionalRide()

    // Professional Bass with sub + harmonics
    this.samples["bass_sub"] = await this.generateSubBass(40)
    this.samples["bass_808"] = await this.generate808Bass(55)
    this.samples["bass_synth"] = await this.generateSynthBass(65)
    this.samples["bass_upright"] = await this.generateUprightBass(45)

    // Jazz & Soul Instruments
    this.samples["rhodes"] = await this.generateRhodes(261.63) // Middle C
    this.samples["trumpet"] = await this.generateTrumpet(440)
    this.samples["sax"] = await this.generateSaxophone(330)
    this.samples["organ_jazz"] = await this.generateJazzOrgan(261.63)

    // Hip Hop Drums (MPC Style)
    this.samples["kick_mpc"] = await this.generateMPCKick()
    this.samples["snare_mpc"] = await this.generateMPCSnare()
    this.samples["hat_mpc"] = await this.generateMPCHat()

    console.log("[v0] Generated professional drum, bass, and jazz samples")
  }

  private async generateProfessionalKick(baseFreq: number, duration: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Pitch envelope: starts high, drops to base frequency
      const pitchEnv = baseFreq + baseFreq * 3 * Math.exp(-t * 50)
      // Oscillator
      const phase = 2 * Math.PI * pitchEnv * t
      const osc = Math.sin(phase)
      // Amplitude envelope with punch
      const env = Math.exp(-t * 8) * (1 + 0.5 * Math.exp(-t * 100))
      // Add click for attack
      const click = Math.exp(-t * 200) * 0.3
      data[i] = (osc * env + click) * 0.9
    }
    return buffer
  }

  private async generate808Kick(): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Pitch sweep from 150Hz to 50Hz
      const pitchEnv = 50 + 100 * Math.exp(-t * 10)
      const phase = 2 * Math.PI * pitchEnv * t
      const osc = Math.sin(phase)
      // Long decay envelope
      const env = Math.exp(-t * 3)
      data[i] = osc * env * 0.85
    }
    return buffer
  }

  private async generateProfessionalSnare(bodyFreq: number, duration: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Body (tonal component)
      const body = Math.sin(2 * Math.PI * bodyFreq * t) * 0.4
      // Snares (noise component)
      const noise = (Math.random() * 2 - 1) * 0.6
      // Envelope
      const env = Math.exp(-t * 20)
      data[i] = (body + noise) * env * 0.8
    }
    return buffer
  }

  private async generateRimshot(): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.08
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // High frequency tone
      const tone = Math.sin(2 * Math.PI * 400 * t) * 0.5
      // Noise
      const noise = (Math.random() * 2 - 1) * 0.5
      // Very sharp envelope
      const env = Math.exp(-t * 50)
      data[i] = (tone + noise) * env * 0.7
    }
    return buffer
  }

  private async generateProfessionalHiHat(duration: number, lowFreq: number, highFreq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Filtered noise (simulating bandpass)
      let noise = Math.random() * 2 - 1
      // Simple high-pass effect
      if (Math.random() > 0.3) noise *= 0.5
      // Envelope
      const env = Math.exp(-t * (duration < 0.1 ? 40 : 8))
      data[i] = noise * env * 0.4
    }
    return buffer
  }

  private async generateProfessionalClap(): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.15
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Noise
      const noise = Math.random() * 2 - 1
      // Multiple hits envelope
      const hit1 = Math.exp(-t * 100)
      const hit2 = Math.exp(-(t - 0.02) * 80) * (t > 0.02 ? 1 : 0)
      const hit3 = Math.exp(-(t - 0.04) * 60) * (t > 0.04 ? 1 : 0)
      const env = hit1 + hit2 * 0.7 + hit3 * 0.5
      data[i] = noise * env * 0.6
    }
    return buffer
  }

  private async generateSnap(): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.06
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // High frequency click
      const click = Math.sin(2 * Math.PI * 1200 * t) * 0.6
      // Noise burst
      const noise = (Math.random() * 2 - 1) * 0.4
      // Very sharp envelope
      const env = Math.exp(-t * 80)
      data[i] = (click + noise) * env * 0.7
    }
    return buffer
  }

  private async generateShaker(): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.12
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // High frequency filtered noise
      const noise = (Math.random() * 2 - 1) * 0.8
      // Envelope with slight sustain
      const env = Math.exp(-t * 15)
      data[i] = noise * env * 0.5
    }
    return buffer
  }

  private async generateTambourine(): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.25
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Jingle (multiple high frequency tones)
      const jingle1 = Math.sin(2 * Math.PI * 3000 * t) * 0.3
      const jingle2 = Math.sin(2 * Math.PI * 3500 * t) * 0.25
      const jingle3 = Math.sin(2 * Math.PI * 4200 * t) * 0.2
      // Noise
      const noise = (Math.random() * 2 - 1) * 0.3
      // Envelope
      const env = Math.exp(-t * 12)
      data[i] = (jingle1 + jingle2 + jingle3 + noise) * env * 0.6
    }
    return buffer
  }

  private async generateProfessionalTom(freq: number, duration: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Pitch envelope
      const pitchEnv = freq * (1 + 0.5 * Math.exp(-t * 15))
      // Fundamental + harmonics
      const osc1 = Math.sin(2 * Math.PI * pitchEnv * t)
      const osc2 = Math.sin(2 * Math.PI * pitchEnv * 1.5 * t) * 0.3
      // Envelope
      const env = Math.exp(-t * 8)
      data[i] = (osc1 + osc2) * env * 0.75
    }
    return buffer
  }

  private async generateProfessionalCrash(): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 2.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Complex noise with harmonics
      const noise = (Math.random() * 2 - 1) * 0.7
      const ring1 = Math.sin(2 * Math.PI * 2000 * t) * 0.15
      const ring2 = Math.sin(2 * Math.PI * 3500 * t) * 0.1
      // Long decay
      const env = Math.exp(-t * 2.5)
      data[i] = (noise + ring1 + ring2) * env * 0.65
    }
    return buffer
  }

  private async generateProfessionalRide(): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.2
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Noise
      const noise = (Math.random() * 2 - 1) * 0.4
      // Bell tone
      const bell = Math.sin(2 * Math.PI * 2500 * t) * 0.5
      // Envelope
      const env = Math.exp(-t * 4)
      data[i] = (noise + bell) * env * 0.6
    }
    return buffer
  }

  private async generateSubBass(freq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Pure sine wave
      const osc = Math.sin(2 * Math.PI * freq * t)
      // ADSR envelope
      const attack = Math.min(t / 0.01, 1)
      const decay = t < 0.1 ? 1 : Math.exp(-(t - 0.1) * 3)
      const env = attack * decay
      data[i] = osc * env * 0.8
    }
    return buffer
  }

  private async generate808Bass(freq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.8
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Fundamental + harmonics
      const osc1 = Math.sin(2 * Math.PI * freq * t)
      const osc2 = Math.sin(2 * Math.PI * freq * 2 * t) * 0.4
      const osc3 = Math.sin(2 * Math.PI * freq * 3 * t) * 0.2
      // Envelope
      const env = Math.exp(-t * 5)
      data[i] = (osc1 + osc2 + osc3) * env * 0.75
    }
    return buffer
  }

  private async generateSynthBass(freq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 0.6
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Sawtooth-like wave (sum of harmonics)
      let osc = 0
      for (let h = 1; h <= 8; h++) {
        osc += Math.sin(2 * Math.PI * freq * h * t) / h
      }
      // Filter envelope
      const filterEnv = Math.exp(-t * 10)
      // Amplitude envelope
      const env = Math.exp(-t * 6)
      data[i] = osc * filterEnv * env * 0.3
    }
    return buffer
  }

  private async generateUprightBass(freq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.5
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Mix of sine and triangle for woody tone
      const sine = Math.sin(2 * Math.PI * freq * t)
      const tri = (Math.abs(((freq * t) % 1) * 4 - 2) - 1) * 0.5
      
      // Pluck envelope
      const env = Math.exp(-t * 3)
      // Add some "string buzz" noise at the start
      const buzz = (Math.random() * 2 - 1) * Math.exp(-t * 50) * 0.2
      
      data[i] = (sine + tri + buzz) * env * 0.6
    }
    return buffer
  }

  private async generateRhodes(freq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 2.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Rhodes has strong fundamental + specific harmonics
      let osc = Math.sin(2 * Math.PI * freq * t)
      osc += Math.sin(2 * Math.PI * freq * 2 * t) * 0.2
      osc += Math.sin(2 * Math.PI * freq * 3 * t) * 0.1
      osc += Math.sin(2 * Math.PI * freq * 4 * t) * 0.05

      // Tremolo effect
      const tremolo = 1 + Math.sin(2 * Math.PI * 6 * t) * 0.2
      
      const env = Math.exp(-t * 1.5)
      data[i] = osc * tremolo * env * 0.5
    }
    return buffer
  }

  private async generateTrumpet(freq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.0
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Sawtooth-like for brass
      let osc = 0
      for(let h=1; h<=12; h++) {
         osc += Math.sin(2 * Math.PI * freq * h * t) / h
      }
      
      // Envelope with slight swell
      const attack = Math.min(t / 0.05, 1)
      const decay = Math.exp(-(t - 0.05) * 2)
      const env = attack * (t < 0.05 ? 1 : decay)
      
      // Vibrato
      const vibrato = Math.sin(2 * Math.PI * 5 * t) * 0.02
      
      data[i] = osc * env * (1 + vibrato) * 0.3
    }
    return buffer
  }

  private async generateSaxophone(freq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.2
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Square/Saw hybrid for reed sound
      let osc = 0
      for(let h=1; h<=10; h++) {
         // Odd harmonics emphasized
         const amp = h % 2 === 1 ? 1/h : 0.3/h
         osc += Math.sin(2 * Math.PI * freq * h * t) * amp
      }
      
      // Breath noise
      const noise = (Math.random() * 2 - 1) * 0.1 * Math.exp(-t * 2)
      
      const env = Math.min(t / 0.1, 1) * Math.exp(-(t - 0.1) * 1.5)
      data[i] = (osc + noise) * env * 0.3
    }
    return buffer
  }

  private async generateJazzOrgan(freq: number): Promise<AudioBuffer> {
    const sampleRate = this.ctx.sampleRate
    const duration = 1.5
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      // Hammond-style drawbars (approximate)
      let osc = Math.sin(2 * Math.PI * freq * t) // Fundamental
      osc += Math.sin(2 * Math.PI * freq * 2 * t) * 0.5 // 2nd harmonic
      osc += Math.sin(2 * Math.PI * freq * 3 * t) * 0.3 // 3rd harmonic
      osc += Math.sin(2 * Math.PI * freq * 4 * t) * 0.1 // 4th harmonic
      
      // Leslie speaker simulation (amplitude modulation)
      const leslie = 1 + Math.sin(2 * Math.PI * 4 * t) * 0.3
      
      const env = Math.min(t / 0.02, 1) * Math.exp(-t * 0.5)
      data[i] = osc * leslie * env * 0.4
    }
    return buffer
  }

  private async generateMPCKick(): Promise<AudioBuffer> {
    // Punchy, slightly saturated kick
    const sampleRate = this.ctx.sampleRate
    const duration = 0.4
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const freq = 60 * Math.exp(-t * 15)
      const osc = Math.sin(2 * Math.PI * freq * t)
      // Soft clipping for saturation
      const clipped = Math.tanh(osc * 2)
      const env = Math.exp(-t * 8)
      data[i] = clipped * env * 0.8
    }
    return buffer
  }

  private async generateMPCSnare(): Promise<AudioBuffer> {
    // Tight, dry snare
    const sampleRate = this.ctx.sampleRate
    const duration = 0.2
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const tone = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 20)
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 15)
      // Bitcrush-like effect (simple quantization)
      const raw = (tone + noise) * 0.8
      const crushed = Math.round(raw * 16) / 16
      data[i] = crushed
    }
    return buffer
  }

  private async generateMPCHat(): Promise<AudioBuffer> {
    // Sharp, metallic hat
    const sampleRate = this.ctx.sampleRate
    const duration = 0.05
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noise = (Math.random() * 2 - 1)
      // High pass filter approximation
      const filtered = noise * (Math.random() > 0.5 ? 1 : -1)
      const env = Math.exp(-t * 60)
      data[i] = filtered * env * 0.6
    }
    return buffer
  }

  // Play a sample immediately
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
