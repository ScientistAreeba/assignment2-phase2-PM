"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Lightbulb, Building2, GitBranch, Users, Calendar, CheckCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const processScenarios = [
  {
    id: "software-dev",
    title: "Custom Software Development",
    description: "Well-defined requirements, <6 months, <7 team members",
    icon: FileText,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    duration: "< 6 months",
    teamSize: "< 7 members",
    complexity: "Low-Medium",
    focus: "Speed & Flexibility"
  },
  {
    id: "innovation",
    title: "Innovative Product Development", 
    description: "R&D-heavy, uncertain outcomes, ~1 year duration",
    icon: Lightbulb,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    duration: "~1 year",
    teamSize: "8-15 members",
    complexity: "High",
    focus: "Innovation & Iteration"
  },
  {
    id: "government",
    title: "Large Government Project",
    description: "Civil, electrical, and IT components, 2-year duration",
    icon: Building2,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    duration: "2 years",
    teamSize: "20+ members",
    complexity: "Very High",
    focus: "Governance & Compliance"
  }
]

export default function ProcessesPage() {
  const router = useRouter()

  const handleScenarioClick = (scenarioId: string) => {
    router.push(`/processes/${scenarioId}`)
  }

  const handleComparisonClick = () => {
    router.push("/processes/comparison")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium text-lg">PRISMO</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Phase 2: Process Proposal & Tailoring</h1>
              <p className="text-muted-foreground">End-to-end project processes for three distinct scenarios</p>
            </div>
            <Button
              variant="outline"
              onClick={handleComparisonClick}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Compare All Processes
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Process Design Framework</h2>
          <p className="text-muted-foreground mb-6">
            Based on insights from Phase 1 standards comparison, we've designed tailored project processes 
            for three distinct scenarios. Each process references PMBOK, PRINCE2, and ISO standards while 
            justifying specific tailoring choices.
          </p>
        </div>

        {/* Process Scenarios */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {processScenarios.map((scenario) => {
            const IconComponent = scenario.icon
            return (
              <Card 
                key={scenario.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary"
                onClick={() => handleScenarioClick(scenario.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${scenario.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scenario.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Duration: {scenario.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Team: {scenario.teamSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Complexity: {scenario.complexity}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Focus: {scenario.focus}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Process
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Key Features */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Each Process Includes:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Phases and key activities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Roles and responsibilities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Artifacts and deliverables</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Decision gates and reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Standards references (PMBOK, PRINCE2, ISO)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Tailoring justifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
