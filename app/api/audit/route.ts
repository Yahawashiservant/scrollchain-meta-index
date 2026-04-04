import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  // Always return valid JSON - never throw
  const emptyResponse = { artifacts: [] }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(emptyResponse)
    }

    // Try Edge Function first (with timeout)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)

      const res = await fetch(`${supabaseUrl}/functions/v1/scrollchain-audit`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (res.ok) {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          if (data.artifacts) {
            return NextResponse.json(data)
          }
        } catch {
          // Not valid JSON, continue to fallback
        }
      }
    } catch {
      console.log("[v0] Edge Function not available, falling back to direct query")
    }

    // Direct Supabase query fallback
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try artifacts table first
    const { data: artifacts, error: artifactsError } = await supabase
      .from("artifacts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (!artifactsError && artifacts && artifacts.length > 0) {
      return NextResponse.json({ artifacts })
    }

    // Try receipts table
    const { data: receipts, error: receiptsError } = await supabase
      .from("receipts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (!receiptsError && receipts && receipts.length > 0) {
      return NextResponse.json({ artifacts: receipts })
    }

    // Try audit_logs table
    const { data: auditLogs, error: auditError } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (!auditError && auditLogs && auditLogs.length > 0) {
      return NextResponse.json({ artifacts: auditLogs })
    }

    // No data found in any table - return empty
    return NextResponse.json(emptyResponse)
  } catch (error) {
    // Catch-all: always return valid JSON
    return NextResponse.json(emptyResponse)
  }
}
