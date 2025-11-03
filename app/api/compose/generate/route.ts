import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, genre, key, scale } = await req.json()

    // Mock LLM composition - in production, this would call an AI model
    const composition = {
      melody: generateMelody(key, scale),
      chords: generateChords(key, scale, genre),
      rhythm: generateRhythm(genre),
      arrangement: generateArrangement(genre),
      suggestion: `I've created a ${genre} composition in ${key} ${scale}. The melody follows a ${scale} scale with a catchy hook. The chord progression creates tension and release. Try adjusting the BPM or adding more layers!`,
    }

    return NextResponse.json(composition)
  } catch (error) {
    console.error("Composition generation error:", error)
    return NextResponse.json({ error: "Failed to generate composition" }, { status: 500 })
  }
}

function generateMelody(key: number, scale: string): number[] {
  // Generate a simple melodic pattern
  const scaleIntervals = [0, 2, 4, 5, 7, 9, 11]
  const pattern = [0, 2, 4, 2, 0, 4, 7, 4]
  return pattern.map((step) => key + scaleIntervals[step % 7])
}

function generateChords(key: number, scale: string, genre: string): number[][] {
  // Generate chord progression based on genre
  const progressions: Record<string, number[][]> = {
    edm: [
      [key, key + 3, key + 7],
      [key + 5, key + 8, key + 12],
      [key + 3, key + 7, key + 10],
    ],
    hiphop: [
      [key, key + 3, key + 7],
      [key + 5, key + 8, key + 12],
    ],
    house: [
      [key, key + 4, key + 7],
      [key + 7, key + 11, key + 14],
    ],
  }
  return progressions[genre] || progressions.edm
}

function generateRhythm(genre: string): Record<string, boolean[]> {
  const patterns: Record<string, Record<string, boolean[]>> = {
    edm: {
      kick: [
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    },
    hiphop: {
      kick: [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
      snare: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    },
  }
  return patterns[genre] || patterns.edm
}

function generateArrangement(genre: string): string[] {
  return ["intro", "verse", "chorus", "verse", "chorus", "bridge", "chorus", "outro"]
}
