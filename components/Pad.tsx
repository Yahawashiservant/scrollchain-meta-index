"use client"
import { useState, useEffect } from "react"

export default function Pad({
  activeColor = "bg-cyan-500",
  active = false,
  isPlaying = false,
  onToggle,
}: {
  activeColor?: string
  active?: boolean
  isPlaying?: boolean
  onToggle?: (active: boolean) => void
}) {
  const [isActive, setIsActive] = useState(active)

  useEffect(() => {
    setIsActive(active)
  }, [active])

  function handleClick() {
    const newState = !isActive
    setIsActive(newState)
    onToggle?.(newState)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        w-10 h-10 rounded-lg border transition-all duration-150
        ${
          isActive
            ? `${activeColor} border-white/20 shadow-[0_0_20px_rgba(34,211,238,0.6)]`
            : "border-white/10 bg-white/[0.06] hover:bg-white/10"
        }
        ${isPlaying ? "ring-2 ring-white scale-110 animate-pulse" : ""}
      `}
    />
  )
}
