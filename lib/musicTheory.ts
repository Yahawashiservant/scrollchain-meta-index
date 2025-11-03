export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
}

export const CHORD_TYPES = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10],
}

export const GENRE_TEMPLATES = {
  edm: {
    bpm: 128,
    scale: "minor",
    chords: ["i", "VI", "III", "VII"],
    drums: ["Kick", "Snare", "Hi-Hat Closed", "Clap"],
    bass: "Sub Bass",
  },
  hiphop: {
    bpm: 90,
    scale: "minor",
    chords: ["i", "iv", "VII", "VI"],
    drums: ["Kick", "Snare", "Hi-Hat Closed", "Rim"],
    bass: "808 Bass",
  },
  house: {
    bpm: 125,
    scale: "major",
    chords: ["I", "V", "vi", "IV"],
    drums: ["Kick", "Snare", "Hi-Hat Closed", "Hi-Hat Open"],
    bass: "Synth Bass",
  },
  trap: {
    bpm: 140,
    scale: "minor",
    chords: ["i", "VI", "III", "VII"],
    drums: ["Kick", "Snare", "Hi-Hat Closed", "Rim"],
    bass: "808 Bass",
  },
  lofi: {
    bpm: 85,
    scale: "major",
    chords: ["I", "vi", "IV", "V"],
    drums: ["Kick", "Snare", "Hi-Hat Closed", "Rim"],
    bass: "Sub Bass",
  },
}

export function noteToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12)
}

export function getScaleNotes(root: number, scale: keyof typeof SCALES): number[] {
  return SCALES[scale].map((interval) => root + interval)
}

export function getChordNotes(root: number, type: keyof typeof CHORD_TYPES): number[] {
  return CHORD_TYPES[type].map((interval) => root + interval)
}

export function generateProgression(key: number, scale: keyof typeof SCALES, pattern: string[]): number[][] {
  const scaleNotes = getScaleNotes(key, scale)
  const romanToIndex: Record<string, number> = {
    I: 0,
    i: 0,
    II: 1,
    ii: 1,
    III: 2,
    iii: 2,
    IV: 3,
    iv: 3,
    V: 4,
    v: 4,
    VI: 5,
    vi: 5,
    VII: 6,
    vii: 6,
  }

  return pattern.map((roman) => {
    const index = romanToIndex[roman]
    const root = scaleNotes[index]
    const isMinor = roman === roman.toLowerCase()
    return getChordNotes(root, isMinor ? "minor" : "major")
  })
}
