import { z } from "zod"

export const evidenceSchema = z.object({
  standard: z.enum(["PMBOK 7", "PRINCE2", "ISO 21500/21502"]),
  section: z.string(), // e.g., "4.3 Tailoring considerations"
  note: z.string().optional(),
})

export const activitySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  deliverables: z.array(z.string()).default([]),
  evidence: z.array(evidenceSchema).default([]),
})

export const phaseSchema = z.object({
  name: z.string(),
  goal: z.string().optional(),
  activities: z.array(activitySchema).default([]),
  exitCriteria: z.array(z.string()).default([]),
})

export const processPlanSchema = z.object({
  scenario: z.string(),
  tailoring: z.object({
    durationMonths: z.number().int().min(0).default(6),
    teamSize: z.number().int().min(0).default(5),
    delivery: z.enum(["agile", "waterfall", "hybrid"]).default("agile"),
    governance: z.enum(["light", "balanced", "strict"]).default("balanced"),
    risk: z.enum(["low", "medium", "high"]).default("medium"),
    regulatory: z.enum(["minimal", "moderate", "heavy"]).default("minimal"),
  }),
  phases: z.array(phaseSchema).default([]),
  summary: z.string().optional(),
})

export type TailoringOptions = z.infer<typeof processPlanSchema>["tailoring"]
export type ProcessPlan = z.infer<typeof processPlanSchema>

export const defaultTailoring: TailoringOptions = {
  durationMonths: 6,
  teamSize: 6,
  delivery: "agile",
  governance: "balanced",
  risk: "medium",
  regulatory: "minimal",
}

export const SCENARIOS = [
  { id: "custom-software", name: "Custom Software Development (≤6 months, ≤7 people)" },
  { id: "innovative-product", name: "Innovative Product Development (emerging tech, discovery-driven)" },
  { id: "construction-infra", name: "Construction / Infrastructure (high compliance)" },
] as const
