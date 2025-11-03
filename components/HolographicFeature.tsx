"use client"

import type React from "react"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface HolographicFeatureProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  gradient: string
  index: number
  audioLevel?: number
}

export function HolographicFeature({
  icon: Icon,
  title,
  description,
  href,
  gradient,
  index,
  audioLevel = 0,
}: HolographicFeatureProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.01
        p.vy += 0.1 // gravity

        if (p.life > 0) {
          ctx.fillStyle = `rgba(6, 182, 212, ${p.life * 0.6})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
          ctx.fill()
          return true
        }
        return false
      })

      // Add new particles when hovered
      if (isHovered && Math.random() < 0.3) {
        particlesRef.current.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
        })
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [isHovered])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 40,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 40,
    })
  }

  const rotateX = -mousePos.y * 0.5
  const rotateY = mousePos.x * 0.5
  const scale = isHovered ? 1.05 : 1
  const glow = audioLevel * 50 + (isHovered ? 40 : 20)

  return (
    <Link
      href={href}
      className="group relative block"
      style={{
        animation: `float ${3 + index * 0.3}s ease-in-out infinite`,
        animationDelay: `${index * 0.2}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Holographic layers */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: `linear-gradient(135deg, ${gradient})`,
            transform: "translateZ(-20px)",
            filter: `blur(20px) brightness(${1 + audioLevel * 2})`,
          }}
        />
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: `linear-gradient(225deg, ${gradient})`,
            transform: "translateZ(-40px)",
            filter: "blur(30px)",
          }}
        />

        {/* Main panel */}
        <div
          className="relative rounded-2xl p-8 backdrop-blur-xl border-2 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            borderColor: `rgba(6, 182, 212, ${0.3 + audioLevel})`,
            boxShadow: `
              0 0 ${glow}px rgba(6, 182, 212, 0.5),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.2)
            `,
            transform: "translateZ(0)",
          }}
        >
          {/* Animated scan lines */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.1) 2px, rgba(6,182,212,0.1) 4px)",
              animation: "scan 8s linear infinite",
            }}
          />

          {/* Liquid metal effect */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${50 + mousePos.x}% ${50 + mousePos.y}%, rgba(6,182,212,0.4), transparent 60%)`,
              transition: "background 0.3s ease-out",
            }}
          />

          {/* Icon with 3D effect */}
          <div
            className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${gradient})`,
              boxShadow: `0 10px 30px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.3)`,
              transform: `translateZ(20px) scale(${1 + audioLevel * 0.5})`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <Icon className="w-8 h-8 text-white drop-shadow-lg" />
          </div>

          {/* Content */}
          <h3
            className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent"
            style={{
              transform: "translateZ(10px)",
              textShadow: "0 0 20px rgba(6,182,212,0.5)",
            }}
          >
            {title}
          </h3>
          <p
            className="text-gray-300 leading-relaxed"
            style={{
              transform: "translateZ(5px)",
            }}
          >
            {description}
          </p>

          {/* Holographic corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-400/50 rounded-br-2xl" />
        </div>

        {/* Floating particles around the card */}
        <div className="absolute -inset-4 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `orbit ${5 + i}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
                opacity: isHovered ? 0.6 : 0.3,
                boxShadow: "0 0 10px rgba(6,182,212,0.8)",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(30px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(30px) rotate(-360deg);
          }
        }
      `}</style>
    </Link>
  )
}
