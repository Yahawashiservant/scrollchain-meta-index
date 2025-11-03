"use client"
import { useState } from "react"

export default function Fader({ label, initial = 75, onChange }: any) {
  const [value, setValue] = useState(initial)

  function handleChange(e: any) {
    const v = Number(e.target.value)
    setValue(v)
    onChange?.(v)
  }

  return (
    <div className="flex flex-col items-center w-16 bg-gray-900 border border-gray-700 p-2 rounded">
      <div className="h-32 w-4 bg-gray-800 relative rounded">
        <div
          className="absolute bottom-0 w-4 bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 rounded"
          style={{ height: `${value}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          style={{ writingMode: "bt-lr" } as any}
        />
      </div>
      <div className="mt-2 text-xs">{label}</div>
    </div>
  )
}
