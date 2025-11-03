import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/io/mod.ts" // Declaring Deno variable

serve(async (req) => {
  const { tenantId, userId, artifactId, pluginType } = await req.json()

  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "")

  // Fetch the artifact
  const { data: artifact } = await supabase.from("tokenized_assets").select("*").eq("id", artifactId).single()

  if (!artifact) {
    return new Response(JSON.stringify({ error: "Artifact not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Log receipt
  await supabase.from("receipts").insert({
    tenant_id: tenantId,
    user_id: userId,
    action: "plugin_build",
    artifact_id: created.id,
    metadata: { pluginType, sourceArtifactId: artifactId },
  })

  return new Response(JSON.stringify({ pluginId: created.id, artifactId }), {
    headers: { "Content-Type": "application/json" },
  })
})
