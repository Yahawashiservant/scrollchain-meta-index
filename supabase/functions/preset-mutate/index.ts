import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/globals.ts" // Declaring Deno variable

serve(async (req) => {
  const { tenantId, userId, artifactId, ops } = await req.json()

  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "")

  // Fetch the current artifact
  const { data: artifact } = await supabase.from("tokenized_assets").select("*").eq("id", artifactId).single()

  if (!artifact) {
    return new Response(JSON.stringify({ error: "Artifact not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Apply mutations to create new parameters
  const currentParams = artifact.metadata?.params || {}
  const newParams = { ...currentParams }

  // Apply each operation
  for (const op of ops) {
    if (op.path && op.value !== undefined) {
      newParams[op.path] = op.value
    }
  }

  // Create new artifact with updated parameters
  const newArtifact = {
    tenant_id: tenantId,
    asset_type: "audio",
    metadata: {
      ...artifact.metadata,
      params: newParams,
      parentId: artifactId,
      mutatedAt: new Date().toISOString(),
    },
    status: "active",
  }

  const { data: created, error } = await supabase.from("tokenized_assets").insert(newArtifact).select().single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Log receipt
  await supabase.from("receipts").insert({
    tenant_id: tenantId,
    user_id: userId,
    action: "preset_mutate",
    artifact_id: created.id,
    metadata: { ops, parentId: artifactId },
  })

  return new Response(JSON.stringify({ artifactId: created.id, params: newParams }), {
    headers: { "Content-Type": "application/json" },
  })
})
