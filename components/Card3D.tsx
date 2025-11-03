"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"

export function Card3D({
  children,
  className = "",
  glowColor = "cyan",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  glowColor?: "cyan" | "blue" | "purple" | "emerald" | "orange" | "green"
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const glowColors = {
    cyan: "group-hover:shadow-[0_20px_60px_-15px_rgba(6,182,212,0.5)]",
    blue: "group-hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)]",
    purple: "group-hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.5)]",
    emerald: "group-hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.5)]",
    orange: "group-hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.5)]",
    green: "group-hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.5)]",
  }

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
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0.5, y: 0.5 })
  }

  const tiltX = (mousePosition.y - 0.5) * -10
  const tiltY = (mousePosition.x - 0.5) * 10

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/20 backdrop-blur-xl p-8 transition-all duration-500 ${glowColors[glowColor]} ${className}`}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(0) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1)`
          : "translateY(30px) perspective(1000px) rotateX(0deg) rotateY(0deg) scale(0.95)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.1), transparent 50%)`,
        }}
      />

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Bottom reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 2s infinite",
        }}
      />
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
      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        animation: "float 3s ease-in-out infinite",
      }}
    >
      <Icon className="w-8 h-8 text-white drop-shadow-lg" />
    </div>
  )
}
