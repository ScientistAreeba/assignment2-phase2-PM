"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Copy } from "lucide-react"
import type { ProcessPlan } from "@/lib/process-schema"

export function ProcessPlanView({ plan }: { plan?: ProcessPlan }) {
  const [copied, setCopied] = useState(false)
  const json = useMemo(() => (plan ? JSON.stringify(plan, null, 2) : ""), [plan])

  if (!plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No plan yet</CardTitle>
          <CardDescription>Use the controls above to generate a tailored process plan.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const copy = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${plan.scenario}-process-plan.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tailored Process Plan</CardTitle>
        <CardDescription>
          Scenario: <span className="font-medium">{plan.scenario}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            Approach: <strong className="text-foreground">{plan.tailoring.delivery}</strong>
          </span>
          <Separator orientation="vertical" />
          <span>
            Governance: <strong className="text-foreground">{plan.tailoring.governance}</strong>
          </span>
          <Separator orientation="vertical" />
          <span>
            Risk: <strong className="text-foreground">{plan.tailoring.risk}</strong>
          </span>
          <Separator orientation="vertical" />
          <span>
            Regulatory: <strong className="text-foreground">{plan.tailoring.regulatory}</strong>
          </span>
          <Separator orientation="vertical" />
          <span>
            Duration: <strong className="text-foreground">{plan.tailoring.durationMonths}m</strong>
          </span>
          <Separator orientation="vertical" />
          <span>
            Team: <strong className="text-foreground">{plan.tailoring.teamSize}</strong>
          </span>
        </div>

        {plan.summary ? <p className="text-pretty">{plan.summary}</p> : null}

        <Accordion type="multiple" className="w-full">
          {plan.phases.map((p, idx) => (
            <AccordionItem key={idx} value={`phase-${idx}`}>
              <AccordionTrigger className="text-left">{p.name}</AccordionTrigger>
              <AccordionContent>
                {p.goal ? <p className="mb-2 text-sm text-muted-foreground">{p.goal}</p> : null}
                <ul className="mb-4 list-disc pl-6">
                  {p.activities.map((a, i) => (
                    <li key={i} className="mb-3">
                      <div className="font-medium">{a.name}</div>
                      {a.description ? <div className="text-muted-foreground text-sm">{a.description}</div> : null}
                      {a.deliverables?.length ? (
                        <div className="mt-1 text-sm">
                          Deliverables: <span className="text-foreground">{a.deliverables.join(", ")}</span>
                        </div>
                      ) : null}
                      {a.evidence?.length ? (
                        <div className="mt-1 text-sm">
                          Evidence:{" "}
                          <span className="text-foreground">
                            {a.evidence.map((e) => `${e.standard} – ${e.section}`).join("; ")}
                          </span>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {p.exitCriteria?.length ? (
                  <div className="text-sm">
                    Exit criteria: <span className="text-foreground">{p.exitCriteria.join(", ")}</span>
                  </div>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={copy}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy JSON"}
          </Button>
          <Button onClick={download}>Download JSON</Button>
        </div>
      </CardContent>
    </Card>
  )
}
