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

    let plan: ProcessPlan
    try {
      const { text } = await generateText({
        model: "openai/gpt-5-mini",
        system,
        prompt: user,
      })

      console.log("[v0] /api/process raw length:", text?.length ?? 0)

      const jsonString = extractJson(text)
      const parsed = JSON.parse(jsonString)
      plan = processPlanSchema.parse(parsed)
    } catch (aiError: any) {
      console.log("[v0] AI generation failed, using fallback template:", aiError?.message)
      plan = buildFallbackPlan(scenario, tailoring, customContext)
    }

    return NextResponse.json(plan)
  } catch (err: any) {
    console.log("[v0] Error in /api/process:", err?.message)
    return new NextResponse(err?.message || "Invalid request", { status: 400 })
  }
}

function extractJson(s: string): string {
  // prefer fenced ```json blocks when present
  const fenced = s.match(/```json([\s\S]*?)```/i)
  if (fenced?.[1]) return fenced[1].trim()
  // fallback: last closing brace
  const match = s.match(/\{[\s\S]*\}$/)
  if (match) return match[0]
  const first = s.indexOf("{")
  const last = s.lastIndexOf("}")
  if (first !== -1 && last !== -1 && last > first) {
    return s.slice(first, last + 1)
  }
  return s
}

function buildFallbackPlan(scenario: string, tailoring: ProcessPlan["tailoring"], customContext?: string): ProcessPlan {
  const isAgile = tailoring.delivery === "agile"
  const isWaterfall = tailoring.delivery === "waterfall"
  const isHybrid = tailoring.delivery === "hybrid"

  return {
    scenario,
    tailoring,
    summary: `This is a template plan for ${scenario}. Tailored for ${tailoring.delivery} delivery with ${tailoring.governance} governance. ${customContext ? `Context: ${customContext}` : ""}`,
    phases: [
      {
        name: "Initiation",
        goal: "Define project scope, objectives, and stakeholder alignment",
        activities: [
          {
            name: "Develop Project Charter",
            description: "Document high-level scope, objectives, stakeholders, and success criteria",
            deliverables: ["Project Charter", "Stakeholder Register"],
            evidence: [
              { standard: "PMBOK 7", section: "4.2 Project Initiation", note: "Charter establishes authority" },
              { standard: "PRINCE2", section: "Starting Up a Project", note: "Defines project mandate" },
            ],
          },
          {
            name: "Identify Stakeholders",
            description: "Map all stakeholders, their interests, and influence levels",
            deliverables: ["Stakeholder Analysis Matrix"],
            evidence: [{ standard: "PMBOK 7", section: "2.1 Stakeholder Engagement" }],
          },
          {
            name: "Define Success Criteria",
            description: "Establish measurable success metrics and acceptance criteria",
            deliverables: ["Success Criteria Document"],
            evidence: [{ standard: "ISO 21500/21502", section: "4.3.2 Project Objectives" }],
          },
        ],
        exitCriteria: ["Approved charter", "Stakeholder buy-in", "Defined success metrics"],
      },
      {
        name: "Planning",
        goal: "Create detailed plans for scope, schedule, budget, and risk management",
        activities: [
          {
            name: "Develop WBS and Schedule",
            description: "Break down work into manageable packages and create timeline",
            deliverables: ["Work Breakdown Structure", "Project Schedule", "Gantt Chart"],
            evidence: [
              { standard: "PMBOK 7", section: "5.3 Schedule Management" },
              { standard: "ISO 21500/21502", section: "4.3.3 Scope and Deliverables" },
            ],
          },
          {
            name: "Establish Budget",
            description: "Estimate costs and allocate budget across phases and resources",
            deliverables: ["Budget Baseline", "Cost Estimates"],
            evidence: [{ standard: "PMBOK 7", section: "5.4 Cost Management" }],
          },
          {
            name: "Risk Assessment and Mitigation",
            description: "Identify, analyze, and plan responses for project risks",
            deliverables: ["Risk Register", "Risk Response Plan"],
            evidence: [
              { standard: "PRINCE2", section: "Risk Theme", note: "Continuous risk management" },
              { standard: "ISO 21500/21502", section: "4.3.5 Risk" },
            ],
          },
          ...(tailoring.governance !== "light"
            ? [
                {
                  name: "Quality and Compliance Planning",
                  description: "Define quality standards and regulatory compliance requirements",
                  deliverables: ["Quality Management Plan", "Compliance Checklist"],
                  evidence: [{ standard: "ISO 21500/21502", section: "4.3.6 Quality" }],
                },
              ]
            : []),
        ],
        exitCriteria: ["Approved project plan", "Budget sign-off", "Risk register baselined"],
      },
      {
        name: isAgile ? "Sprint Execution" : "Execution",
        goal: isAgile
          ? "Deliver incremental value through iterative sprints"
          : "Execute work packages and produce deliverables",
        activities: [
          {
            name: isAgile ? "Sprint Planning and Daily Standups" : "Execute Work Packages",
            description: isAgile
              ? "Plan sprint backlog, conduct daily standups, and track progress"
              : "Complete planned activities and produce deliverables per schedule",
            deliverables: isAgile ? ["Sprint Backlog", "Increment", "Burndown Chart"] : ["Deliverables per WBS"],
            evidence: [
              { standard: "PMBOK 7", section: "3.3 Agile and Adaptive Approaches" },
              { standard: "PRINCE2", section: "Managing Product Delivery" },
            ],
          },
          {
            name: "Team Collaboration and Communication",
            description: "Facilitate team coordination and stakeholder communication",
            deliverables: ["Status Reports", "Meeting Minutes"],
            evidence: [{ standard: "PMBOK 7", section: "2.2 Team Management" }],
          },
          {
            name: "Change Control",
            description: "Assess and approve changes to scope, schedule, or budget",
            deliverables: ["Change Requests", "Change Log"],
            evidence: [
              { standard: "PRINCE2", section: "Change Theme" },
              { standard: "ISO 21500/21502", section: "4.3.8 Change" },
            ],
          },
        ],
        exitCriteria: isAgile
          ? ["Increment accepted", "Sprint retrospective completed"]
          : ["All deliverables completed", "Stakeholder approval"],
      },
      {
        name: "Monitoring & Control",
        goal: "Track progress, manage variances, and ensure alignment with plan",
        activities: [
          {
            name: "Performance Monitoring",
            description: "Track schedule, cost, scope, and quality performance",
            deliverables: ["Performance Reports", "Earned Value Analysis"],
            evidence: [
              { standard: "PMBOK 7", section: "5.5 Monitoring and Controlling" },
              { standard: "ISO 21500/21502", section: "4.3.10 Monitoring and Control" },
            ],
          },
          {
            name: "Risk and Issue Management",
            description: "Monitor risks and resolve issues as they arise",
            deliverables: ["Updated Risk Register", "Issue Log"],
            evidence: [{ standard: "PRINCE2", section: "Risk Theme" }],
          },
          ...(tailoring.governance !== "light"
            ? [
                {
                  name: "Quality Assurance Reviews",
                  description: "Conduct audits and reviews to ensure quality standards",
                  deliverables: ["Audit Reports", "QA Checklists"],
                  evidence: [{ standard: "ISO 21500/21502", section: "4.3.6 Quality" }],
                },
              ]
            : []),
        ],
        exitCriteria: ["Performance on track", "Risks mitigated", "Quality validated"],
      },
      {
        name: "Closure",
        goal: "Formalize project completion, handover deliverables, and capture lessons learned",
        activities: [
          {
            name: "Final Deliverable Handover",
            description: "Transfer deliverables to stakeholders and obtain sign-off",
            deliverables: ["Handover Documentation", "Acceptance Sign-off"],
            evidence: [
              { standard: "PMBOK 7", section: "4.7 Project Closure" },
              { standard: "PRINCE2", section: "Closing a Project" },
            ],
          },
          {
            name: "Lessons Learned and Retrospective",
            description: "Document successes, failures, and recommendations for future projects",
            deliverables: ["Lessons Learned Report"],
            evidence: [{ standard: "ISO 21500/21502", section: "4.3.11 Closure" }],
          },
          {
            name: "Release Resources and Archive",
            description: "Release team members and archive project documentation",
            deliverables: ["Resource Release Memo", "Project Archive"],
            evidence: [{ standard: "PMBOK 7", section: "4.7 Project Closure" }],
          },
        ],
        exitCriteria: ["Deliverables accepted", "Lessons documented", "Resources released"],
      },
    ],
  }
}
