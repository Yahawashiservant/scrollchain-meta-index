"use client"

import { useEffect, useRef } from "react"

interface AudioReactiveBackgroundProps {
  audioContext?: AudioContext
  analyser?: AnalyserNode
}

export function AudioReactiveBackground({ audioContext, analyser }: AudioReactiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Particle system
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      hue: number
      alpha: number
    }> = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        hue: Math.random() * 60 + 180, // Cyan to blue range
        alpha: Math.random() * 0.5 + 0.3,
      })
    }

    let dataArray: Uint8Array | null = null
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount)
    }

    const animate = () => {
      // Fade previous frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Get audio data
      let avgFrequency = 0
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray)
        avgFrequency = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx * (1 + avgFrequency * 2)
        p.y += p.vy * (1 + avgFrequency * 2)

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle with glow
        const size = p.size * (1 + avgFrequency * 3)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3)
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.alpha * (1 + avgFrequency)})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 50%, ${p.alpha * 0.5 * (1 + avgFrequency)})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(p.x - size * 3, p.y - size * 3, size * 6, size * 6)
      })

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * (1 + avgFrequency)})`
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [audioContext, analyser])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ mixBlendMode: "screen" }} />
}

export default AudioReactiveBackground
