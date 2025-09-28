"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, ArrowLeft, Filter, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { comparisonEngine } from "@/lib/comparison-engine"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const query = searchParams.get("q") || ""
    const analysis = searchParams.get("analysis")
    setSearchQuery(query)
    setActiveAnalysis(analysis)

    if (query) {
      performSearch(query, analysis)
    }
  }, [searchParams])

  const performSearch = async (query: string, analysisType?: string | null) => {
    setIsLoading(true)
    try {
      let searchResults

      if (analysisType) {
        searchResults = comparisonEngine.filterByAnalysisType(
          query,
          analysisType as "similarities" | "differences" | "unique",
        )
      } else {
        searchResults = comparisonEngine.searchStandards(query)
      }

      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set("q", searchQuery.trim())
      if (activeAnalysis) {
        params.set("analysis", activeAnalysis)
      }
      router.push(`/search?${params.toString()}`)
    }
  }

  const handleAnalysisFilter = (type: string) => {
    const params = new URLSearchParams()
    params.set("q", searchQuery)
    if (activeAnalysis === type) {
      setActiveAnalysis(null)
    } else {
      params.set("analysis", type)
      setActiveAnalysis(type)
    }
    router.push(`/search?${params.toString()}`)
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

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search across standards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Analysis Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Analysis:</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeAnalysis === "similarities" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnalysisFilter("similarities")}
            >
              Similarities
            </Button>
            <Button
              variant={activeAnalysis === "differences" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnalysisFilter("differences")}
            >
              Differences
            </Button>
            <Button
              variant={activeAnalysis === "unique" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnalysisFilter("unique")}
            >
              Unique Points
            </Button>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {searchQuery && (
            <div className="text-sm text-muted-foreground mb-4">
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  About {results.length} results for "{searchQuery}"{activeAnalysis && ` (${activeAnalysis})`}
                </>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Searching standards...</div>
            </div>
          ) : (
            results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-primary hover:underline cursor-pointer">
                        {result.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStandardColor(result.standard)}>{result.standard}</Badge>
                        <span className="text-sm text-muted-foreground">{result.section}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.relevance && (
                        <div className="text-sm text-muted-foreground">{Math.round(result.relevance)}% match</div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInStandard(result.standard)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed mb-3">{result.content}</p>
                  {result.keywords && result.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.slice(0, 5).map((keyword: string) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          {!isLoading && searchQuery && results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No results found for "{searchQuery}"</div>
              <p className="text-sm text-muted-foreground">
                Try different keywords or search terms related to project management standards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
