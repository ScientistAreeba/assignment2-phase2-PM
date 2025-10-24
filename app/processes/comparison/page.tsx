"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Lightbulb, Building2, GitBranch, Users, Calendar, CheckCircle, Target, BookOpen, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const processComparison = {
  software: {
    title: "Custom Software Development",
    icon: FileText,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    duration: "< 6 months",
    teamSize: "< 7 members",
    complexity: "Low-Medium",
    phases: 4,
    focus: "Speed & Flexibility"
  },
  innovation: {
    title: "Innovative Product Development",
    icon: Lightbulb,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    duration: "~1 year",
    teamSize: "8-15 members",
    complexity: "High",
    phases: 4,
    focus: "Innovation & Iteration"
  },
  government: {
    title: "Large Government Project",
    icon: Building2,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    duration: "2 years",
    teamSize: "20+ members",
    complexity: "Very High",
    phases: 5,
    focus: "Governance & Compliance"
  }
}

const standardsComparison = {
  pmbok: {
    name: "PMBOK Guide",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    software: ["Integration Management", "Scope Management", "Time Management", "Quality Management"],
    innovation: ["Integration Management", "Risk Management", "Stakeholder Management", "Quality Management"],
    government: ["Integration Management", "Scope Management", "Time Management", "Cost Management", "Quality Management", "Risk Management", "Stakeholder Management"]
  },
  prince2: {
    name: "PRINCE2",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    software: ["Starting up a Project", "Directing a Project", "Managing Product Delivery"],
    innovation: ["Starting up a Project", "Initiating a Project", "Managing a Stage Boundary"],
    government: ["All 7 Principles", "All 7 Themes", "All 7 Processes"]
  },
  iso: {
    name: "ISO Standards",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    software: ["Project Planning", "Project Control", "Risk Management"],
    innovation: ["Project Planning", "Risk Management", "Quality Management", "Change Management"],
    government: ["Project Planning", "Project Control", "Risk Management", "Quality Management", "Change Management", "Communication Management"]
  }
}

const tailoringComparison = {
  software: {
    included: [
      "Agile methodologies for rapid delivery",
      "Lightweight documentation approach",
      "Continuous stakeholder engagement",
      "Iterative development cycles"
    ],
    excluded: [
      "Heavy governance processes",
      "Extensive documentation requirements",
      "Complex approval workflows",
      "Detailed compliance procedures"
    ]
  },
  innovation: {
    included: [
      "Design thinking and user-centered approach",
      "Rapid prototyping and experimentation",
      "Adaptive planning and frequent pivots",
      "Strong stakeholder engagement"
    ],
    excluded: [
      "Rigid project timelines",
      "Detailed upfront planning",
      "Traditional waterfall approaches",
      "Fixed scope requirements"
    ]
  },
  government: {
    included: [
      "Comprehensive governance and oversight",
      "Detailed compliance and regulatory requirements",
      "Extensive documentation and reporting",
      "Multi-stakeholder engagement and communication"
    ],
    excluded: [
      "Agile methodologies (too flexible for government context)",
      "Lightweight documentation",
      "Informal communication",
      "Rapid iteration without approval"
    ]
  }
}

export default function ProcessComparisonPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/processes")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium text-lg">PRISMO</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Process Comparison & Analysis</h1>
              <p className="text-muted-foreground">Side-by-side comparison of all three tailored processes</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="standards">Standards Usage</TabsTrigger>
            <TabsTrigger value="tailoring">Tailoring Decisions</TabsTrigger>
            <TabsTrigger value="justification">Justification</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(processComparison).map(([key, process]) => {
                const IconComponent = process.icon
                return (
                  <Card key={key}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${process.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{process.title}</CardTitle>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Duration: {process.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Team: {process.teamSize}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Complexity: {process.complexity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Phases: {process.phases}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <Badge variant="secondary" className="text-xs">
                        Focus: {process.focus}
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Process Complexity Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Software Development</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">Low-Medium</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Innovation Development</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">High</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Government Project</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">Very High</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standards" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(standardsComparison).map(([standardKey, standard]) => (
                <Card key={standardKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {standard.name} Standards Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(processComparison).map(([processKey, process]) => (
                        <div key={processKey} className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <process.icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{process.title}</span>
                          </div>
                          <div className="space-y-1">
                            {standard[processKey as keyof typeof standard].map((area, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tailoring" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(tailoringComparison).map(([processKey, tailoring]) => {
                const process = processComparison[processKey as keyof typeof processComparison]
                const IconComponent = process.icon
                return (
                  <Card key={processKey}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        {process.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">Included Practices:</h4>
                        <ul className="space-y-1">
                          {tailoring.included.map((practice, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-red-700">Excluded Practices:</h4>
                        <ul className="space-y-1">
                          {tailoring.excluded.map((practice, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="h-3 w-3 rounded-full bg-red-600 mt-0.5" />
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="justification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tailoring Justification Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Software Development</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tailored for speed and flexibility while maintaining quality. Focus on working software 
                      over comprehensive documentation. Agile methodologies enable rapid delivery and continuous 
                      stakeholder feedback.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Innovation Development</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Balances innovation with structure. Emphasizes learning and adaptation over following 
                      a fixed plan. Design thinking and rapid experimentation enable discovery of viable 
                      solutions in uncertain environments.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">Government Project</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Emphasizes governance, compliance, and accountability. Balances thoroughness with 
                      project success. Comprehensive oversight ensures regulatory compliance while 
                      maintaining project momentum.
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Key Insights from Standards Analysis:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Common Elements Across All Processes:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Integration Management (PMBOK)</li>
                        <li>• Risk Management (All standards)</li>
                        <li>• Quality Management (All standards)</li>
                        <li>• Stakeholder Engagement (PMBOK, PRINCE2)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Process-Specific Adaptations:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Software: Agile focus, minimal governance</li>
                        <li>• Innovation: Adaptive planning, experimentation</li>
                        <li>• Government: Full governance, compliance focus</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
