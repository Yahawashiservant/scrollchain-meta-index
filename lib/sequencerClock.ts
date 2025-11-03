export class SequencerClock {
  ctx: AudioContext
  bpm = 120
  isPlaying = false
  currentStep = 0
  totalSteps = 16
  onStep?: (step: number) => void
  private nextStepTime = 0
  private scheduleAheadTime = 0.1
  private timerID: number | null = null

  constructor(ctx: AudioContext) {
    this.ctx = ctx
  }

  start() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.currentStep = 0
    this.nextStepTime = this.ctx.currentTime
    this.schedule()
  }

  stop() {
    this.isPlaying = false
    if (this.timerID) {
      clearTimeout(this.timerID)
      this.timerID = null
    }
    this.currentStep = 0
  }

  private schedule() {
    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextStepTime)
      this.nextStep()
    }
    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => this.schedule(), 25)
    }
  }

  private scheduleStep(step: number, time: number) {
    // Trigger callback at the scheduled time
    const delay = (time - this.ctx.currentTime) * 1000
    setTimeout(
      () => {
        if (this.onStep) this.onStep(step)
      },
      Math.max(0, delay),
    )
  }

  private nextStep() {
    const secondsPerBeat = 60.0 / this.bpm
    const secondsPerStep = secondsPerBeat / 4 // 16th notes
    this.nextStepTime += secondsPerStep
    this.currentStep = (this.currentStep + 1) % this.totalSteps
  }

  setBPM(bpm: number) {
    this.bpm = bpm
  }
}
