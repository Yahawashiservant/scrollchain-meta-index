import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${process.env.SUPABASE_URL}/functions/v1/rentals-stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: process.env.SUPABASE_ANON_KEY! },
    body: JSON.stringify(body),
  })
  return NextResponse.json(await res.json(), { status: res.status })
}
