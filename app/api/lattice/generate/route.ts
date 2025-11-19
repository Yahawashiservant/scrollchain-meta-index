import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Helper to calculate parameters based on entropy
function calculateInstrumentParams(entropy: any) {
  const { density, coherence, phase, space } = entropy

  return {
    // DRUMS
    kick_deep: {
      baseFreq: 40,
      duration: 0.6,
      pitchRange: 40 * (2 + density),
      harmonicStrength: density > 0.3 ? 0.3 * density : 0,
      decayRate: 8 * (1 + coherence),
      clickAmount: 0.3,
    },
    kick_punch: {
      baseFreq: 60,
      duration: 0.5,
      pitchRange: 60 * (2 + density),
      harmonicStrength: density > 0.3 ? 0.3 * density : 0,
      decayRate: 8 * (1 + coherence),
      clickAmount: 0.3,
    },
    kick_808: {
      duration: 1.0 * (1 + space * 0.5),
      pitchEnvAmount: 100,
      pitchDecay: 10,
      harmonicStrength: density > 0.5 ? 0.2 * density : 0,
      decayRate: 3 * coherence,
    },
    snare_tight: {
      bodyFreq: 200,
      duration: 0.12,
      harmonicStrength: density > 0.4 ? 0.2 * density : 0,
      noiseAmount: 0.6 + phase * 0.3,
      decayRate: 20 * coherence,
    },
    snare_fat: {
      bodyFreq: 180,
      duration: 0.18,
      harmonicStrength: density > 0.4 ? 0.2 * density : 0,
      noiseAmount: 0.6 + phase * 0.3,
      decayRate: 20 * coherence,
    },
    snare_clap: {
      bodyFreq: 220,
      duration: 0.15,
      harmonicStrength: density > 0.4 ? 0.2 * density : 0,
      noiseAmount: 0.6 + phase * 0.3,
      decayRate: 20 * coherence,
    },
    rim: {
      freq: 400 * (1 + phase * 0.5),
      duration: 0.08,
      noiseAmount: 0.5,
      decayRate: 50,
    },
    hihat_closed: {
      duration: 0.05,
      freq: 8000,
      brightness: 0.3 - density * 0.2,
      decayRate: 40 * coherence,
    },
    hihat_open: {
      duration: 0.3,
      freq: 6000,
      brightness: 0.3 - density * 0.2,
      decayRate: 8 * coherence,
    },
    hihat_pedal: {
      duration: 0.08,
      freq: 7000,
      brightness: 0.3 - density * 0.2,
      decayRate: 40 * coherence,
    },
    hihat_sizzle: {
      duration: 0.4,
      freq: 9000,
      brightness: 0.3 - density * 0.2,
      decayRate: 8 * coherence,
    },
    clap: {
      duration: 0.15,
      spread: 0.02 * phase,
      decayRate: 100,
    },
    snap: {
      duration: 0.06,
      freq: 1200 * (1 + density * 0.3),
      decayRate: 80,
    },
    shaker: {
      duration: 0.12,
      noiseAmount: 0.8 + phase * 0.2,
      decayRate: 15,
    },
    tambourine: {
      duration: 0.25,
      jingleFreq1: 3000 * (1 + phase * 0.1),
      jingleFreq2: 3500 * (1 - phase * 0.1),
      decayRate: 12,
    },
    // TOMS
    tom_low: {
      freq: 80,
      duration: 0.4,
      harmonicStrength: density > 0.3 ? 0.3 * density : 0,
      decayRate: 8,
    },
    tom_mid: {
      freq: 120,
      duration: 0.35,
      harmonicStrength: density > 0.3 ? 0.3 * density : 0,
      decayRate: 8,
    },
    tom_high: {
      freq: 180,
      duration: 0.3,
      harmonicStrength: density > 0.3 ? 0.3 * density : 0,
      decayRate: 8,
    },
    tom_floor: {
      freq: 65,
      duration: 0.5,
      harmonicStrength: density > 0.3 ? 0.3 * density : 0,
      decayRate: 8,
    },
    // CYMBALS
    crash: {
      duration: 2.0,
      ringFreq1: 2000 * (1 + phase * 0.2),
      ringFreq2: 3500 * (1 - phase * 0.2),
      decayRate: 2.5 * coherence,
    },
    ride: {
      duration: 1.2,
      bellFreq: 2500 * (1 + density * 0.1),
      decayRate: 4,
    },
    splash: {
      duration: 0.8,
      ringFreq1: 2000 * (1 + phase * 0.2),
      ringFreq2: 3500 * (1 - phase * 0.2),
      decayRate: 2.5 * coherence,
    },
    china: {
      duration: 1.5,
      ringFreq1: 2000 * (1 + phase * 0.2),
      ringFreq2: 3500 * (1 - phase * 0.2),
      decayRate: 2.5 * coherence,
    },
    // BASS
    bass_sub: {
      freq: 40,
      harmonicStrength: density > 0.5 ? 0.1 * density : 0,
    },
    bass_808: {
      freq: 55,
      harmonicStrength: 0.4 * density,
    },
    bass_synth: {
      freq: 65,
      harmonics: Math.floor(8 * (1 + density)),
    },
    bass_reese: {
      freq: 50,
      detune: 5 * phase,
    },
    bass_wobble: {
      freq: 60,
      lfoRate: 4 * (1 + phase),
      filterMod: density,
    },
    bass_fm: {
      freq: 70,
      modIndex: 5 * density,
    },
    bass_pluck: {
      freq: 80,
    },
    bass_acid: {
      freq: 55,
      resonance: 1 + density * 3,
      filterDecay: 12 * coherence,
    },
    // PADS
    pad_warm: { freq: 220, harmonics: 8, vibratoDepth: phase * 0.01 },
    pad_bright: { freq: 330, harmonics: 12, vibratoDepth: phase * 0.01 },
    pad_dark: { freq: 165, harmonics: 4, vibratoDepth: phase * 0.01 },
    pad_strings: { freq: 196, harmonics: 8, vibratoDepth: phase * 0.01 },
    pad_choir: { freq: 262, harmonics: 8, vibratoDepth: phase * 0.01 },
    pad_ambient: { freq: 110, harmonics: 8, vibratoDepth: phase * 0.01 },
    // LEADS
    lead_saw: { freq: 440, type: "saw" },
    lead_square: { freq: 440, type: "square" },
    lead_pluck: { freq: 440, type: "pluck" },
    lead_fm: { freq: 440, type: "fm", modIndex: 3 * density },
    lead_sync: { freq: 440, type: "sync" },
    lead_arp: { freq: 440, type: "arp" },
    // KEYS
    keys_piano: { freq: 262, type: "piano" },
    keys_electric: { freq: 262, type: "electric" },
    keys_organ: { freq: 262, type: "organ" },
    keys_bell: { freq: 262, type: "bell" },
    // FX
    fx_riser: { startFreq: 100, endFreq: 100 + 2000 * (1 + density) },
    fx_impact: { freq: 60 },
    fx_sweep: { startFreq: 5000, endFreq: 500 },
    fx_noise: { amount: 0.5 + density * 0.5 },
    fx_glitch: { freq1: 1000, freq2: 2000 },
    fx_reverse: { startFreq: 200, endFreq: 1200 },
    // JAZZ & SOUL
    jazz_upright: {
      freq: 45,
      buzzAmount: 0.2 * (1 + density),
      decayRate: 3 * coherence,
    },
    jazz_rhodes: {
      freq: 261.63,
      harmonicAmount: 0.2 * (1 + density),
      tremoloSpeed: 6 * phase,
    },
    jazz_trumpet: {
      freq: 440,
      vibratoDepth: 0.02 * (1 + phase),
    },
    jazz_sax: {
      freq: 330,
      breathAmount: 0.1 * (1 + density),
    },
    soul_organ: {
      freq: 261.63,
      leslieSpeed: 4 * phase,
    },
    hiphop_kick: {
      saturation: 2 + density,
    },
    hiphop_snare: {
      crushFactor: 16 - density * 12,
    },
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { tenantId, userId, prompt, params } = body

  // Use provided params or generate random ones
  const entropy = {
    density: params?.density ?? Math.random() * 0.5 + 0.5,
    coherence: params?.coherence ?? Math.random() * 0.5 + 0.5,
    phase: params?.phase ?? Math.random() * 0.5 + 0.5,
    space: params?.space ?? Math.random() * 0.5 + 0.5,
  }

  // Calculate the synthesis configuration on the server
  const synthesisConfig = calculateInstrumentParams(entropy)

  // If we have a user, log the generation
  if (userId) {
    try {
      const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      
      // Create new artifact record
      const { data: created, error } = await supabase
        .from("tokenized_assets")
        .insert({
          tenant_id: tenantId || "default",
          asset_type: "audio_config",
          metadata: {
            entropy,
            synthesisConfig,
            generatedAt: new Date().toISOString(),
            prompt: prompt || "Lattice Generation",
          },
          status: "active",
        })
        .select()
        .single()

      if (!error && created) {
        // Log receipt
        await supabase.from("receipts").insert({
          tenant_id: tenantId || "default",
          user_id: userId,
          action: "lattice_generate",
          artifact_id: created.id,
          metadata: { entropy },
        })
        
        return NextResponse.json({ 
          artifactId: created.id, 
          entropy, 
          synthesisConfig 
        })
      }
    } catch (e) {
      console.error("[v0] Database logging failed, returning config anyway", e)
    }
  }

  // Return config even if logging fails
  return NextResponse.json({ 
    entropy, 
    synthesisConfig 
  })
}
