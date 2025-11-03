"use client"
export default function Meter({ level = 0 }: { level: number }) {
  const bars = Array.from({ length: 10 })
  return (
    <div className="flex flex-col-reverse gap-0.5 h-32 w-4 bg-gray-900 p-0.5 rounded">
      {bars.map((_, i) => {
        const active = i * 10 < level
        const color = i < 6 ? "bg-green-500" : i < 8 ? "bg-yellow-400" : "bg-red-500"
        return <div key={i} className={`h-2 w-full rounded-sm ${active ? color : "bg-gray-700"}`} />
      })}
    </div>
  )
}
