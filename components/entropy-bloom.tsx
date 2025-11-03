"use client"
import { useEffect, useRef } from "react"

interface EntropyBloomProps {
  dimensions?: number
  density?: number
  phase?: string
}

export function EntropyBloom({ dimensions = 12, density = 0.85, phase = "adaptive" }: EntropyBloomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "rgba(15, 23, 42, 0.1)"
    ctx.fillRect(0, 0, width, height)

    // Draw entropy bloom visualization
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 2 - 20

    // Draw nodes based on dimensions
    const angleStep = (Math.PI * 2) / dimensions
    for (let i = 0; i < dimensions; i++) {
      const angle = i * angleStep
      const radius = maxRadius * (0.5 + Math.random() * 0.5 * density)
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Draw node
      const nodeSize = 4 + density * 6
      ctx.beginPath()
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(147, 197, 253, ${0.3 + density * 0.5})`
      ctx.fill()

      // Draw connection to center
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = `rgba(147, 197, 253, ${0.1 + density * 0.2})`
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw connections to adjacent nodes
      if (i > 0) {
        const prevAngle = (i - 1) * angleStep
        const prevRadius = maxRadius * (0.5 + Math.random() * 0.5 * density)
        const prevX = centerX + Math.cos(prevAngle) * prevRadius
        const prevY = centerY + Math.sin(prevAngle) * prevRadius

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(prevX, prevY)
        ctx.strokeStyle = `rgba(147, 197, 253, ${0.05 + density * 0.1})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    // Draw center node
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(147, 197, 253, 0.8)"
    ctx.fill()

    // Add glow effect
    ctx.shadowBlur = 20
    ctx.shadowColor = "rgba(147, 197, 253, 0.5)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fill()
  }, [dimensions, density, phase])

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl backdrop-blur bg-white/5 border border-white/10 overflow-hidden">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 space-y-1 text-xs">
        <div className="opacity-70">
          Dimensions: <span className="text-white">{dimensions}</span>
        </div>
        <div className="opacity-70">
          Density: <span className="text-white">{(density * 100).toFixed(0)}%</span>
        </div>
        <div className="opacity-70">
          Phase: <span className="text-white">{phase}</span>
        </div>
      </div>
    </div>
  )
}
