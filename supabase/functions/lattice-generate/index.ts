import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/io/mod.ts" // Declaring Deno variable

serve(async (req) => {
  const { tenantId, userId, prompt, params } = await req.json()

  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "")

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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Log receipt
  await supabase.from("receipts").insert({
    tenant_id: tenantId,
    user_id: userId,
    action: "lattice_generate",
    artifact_id: created.id,
    metadata: { prompt, params: generatedParams },
  })

  return new Response(JSON.stringify({ artifactId: created.id, params: generatedParams }), {
    headers: { "Content-Type": "application/json" },
  })
})
