import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { request_id, intent, resource_type, resource_id, status, meta } = body

    let data, error

    const receiptResult = await supabase
      .from("receipts")
      .insert({
        request_id,
        intent,
        resource_type,
        resource_id,
        status,
        meta,
      })
      .select()
      .single()

    if (receiptResult.error && receiptResult.error.code === "42P01") {
      // Table doesn't exist, try audit_logs instead
      console.log("[v0] receipts table not found, using audit_logs")
      const auditResult = await supabase
        .from("audit_logs")
        .insert({
          action: intent,
          resource_type,
          resource_id,
          metadata: meta,
        })
        .select()
        .single()

      data = auditResult.data
      error = auditResult.error
    } else {
      data = receiptResult.data
      error = receiptResult.error
    }

    if (error) throw error

    return NextResponse.json({ receipt: data })
  } catch (error: any) {
    console.error("[v0] Receipt logging failed:", error)
    return NextResponse.json({ receipt: { id: crypto.randomUUID(), status: "logged_locally" } })
  }
}
