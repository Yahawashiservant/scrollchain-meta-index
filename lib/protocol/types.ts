import { z } from "zod"

// Canonical operation types for ScrollChain lattice entropy system
export const MixOpSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("set_gain"), channel: z.string(), value: z.number().min(0).max(1) }),
  z.object({ type: z.literal("set_pan"), channel: z.string(), value: z.number().min(-1).max(1) }),
  z.object({ type: z.literal("mute"), channel: z.string() }),
  z.object({ type: z.literal("unmute"), channel: z.string() }),
])

export const EntropyOpSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("set_density"), channel: z.string(), value: z.number().min(0).max(1) }),
  z.object({ type: z.literal("set_coherence"), channel: z.string(), value: z.number().min(0).max(1) }),
  z.object({ type: z.literal("set_phase_mode"), channel: z.string(), value: z.enum(["aligned", "random", "inverse"]) }),
  z.object({ type: z.literal("set_space"), channel: z.string(), value: z.number().min(0).max(1) }),
])

export const PatternOpSchema = z.object({
  type: z.literal("apply_pattern"),
  channel: z.string(),
  pattern: z.array(z.boolean()).length(16),
})

export const FxOpSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("set_send"),
    channel: z.string(),
    bus: z.enum(["reverb", "delay"]),
    value: z.number().min(0).max(1),
  }),
  z.object({ type: z.literal("set_fx_out"), bus: z.enum(["reverb", "delay"]), value: z.number().min(0).max(1) }),
])

export const InsertOpSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("set_eq"),
    channel: z.string(),
    band: z.enum(["low", "mid", "high"]),
    gain: z.number().min(-12).max(12),
  }),
  z.object({
    type: z.literal("set_comp"),
    channel: z.string(),
    threshold: z.number().min(-60).max(0),
    ratio: z.number().min(1).max(20),
    attack: z.number().min(0).max(100),
    release: z.number().min(0).max(1000),
  }),
  z.object({ type: z.literal("set_insert_position"), channel: z.string(), position: z.number().int().min(0) }),
])

export const MasterOpSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("set_multiband"),
    band: z.enum(["low", "mid", "high"]),
    threshold: z.number().min(-60).max(0),
    ratio: z.number().min(1).max(20),
  }),
  z.object({
    type: z.literal("set_limiter"),
    threshold: z.number().min(-12).max(0),
    release: z.number().min(0).max(1000),
  }),
])

export const SessionOpSchema = z.object({
  type: z.literal("set_session_map"),
  map: z.record(z.string(), z.string().uuid()),
})

export const PlaylistOpSchema = z.object({
  type: z.literal("set_scene_playlist"),
  scenes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      sessionMap: z.record(z.string(), z.string().uuid()),
      duration: z.number().optional(),
    }),
  ),
})

export const CanonicalOpSchema = z.discriminatedUnion("category", [
  z.object({ category: z.literal("mix"), op: MixOpSchema }),
  z.object({ category: z.literal("entropy"), op: EntropyOpSchema }),
  z.object({ category: z.literal("pattern"), op: PatternOpSchema }),
  z.object({ category: z.literal("fx"), op: FxOpSchema }),
  z.object({ category: z.literal("insert"), op: InsertOpSchema }),
  z.object({ category: z.literal("master"), op: MasterOpSchema }),
  z.object({ category: z.literal("session"), op: SessionOpSchema }),
  z.object({ category: z.literal("playlist"), op: PlaylistOpSchema }),
])

export const MutationRequestSchema = z.object({
  request_id: z.string().uuid(),
  tenant_id: z.string(),
  artifact_id: z.string().uuid().optional(),
  ops: z.array(CanonicalOpSchema),
  intent: z.string().optional(),
})

export const ReceiptSchema = z.object({
  id: z.string().uuid(),
  request_id: z.string().uuid(),
  intent: z.string().optional(),
  resource_type: z.enum(["artifact", "preset", "session", "scene"]),
  resource_id: z.string().uuid(),
  status: z.enum(["accepted", "rejected", "pending"]),
  meta: z.record(z.any()),
  created_at: z.string().datetime(),
})

export type MixOp = z.infer<typeof MixOpSchema>
export type EntropyOp = z.infer<typeof EntropyOpSchema>
export type PatternOp = z.infer<typeof PatternOpSchema>
export type FxOp = z.infer<typeof FxOpSchema>
export type InsertOp = z.infer<typeof InsertOpSchema>
export type MasterOp = z.infer<typeof MasterOpSchema>
export type SessionOp = z.infer<typeof SessionOpSchema>
export type PlaylistOp = z.infer<typeof PlaylistOpSchema>
export type CanonicalOp = z.infer<typeof CanonicalOpSchema>
export type MutationRequest = z.infer<typeof MutationRequestSchema>
export type Receipt = z.infer<typeof ReceiptSchema>
