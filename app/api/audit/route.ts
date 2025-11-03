import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch(`${process.env.SUPABASE_URL}/functions/v1/scrollchain-audit`, {
    headers: { apikey: process.env.SUPABASE_ANON_KEY! },
  })
  return NextResponse.json(await res.json(), { status: res.status })
}
