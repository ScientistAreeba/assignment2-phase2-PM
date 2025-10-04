"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Search, Filter, TrendingUp, GitCompare, Sparkles, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { comparisonEngine } from "@/lib/comparison-engine"

const analysisTypes = {
  similarities: {
    title: "Similarities Analysis",
    description: "Common practices and overlapping guidance across standards",
    icon: GitCompare,
    color: "text-blue-600",
  },
  differences: {
    title: "Differences Analysis",
    description: "Unique terminologies, methodologies, and approaches",
    icon: TrendingUp,
    color: "text-orange-600",
  },
  unique: {
    title: "Unique Points Analysis",
    description: "What only one standard covers",
    icon: Sparkles,
    color: "text-purple-600",
  },
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const analysisType = params.type as string
  const analysis = analysisTypes[analysisType as keyof typeof analysisTypes]

  useEffect(() => {
    loadDefaultAnalysis()
  }, [analysisType])

  const loadDefaultAnalysis = () => {
    setIsLoading(true)
    try {
      if (analysisType === "unique") {
        const uniqueResults = comparisonEngine.getGlobalUniquePoints(3)
        setResults(uniqueResults)
      } else {
        const commonTopics = ["risk management", "stakeholder management", "quality management"]
        let allResults: any[] = []

        commonTopics.forEach((topic) => {
          const topicResults = comparisonEngine.filterByAnalysisType(
            topic,
            analysisType as "similarities" | "differences",
          )
          allResults = [...allResults, ...topicResults]
        })

        const uniqueResults = allResults
          .filter((result, index, self) => index === self.findIndex((r) => r.id === result.id))
          .slice(0, 10)

        setResults(uniqueResults)
      }
    } catch (error) {
      console.error("Error loading default analysis:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Analysis Type Not Found</h1>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsLoading(true)
      try {
        const searchResults = comparisonEngine.filterByAnalysisType(
          searchQuery.trim(),
          analysisType as "similarities" | "differences" | "unique",
        )
        setResults(searchResults)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    } else {
      loadDefaultAnalysis()
    }
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

  const handleViewInStandard = (standard: string) => {
    router.push(`/standards/${standard.toLowerCase()}`)
  }

  const IconComponent = analysis.icon

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

            <div className="flex items-center gap-3">
              <IconComponent className={`h-6 w-6 ${analysis.color}`} />
              <div>
                <h1 className="font-semibold text-lg">{analysis.title}</h1>
                <p className="text-sm text-muted-foreground">{analysis.description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Search Bar */}
        {analysisType !== "unique" && (
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={`Search for ${analysisType} on a specific topic...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-full border focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
            <p className="text-sm text-muted-foreground mt-2">
              Enter a topic like "Risk Management" or "Stakeholder Engagement" to see {analysisType} across standards
            </p>
          </div>
        )}

        {/* Analysis Results */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {isLoading ? (
                "Loading analysis..."
              ) : (
                <>
                  Showing {results.length} {analysisType} across PM standards
                  {analysisType !== "unique" && searchQuery && ` for "${searchQuery}"`}
                </>
              )}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Analyzing standards...</div>
            </div>
          ) : (
            <>
              {results.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getStandardColor(item.standard)}>{item.standard}</Badge>
                          <span className="text-sm text-muted-foreground">{item.section}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInStandard(item.standard)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed mb-4">{item.content}</p>
                    {item.keywords && item.keywords.length > 0 && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-medium mb-2">Key concepts:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.keywords.map((keyword: string) => (
                            <Badge key={keyword} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {results.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    {searchQuery ? (
                      <>
                        No {analysisType} found for "{searchQuery}"
                      </>
                    ) : (
                      <>No {analysisType} available</>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Try searching for specific project management topics like "risk management", "quality assurance", or
                    "stakeholder engagement".
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
