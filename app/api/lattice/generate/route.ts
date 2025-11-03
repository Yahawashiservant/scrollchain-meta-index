import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Try to call the Edge Function first
  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/functions/v1/lattice-generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: process.env.SUPABASE_ANON_KEY! },
      body: JSON.stringify(body),
    })

    if (res.status !== 404) {
      return NextResponse.json(await res.json(), { status: res.status })
    }
  } catch (error) {
    console.log("[v0] Edge Function not available, using mock implementation")
  }

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { tenantId, userId, prompt, params } = body

  // Generate random parameters for the lattice
  const generatedParams = {
    density: params?.density || Math.random() * 0.5 + 0.5,
    coherence: params?.coherence || Math.random() * 0.5 + 0.5,
    phaseMode: params?.phaseMode || ["aligned", "random", "spiral"][Math.floor(Math.random() * 3)],
    space: params?.space || Math.random() * 0.5 + 0.5,
    prompt: prompt || "Generated lattice",
  }

  // Create new artifact
  const newArtifact = {
    tenant_id: tenantId,
    asset_type: "audio",
    metadata: {
      params: generatedParams,
      generatedAt: new Date().toISOString(),
      prompt,
    },
    status: "active",
  }

  const { data: created, error } = await supabase.from("tokenized_assets").insert(newArtifact).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log receipt
  await supabase.from("receipts").insert({
    tenant_id: tenantId,
    user_id: userId,
    action: "lattice_generate",
    artifact_id: created.id,
    metadata: { prompt, params: generatedParams },
  })

  return NextResponse.json({ artifactId: created.id, params: generatedParams })
}
