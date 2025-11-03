"use client"
import { useState } from "react"

export default function Knob({ label, min = 0, max = 100, initial = 50, onChange, size = "md" }: any) {
  const [value, setValue] = useState(initial)

  function handleChange(e: any) {
    const v = Number(e.target.value)
    setValue(v)
    onChange?.(v)
  }

  const rotation = ((value - min) / (max - min)) * 270 - 135

  const dimensions = size === "sm" ? "w-12 h-12" : "w-16 h-16"
  const indicatorSize = size === "sm" ? "w-1.5 h-4" : "w-2 h-6"
  const indicatorTop = size === "sm" ? "top-1" : "top-1"

  return (
    <div className="flex flex-col items-center w-20">
      <div className={`relative ${dimensions} rounded-full bg-gray-800 border-2 border-gray-600`}>
        <div
          className={`absolute ${indicatorSize} bg-cyan-400 rounded ${indicatorTop}`}
          style={{
            left: "50%",
            transform: `rotate(${rotation}deg) translateX(-50%)`,
            transformOrigin: "bottom center",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
        />
      </div>
      <div className="mt-1 text-xs">{label}</div>
    </div>
  )
}
