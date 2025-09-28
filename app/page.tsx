"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, BookOpen, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleStandardClick = (standard: string) => {
    router.push(`/standards/${standard}`)
  }

  const handleAnalysisClick = (type: "similarities" | "differences" | "unique") => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&analysis=${type}`)
    } else {
      router.push(`/analysis/${type}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with analysis buttons */}
      <header className="flex justify-end p-6">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAnalysisClick("unique")}
            className="text-sm font-medium hover:bg-accent"
          >
            Unique
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAnalysisClick("similarities")}
            className="text-sm font-medium hover:bg-accent"
          >
            Similarities
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAnalysisClick("differences")}
            className="text-sm font-medium hover:bg-accent"
          >
            Differences
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-light text-foreground mb-4 tracking-tight">PRISMO</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Project Management Standards Intelligence & Comparison
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search across PMBOK, PRINCE2, and ISO standards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 rounded-full focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>
        </form>

        {/* Standards Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleStandardClick("pmbok")}
            className="flex items-center gap-3 px-6 py-3 rounded-full border-2 hover:bg-accent transition-all duration-200"
          >
            <BookOpen className="h-5 w-5" />
            PMBOK Guide
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleStandardClick("prince2")}
            className="flex items-center gap-3 px-6 py-3 rounded-full border-2 hover:bg-accent transition-all duration-200"
          >
            <Shield className="h-5 w-5" />
            PRINCE2
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleStandardClick("iso")}
            className="flex items-center gap-3 px-6 py-3 rounded-full border-2 hover:bg-accent transition-all duration-200"
          >
            <FileText className="h-5 w-5" />
            ISO 21500/21502
          </Button>
        </div>

        {/* Subtle tagline */}
        <p className="text-sm text-muted-foreground mt-12 text-center max-w-lg">
          Explore, compare, and analyze project management standards with intelligent search and deep insights
        </p>
      </main>
    </div>
  )
}
