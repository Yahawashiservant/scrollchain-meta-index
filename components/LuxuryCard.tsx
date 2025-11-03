"use client"

import type React from "react"

import { useEffect } from "react"

import type { ReactNode } from "react"
import { useRef, useState } from "react"

interface LuxuryCardProps {
  children: ReactNode
  className?: string
  audioLevel?: number
  delay?: number
}

export function LuxuryCard({ children, className = "", audioLevel = 0, delay = 0 }: LuxuryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${(mousePos.y - 150) / 30}deg) rotateY(${(mousePos.x - 150) / 30}deg) scale(1.02)`
          : "none",
        opacity: isVisible ? 1 : 0,
        transition: isVisible ? "transform 0.1s ease-out" : "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: `
          0 0 ${20 + audioLevel * 40}px rgba(0, 255, 255, ${0.3 + audioLevel * 0.5}),
          0 0 ${40 + audioLevel * 80}px rgba(0, 150, 255, ${0.2 + audioLevel * 0.3}),
          inset 0 0 ${30 + audioLevel * 30}px rgba(255, 255, 255, ${0.05 + audioLevel * 0.1})
        `,
      }}
    >
      {/* Holographic shine effect */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.3), transparent 40%)`,
        }}
      />

      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl" />

      {/* Metallic border */}
      <div
        className="absolute inset-0 rounded-2xl border border-white/20"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Audio-reactive glow */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0, 255, 255, ${audioLevel * 0.3}), transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function IconBox({
  icon: Icon,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>
  gradient: string
}) {
  return (
    <div
      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-110 hover:rotate-3 transition-all duration-500`}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        animation: "float 3s ease-in-out infinite",
      }}
    >
      <Icon className="w-8 h-8 text-white drop-shadow-lg" />
    </div>
  )
}
