"use client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ReceiptsPage() {
  const { data, error } = useSWR("/api/audit", fetcher)
  const receipts = data?.receipts ?? []

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Receipts</h1>
          <p className="text-sm opacity-70">{receipts.length} receipts</p>
        </div>

        {error && (
          <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20 text-red-400">
            Failed to load receipts
          </div>
        )}

        {!data && !error && <div className="text-center py-12 opacity-70">Loading...</div>}

        <div className="space-y-3">
          {receipts.map((r: any) => (
            <div key={r.id} className="rounded-xl backdrop-blur bg-white/5 border border-white/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold mb-1">{r.intent}</div>
                  <div className="text-xs opacity-70 truncate">{r.request_id}</div>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded ${
                    r.status === "done"
                      ? "bg-green-500/20 text-green-400"
                      : r.status === "failed"
                        ? "bg-red-500/20 text-red-400"
                        : r.status === "running"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-white/10"
                  }`}
                >
                  {r.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {receipts.length === 0 && data && <div className="text-center py-12 opacity-70">No receipts yet</div>}
      </div>
    </main>
  )
}
