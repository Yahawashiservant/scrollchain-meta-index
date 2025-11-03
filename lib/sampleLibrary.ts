export const SAMPLE_LIBRARY = {
  Drum: {
    kick: "https://cdn.freesound.org/previews/171/171104_2437358-lq.mp3",
    snare: "https://cdn.freesound.org/previews/387/387186_7255534-lq.mp3",
    hihat: "https://cdn.freesound.org/previews/536/536549_11935698-lq.mp3",
    clap: "https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3",
  },
  Bass: {
    sub: "https://cdn.freesound.org/previews/456/456344_9497060-lq.mp3",
    wobble: "https://cdn.freesound.org/previews/442/442943_9081243-lq.mp3",
  },
  Lead: {
    synth: "https://cdn.freesound.org/previews/413/413749_7517869-lq.mp3",
    pluck: "https://cdn.freesound.org/previews/456/456344_9497060-lq.mp3",
  },
  Pad: {
    ambient: "https://cdn.freesound.org/previews/442/442943_9081243-lq.mp3",
    warm: "https://cdn.freesound.org/previews/413/413749_7517869-lq.mp3",
  },
}

export type SampleCategory = keyof typeof SAMPLE_LIBRARY
export type SampleName<T extends SampleCategory> = keyof (typeof SAMPLE_LIBRARY)[T]
