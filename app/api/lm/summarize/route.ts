import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json()

    // Mock LLM response - in production this would call an actual LLM
    const summary = `Based on the mesh activity, I can see ${context.length} recent events. ${
      question.toLowerCase().includes("change")
        ? "The most recent changes include preset mutations and artifact updates."
        : question.toLowerCase().includes("lineage")
          ? "The artifact lineage shows a chain of mutations from the original kernel."
          : "The mesh is actively processing audio operations and logging receipts."
    }`

    return NextResponse.json({ answer: summary })
  } catch (error) {
    console.error("[v0] LM summarize error:", error)
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 })
  }
}
