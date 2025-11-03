"use client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AuditFooter() {
  const { data } = useSWR("/api/audit", fetcher, { refreshInterval: 5000 })
  const receipts = data?.receipts?.slice(0, 5) ?? []

  if (receipts.length === 0) return null

  return (
    <div className="border-t border-white/10 backdrop-blur bg-white/5">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider opacity-70">Recent activity</div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {receipts.map((receipt: any) => (
              <div
                key={receipt.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs whitespace-nowrap"
              >
                <span className="opacity-70">{receipt.intent}</span>
                <span className="text-blue-400">{receipt.id.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
