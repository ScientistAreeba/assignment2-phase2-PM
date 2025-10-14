"use client"

import { useMemo, useState } from "react"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { type ProcessPlan, defaultTailoring, type TailoringOptions, SCENARIOS } from "@/lib/process-schema"
import { ProcessPlanView } from "@/components/phase2/process-plan"
import { ScenarioSelector } from "@/components/phase2/scenario-selector"

// Simple fetcher for SWR Mutation
async function generateProcess(
  url: string,
  { arg }: { arg: { scenario: string; tailoring: TailoringOptions; customContext?: string } },
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to generate process")
  }
  return (await res.json()) as ProcessPlan
}

export default function PhaseTwoPage() {
  const [scenario, setScenario] = useState<string>(SCENARIOS[0].id)
  const [tailoring, setTailoring] = useState<TailoringOptions>(defaultTailoring)
  const [customContext, setCustomContext] = useState<string>("")

  const { trigger, isMutating, data } = useSWRMutation("/api/process", generateProcess)

  const selectedScenario = useMemo(() => SCENARIOS.find((s) => s.id === scenario)!, [scenario])

  const onGenerate = async () => {
    try {
      const plan = await trigger({ scenario, tailoring, customContext })
      toast({ title: "Process generated", description: "Your tailored process plan is ready." })
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" })
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight">Phase 2 — Process Proposal & Tailoring</h1>
        <p className="text-muted-foreground mt-2">
          Generate tailored, evidence-based project processes based on PMBOK 7, PRINCE2, and ISO 21500/21502.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Scenario</CardTitle>
            <CardDescription>Select one of the target scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ScenarioSelector value={scenario} onChange={setScenario} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tailoring Options</CardTitle>
            <CardDescription>Adjust key constraints to tailor the methodology</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (months)</Label>
                <Input
                  id="duration"
                  inputMode="numeric"
                  value={tailoring.durationMonths}
                  onChange={(e) => setTailoring({ ...tailoring, durationMonths: Number(e.target.value || 0) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Team size</Label>
                <Input
                  id="team"
                  inputMode="numeric"
                  value={tailoring.teamSize}
                  onChange={(e) => setTailoring({ ...tailoring, teamSize: Number(e.target.value || 0) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery approach</Label>
                <Select
                  value={tailoring.delivery}
                  onValueChange={(v) => setTailoring({ ...tailoring, delivery: v as TailoringOptions["delivery"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agile">Agile</SelectItem>
                    <SelectItem value="waterfall">Waterfall</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Governance</Label>
                <Select
                  value={tailoring.governance}
                  onValueChange={(v) => setTailoring({ ...tailoring, governance: v as TailoringOptions["governance"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="strict">Strict</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Risk level</Label>
                <Select
                  value={tailoring.risk}
                  onValueChange={(v) => setTailoring({ ...tailoring, risk: v as TailoringOptions["risk"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Regulatory constraints</Label>
                <Select
                  value={tailoring.regulatory}
                  onValueChange={(v) => setTailoring({ ...tailoring, regulatory: v as TailoringOptions["regulatory"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Optional context</Label>
              <Input
                id="context"
                placeholder="e.g., mobile app with external API dependencies, must pass ISO/IEC 27001 controls"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={onGenerate} disabled={isMutating}>
                {isMutating ? "Generating..." : "Generate process"}
              </Button>
              <p className="text-muted-foreground text-sm">
                Scenario: <span className="font-medium">{selectedScenario.name}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <Tabs defaultValue="plan">
        <TabsList>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="plan">
          <ProcessPlanView plan={data} />
        </TabsContent>
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>How this works</CardTitle>
              <CardDescription>Evidence-driven synthesis across PMBOK 7, PRINCE2, and ISO 21500/21502</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-pretty">
                The generator creates a structured plan with phases, activities, deliverables, and rationale. It also
                includes evidence citations that map recommendations back to the standards so you can trace each
                element.
              </p>
              <p className="text-pretty">
                Use the tailoring controls to adjust duration, team size, appetite for risk, governance rigor, and
                regulatory pressure. You can add extra context to guide the synthesis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
