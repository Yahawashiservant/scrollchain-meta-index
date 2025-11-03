import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, current_ops, context } = await req.json()

    const refined_ops = [
      ...(current_ops || []),
      { op: "set_eq", channel: "Pad", band: "mid", gain_db: 1, freq: 1200 },
      { op: "set_send", channel: "Lead", fx: "Delay", value: 0.3 },
    ]

    return NextResponse.json({
      refined_ops,
      explanation: `Refined based on: ${prompt}. Added mid-range boost to Pad and increased Lead delay for more depth.`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
