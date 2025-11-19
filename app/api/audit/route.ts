import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  // Try to call the Edge Function first
  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/functions/v1/scrollchain-audit`, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY! },
    })

    if (res.ok) {
      return NextResponse.json(await res.json())
    }
  } catch (error) {
    console.log("[v0] Edge Function not available, falling back to direct query")
  }

  // Fallback to direct Supabase query
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    // Try to fetch from receipts table
    const { data: receipts, error } = await supabase
      .from("receipts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      // If receipts table doesn't exist, try audit_logs
      if (error.code === "42P01") {
        const { data: auditLogs } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50)

        return NextResponse.json({ artifacts: auditLogs || [] })
      }
      throw error
    }

    return NextResponse.json({ artifacts: receipts || [] })
  } catch (error: any) {
    console.error("[v0] Failed to fetch audit logs:", error)
    // Return empty array instead of error to prevent UI crash
    return NextResponse.json({ artifacts: [] })
  }
}
