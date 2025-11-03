export async function postJSON(url: string, payload: any) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      let errorMessage = data?.error || data?.message || "request_failed"

      // Provide helpful message for missing Edge Functions
      if (res.status === 404 && data?.code === "NOT_FOUND") {
        errorMessage = "Edge Function not deployed yet. This feature requires Supabase Edge Functions to be deployed."
      }

      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    console.error("[v0] API request failed:", error)
    throw error
  }
}

export function requestId() {
  return crypto.randomUUID()
}
