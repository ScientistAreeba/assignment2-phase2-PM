"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, GitCompare, TrendingUp, Sparkles } from "lucide-react"
import type { ComparisonResult } from "@/lib/comparison-engine"

interface ComparisonSummaryProps {
  comparison: ComparisonResult
  onViewDetails?: (type: "similarities" | "differences" | "unique") => void
}

export function ComparisonSummary({ comparison, onViewDetails }: ComparisonSummaryProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const sections = [
    {
      key: "similarities",
      title: "Similarities",
      icon: GitCompare,
      color: "text-blue-600",
      data: comparison.similarities,
      description: "Common approaches across standards",
    },
    {
      key: "differences",
      title: "Differences",
      icon: TrendingUp,
      color: "text-orange-600",
      data: comparison.differences,
      description: "Unique approaches and methodologies",
    },
    {
      key: "unique",
      title: "Unique Points",
      icon: Sparkles,
      color: "text-purple-600",
      data: comparison.unique,
      description: "Concepts found in only one standard",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Analysis Summary: {comparison.topic}</h2>
        <p className="text-muted-foreground">Comprehensive comparison across PMBOK, PRINCE2, and ISO standards</p>
      </div>

      {sections.map((section) => {
        const IconComponent = section.icon
        const isExpanded = expandedSection === section.key

        return (
          <Card key={section.key} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${section.color}`} />
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <Badge variant="secondary">{section.data.length} items</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {onViewDetails && (
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(section.key as any)}>
                      View All
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => toggleSection(section.key)}>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {section.data.slice(0, 3).map((item) => (
                    <div key={item.id} className="border-l-2 border-muted pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge className={getStandardColor(item.standard)}>{item.standard}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.section}</p>
                      <p className="text-sm leading-relaxed">{item.content.substring(0, 200)}...</p>
                    </div>
                  ))}

                  {section.data.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(section.key as any)}>
                        View {section.data.length - 3} more {section.title.toLowerCase()}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
