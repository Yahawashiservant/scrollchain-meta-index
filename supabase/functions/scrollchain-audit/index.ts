import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/globals.ts" // Declare Deno variable

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } })
  }

  try {
    const { tenant_id, limit = 50 } = await req.json()

    const { data: receipts, error } = await supabase
      .from("receipts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return new Response(JSON.stringify({ receipts }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }
})
