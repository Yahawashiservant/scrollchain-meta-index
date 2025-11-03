import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Try to call the Edge Function first
  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/functions/v1/plugin-build`, {
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

  const { tenantId, userId, artifactId, pluginType } = body

  // Fetch the artifact
  const { data: artifact } = await supabase.from("tokenized_assets").select("*").eq("id", artifactId).single()

  if (!artifact) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 })
  }

  // Create plugin artifact
  const pluginArtifact = {
    tenant_id: tenantId,
    asset_type: "plugin",
    metadata: {
      ...artifact.metadata,
      pluginType,
      sourceArtifactId: artifactId,
      builtAt: new Date().toISOString(),
    },
    status: "active",
  }

  const { data: created, error } = await supabase.from("tokenized_assets").insert(pluginArtifact).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log receipt
  await supabase.from("receipts").insert({
    tenant_id: tenantId,
    user_id: userId,
    action: "plugin_build",
    artifact_id: created.id,
    metadata: { pluginType, sourceArtifactId: artifactId },
  })

  return NextResponse.json({ pluginId: created.id, artifactId })
}
