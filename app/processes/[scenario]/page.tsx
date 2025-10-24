"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, Users, Calendar, CheckCircle, GitBranch, Target, BookOpen, Shield, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Process data for each scenario
const processData = {
  "software-dev": {
    title: "Custom Software Development Process",
    description: "Lightweight process optimized for speed and flexibility",
    context: "Well-defined requirements, <6 months, <7 team members",
    standards: {
      pmbok: ["Integration Management", "Scope Management", "Time Management", "Quality Management"],
      prince2: ["Starting up a Project", "Directing a Project", "Managing Product Delivery"],
      iso: ["Project Planning", "Project Control", "Risk Management"]
    },
    phases: [
      {
        id: "initiation",
        name: "Project Initiation",
        duration: "1-2 weeks",
        activities: [
          "Requirements gathering and validation",
          "Stakeholder identification and analysis", 
          "Initial risk assessment",
          "Team formation and role assignment",
          "Project charter creation"
        ],
        deliverables: [
          "Project Charter",
          "Stakeholder Register", 
          "Initial Risk Register",
          "Team Structure Document"
        ],
        roles: ["Project Manager", "Product Owner", "Tech Lead", "Key Stakeholders"],
        decisionGate: "Go/No-Go decision based on feasibility and resource availability"
      },
      {
        id: "planning",
        name: "Sprint Planning & Setup",
        duration: "1 week",
        activities: [
          "Detailed requirements breakdown",
          "Sprint planning and backlog creation",
          "Development environment setup",
          "Quality standards definition",
          "Communication protocols establishment"
        ],
        deliverables: [
          "Product Backlog",
          "Sprint Plan",
          "Development Standards",
          "Communication Plan"
        ],
        roles: ["Project Manager", "Product Owner", "Tech Lead", "Development Team"],
        decisionGate: "Sprint readiness assessment and team commitment"
      },
      {
        id: "execution",
        name: "Agile Development",
        duration: "8-12 weeks",
        activities: [
          "Sprint execution (2-week sprints)",
          "Daily standups and progress tracking",
          "Continuous integration and testing",
          "Stakeholder demos and feedback",
          "Risk monitoring and mitigation"
        ],
        deliverables: [
          "Working Software Increments",
          "Sprint Reports",
          "Test Results",
          "User Documentation"
        ],
        roles: ["Development Team", "Product Owner", "Project Manager", "QA Team"],
        decisionGate: "Sprint review and retrospective after each sprint"
      },
      {
        id: "closure",
        name: "Project Closure",
        duration: "1 week",
        activities: [
          "Final testing and bug fixes",
          "User acceptance testing",
          "Documentation finalization",
          "Knowledge transfer",
          "Project retrospective"
        ],
        deliverables: [
          "Final Product",
          "User Manual",
          "Technical Documentation",
          "Lessons Learned Report"
        ],
        roles: ["Project Manager", "Product Owner", "Tech Lead", "End Users"],
        decisionGate: "Final acceptance and sign-off from stakeholders"
      }
    ],
    tailoring: {
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
      ],
      justification: "Tailored for speed and flexibility while maintaining quality. Focus on working software over comprehensive documentation."
    }
  },
  "innovation": {
    title: "Innovative Product Development Process",
    description: "Hybrid adaptive process balancing innovation, iteration, and stakeholder management",
    context: "R&D-heavy, uncertain outcomes, ~1 year duration",
    standards: {
      pmbok: ["Integration Management", "Risk Management", "Stakeholder Management", "Quality Management"],
      prince2: ["Starting up a Project", "Initiating a Project", "Managing a Stage Boundary"],
      iso: ["Project Planning", "Risk Management", "Quality Management", "Change Management"]
    },
    phases: [
      {
        id: "discovery",
        name: "Discovery & Research",
        duration: "4-6 weeks",
        activities: [
          "Market research and opportunity analysis",
          "Technology feasibility studies",
          "Stakeholder needs assessment",
          "Risk and uncertainty identification",
          "Innovation strategy development"
        ],
        deliverables: [
          "Market Research Report",
          "Technology Assessment",
          "Innovation Strategy",
          "Initial Prototype Concepts"
        ],
        roles: ["Innovation Lead", "Research Team", "Market Analyst", "Stakeholders"],
        decisionGate: "Innovation viability and market potential assessment"
      },
      {
        id: "experimentation",
        name: "Rapid Experimentation",
        duration: "8-12 weeks",
        activities: [
          "Rapid prototyping and testing",
          "User feedback collection",
          "Technology validation",
          "Business model experimentation",
          "Risk mitigation strategies"
        ],
        deliverables: [
          "Working Prototypes",
          "User Feedback Reports",
          "Technology Validation Results",
          "Business Model Canvas"
        ],
        roles: ["R&D Team", "Design Team", "Product Manager", "End Users"],
        decisionGate: "Technical feasibility and market validation"
      },
      {
        id: "development",
        name: "Iterative Development",
        duration: "16-20 weeks",
        activities: [
          "Agile development with frequent iterations",
          "Continuous user testing and feedback",
          "Risk monitoring and adaptation",
          "Stakeholder engagement and communication",
          "Quality assurance and testing"
        ],
        deliverables: [
          "Product Increments",
          "User Testing Reports",
          "Risk Assessment Updates",
          "Stakeholder Communication"
        ],
        roles: ["Development Team", "Product Manager", "UX Designer", "QA Team"],
        decisionGate: "Product-market fit validation and stakeholder approval"
      },
      {
        id: "launch",
        name: "Launch & Scale",
        duration: "4-6 weeks",
        activities: [
          "Final product development",
          "Market launch preparation",
          "User training and support setup",
          "Performance monitoring",
          "Scaling strategy implementation"
        ],
        deliverables: [
          "Final Product",
          "Launch Plan",
          "User Training Materials",
          "Performance Metrics"
        ],
        roles: ["Product Team", "Marketing Team", "Support Team", "Leadership"],
        decisionGate: "Market readiness and stakeholder sign-off"
      }
    ],
    tailoring: {
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
      ],
      justification: "Balances innovation with structure. Emphasizes learning and adaptation over following a fixed plan."
    }
  },
  "government": {
    title: "Large Government Project Process",
    description: "Comprehensive process covering governance, compliance, procurement, and risk management",
    context: "Civil, electrical, and IT components, 2-year duration",
    standards: {
      pmbok: ["Integration Management", "Scope Management", "Time Management", "Cost Management", "Quality Management", "Risk Management", "Stakeholder Management"],
      prince2: ["All 7 Principles", "All 7 Themes", "All 7 Processes"],
      iso: ["Project Planning", "Project Control", "Risk Management", "Quality Management", "Change Management", "Communication Management"]
    },
    phases: [
      {
        id: "preparation",
        name: "Project Preparation",
        duration: "8-12 weeks",
        activities: [
          "Stakeholder analysis and engagement",
          "Regulatory compliance assessment",
          "Procurement planning and vendor selection",
          "Risk identification and assessment",
          "Governance structure establishment"
        ],
        deliverables: [
          "Project Brief",
          "Stakeholder Analysis",
          "Compliance Requirements",
          "Procurement Strategy",
          "Governance Framework"
        ],
        roles: ["Senior Responsible Owner", "Project Manager", "Compliance Officer", "Procurement Manager"],
        decisionGate: "Project authorization and budget approval"
      },
      {
        id: "initiation",
        name: "Project Initiation",
        duration: "4-6 weeks",
        activities: [
          "Detailed project planning",
          "Resource allocation and team formation",
          "Contract management setup",
          "Quality management system implementation",
          "Communication protocols establishment"
        ],
        deliverables: [
          "Project Initiation Document",
          "Resource Plan",
          "Contract Management Plan",
          "Quality Management Plan",
          "Communication Plan"
        ],
        roles: ["Project Manager", "Team Leads", "Contract Manager", "Quality Manager"],
        decisionGate: "Project initiation approval and resource commitment"
      },
      {
        id: "execution",
        name: "Multi-Component Execution",
        duration: "60-80 weeks",
        activities: [
          "Parallel component development",
          "Regular progress monitoring and reporting",
          "Risk management and mitigation",
          "Quality assurance and control",
          "Stakeholder communication and engagement"
        ],
        deliverables: [
          "Component Deliverables",
          "Progress Reports",
          "Risk Reports",
          "Quality Reports",
          "Stakeholder Updates"
        ],
        roles: ["Project Manager", "Component Leads", "Quality Manager", "Risk Manager"],
        decisionGate: "Stage gate reviews and milestone approvals"
      },
      {
        id: "integration",
        name: "Integration & Testing",
        duration: "12-16 weeks",
        activities: [
          "System integration and testing",
          "User acceptance testing",
          "Performance validation",
          "Documentation completion",
          "Training and knowledge transfer"
        ],
        deliverables: [
          "Integrated System",
          "Test Results",
          "User Acceptance Reports",
          "Documentation Package",
          "Training Materials"
        ],
        roles: ["Integration Manager", "Test Manager", "End Users", "Support Team"],
        decisionGate: "System acceptance and operational readiness"
      },
      {
        id: "closure",
        name: "Project Closure",
        duration: "4-6 weeks",
        activities: [
          "Final deliverables handover",
          "Contract closure and vendor management",
          "Lessons learned documentation",
          "Stakeholder satisfaction assessment",
          "Project closure reporting"
        ],
        deliverables: [
          "Final Deliverables",
          "Contract Closure Reports",
          "Lessons Learned",
          "Stakeholder Satisfaction Report",
          "Project Closure Report"
        ],
        roles: ["Project Manager", "Contract Manager", "Stakeholders", "Audit Team"],
        decisionGate: "Final acceptance and project closure approval"
      }
    ],
    tailoring: {
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
      ],
      justification: "Emphasizes governance, compliance, and accountability. Balances thoroughness with project success."
    }
  }
}

export default function ProcessScenarioPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  
  const scenario = params.scenario as string
  const process = processData[scenario as keyof typeof processData]

  if (!process) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Process Not Found</h1>
          <Button onClick={() => router.push("/processes")}>Return to Processes</Button>
        </div>
      </div>
    )
  }

  const getStandardColor = (standard: string) => {
    switch (standard) {
      case "PMBOK":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "PRINCE2":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "ISO":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

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
              <h1 className="text-2xl font-bold">{process.title}</h1>
              <p className="text-muted-foreground">{process.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="phases">Process Phases</TabsTrigger>
            <TabsTrigger value="standards">Standards References</TabsTrigger>
            <TabsTrigger value="tailoring">Tailoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{process.context}</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Duration: {scenario === "software-dev" ? "< 6 months" : scenario === "innovation" ? "~1 year" : "2 years"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Team Size: {scenario === "software-dev" ? "< 7 members" : scenario === "innovation" ? "8-15 members" : "20+ members"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Complexity: {scenario === "software-dev" ? "Low-Medium" : scenario === "innovation" ? "High" : "Very High"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Key Process Characteristics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700">Included Practices:</h4>
                    <ul className="space-y-1">
                      {process.tailoring.included.map((practice, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {practice}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-red-700">Excluded Practices:</h4>
                    <ul className="space-y-1">
                      {process.tailoring.excluded.map((practice, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-3 w-3 rounded-full bg-red-600" />
                          {practice}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Tailoring Justification:</h4>
                  <p className="text-sm text-muted-foreground">{process.tailoring.justification}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phases" className="space-y-6">
            {process.phases.map((phase, index) => (
              <Card key={phase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      {phase.name}
                    </CardTitle>
                    <Badge variant="outline">{phase.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Activities:</h4>
                    <ul className="space-y-1">
                      {phase.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-primary" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Deliverables:</h4>
                      <ul className="space-y-1">
                        {phase.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Key Roles:</h4>
                      <ul className="space-y-1">
                        {phase.roles.map((role, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {role}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-1">Decision Gate:</h4>
                    <p className="text-sm text-muted-foreground">{phase.decisionGate}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="standards" className="space-y-6">
            <div className="grid gap-4">
              {Object.entries(process.standards).map(([standard, areas]) => (
                <Card key={standard}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {standard} Standards Referenced
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {areas.map((area, index) => (
                        <Badge key={index} className={getStandardColor(standard)}>
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tailoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tailoring Decisions & Justifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">Practices Included:</h4>
                  <div className="space-y-2">
                    {process.tailoring.included.map((practice, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">Practices Excluded:</h4>
                  <div className="space-y-2">
                    {process.tailoring.excluded.map((practice, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="h-4 w-4 rounded-full bg-red-600 mt-0.5" />
                        <span className="text-sm">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Justification:</h4>
                  <p className="text-sm text-muted-foreground">{process.tailoring.justification}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
