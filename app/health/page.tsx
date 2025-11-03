"use client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function HealthPage() {
  const { data, error } = useSWR("/api/health", fetcher, { refreshInterval: 5000 })
  const checks = data?.checks ?? []

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-sm opacity-70">Real-time monitoring</p>
        </div>

        {error && (
          <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20 text-red-400">
            Failed to load health status
          </div>
        )}

        {!data && !error && <div className="text-center py-12 opacity-70">Loading...</div>}

        {data && (
          <>
            <div className="rounded-xl backdrop-blur bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    Heartbeat:{" "}
                    <span className={data.heartbeat === "OK" ? "text-green-400" : "text-red-400"}>
                      {data.heartbeat ?? "unknown"}
                    </span>
                  </div>
                  <div className="text-sm opacity-70 mt-1">{data.timestamp}</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full ${
                    data.heartbeat === "OK" ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checks.map((c: any, i: number) => (
                <div key={i} className="rounded-xl backdrop-blur bg-white/5 border border-white/10 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold mb-1">{c.scope}</div>
                      {c.detail && <div className="text-xs opacity-70 break-words">{c.detail}</div>}
                    </div>
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        c.status === "OK" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {c.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {checks.length === 0 && data && <div className="text-center py-12 opacity-70">No health checks available</div>}
      </div>
    </main>
  )
}
