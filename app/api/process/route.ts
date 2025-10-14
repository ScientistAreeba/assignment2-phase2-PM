import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { z } from "zod"
import { processPlanSchema, type ProcessPlan } from "@/lib/process-schema"

const bodySchema = z.object({
  scenario: z.string(),
  tailoring: processPlanSchema.shape.tailoring,
  customContext: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { scenario, tailoring, customContext } = bodySchema.parse(body)

    const system = `
You are a PM standards expert. Produce an evidence-based process plan by synthesizing PMBOK 7, PRINCE2, and ISO 21500/21502.
Tailor recommendations based on the provided scenario and tailoring options. Cite evidence sections precisely.
Return ONLY valid JSON matching this TypeScript type:

type Evidence = { standard: "PMBOK 7" | "PRINCE2" | "ISO 21500/21502", section: string, note?: string }
type Activity = { name: string, description?: string, deliverables?: string[], evidence?: Evidence[] }
type Phase = { name: string, goal?: string, activities: Activity[], exitCriteria?: string[] }
type Plan = {
  scenario: string,
  tailoring: { durationMonths: number, teamSize: number, delivery: "agile"|"waterfall"|"hybrid", governance: "light"|"balanced"|"strict", risk: "low"|"medium"|"high", regulatory: "minimal"|"moderate"|"heavy" },
  summary?: string,
  phases: Phase[]
}
`

    const user = `
Scenario: ${scenario}
Tailoring:
- Duration (months): ${tailoring.durationMonths}
- Team size: ${tailoring.teamSize}
- Delivery: ${tailoring.delivery}
- Governance: ${tailoring.governance}
- Risk: ${tailoring.risk}
- Regulatory: ${tailoring.regulatory}
${customContext ? `Additional Context: ${customContext}` : ""}

Constraints:
- 4 to 6 phases max.
- 3 to 5 activities per phase.
- Use concise names.
- Include deliverables and evidence for each activity where relevant.
- Evidence should reference plausible sections, e.g., "PMBOK 7: 4.3 Tailoring" or "PRINCE2: Managing Product Delivery".
`

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      system,
      prompt: user,
    })

    // Attempt to parse JSON even if extra text is included
    const jsonString = extractJson(text)
    const parsed = JSON.parse(jsonString)
    const plan: ProcessPlan = processPlanSchema.parse(parsed)

    return NextResponse.json(plan)
  } catch (err: any) {
    // console.log("[v0] Error in /api/process:", err?.message)
    return new NextResponse(err?.message || "Invalid request", { status: 400 })
  }
}

function extractJson(s: string): string {
  const match = s.match(/\{[\s\S]*\}$/)
  if (match) return match[0]
  // Fallback: find first { and last }
  const first = s.indexOf("{")
  const last = s.lastIndexOf("}")
  if (first !== -1 && last !== -1 && last > first) {
    return s.slice(first, last + 1)
  }
  return s // will throw JSON.parse and surface error
}
