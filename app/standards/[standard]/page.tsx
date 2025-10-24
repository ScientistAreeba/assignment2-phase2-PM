"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Search, BookOpen, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PdfViewer } from "@/components/pdf-viewer"

const standardsInfo = {
  pmbok: {
    title: "PMBOK Guide - 7th Edition",
    description: "A Guide to the Project Management Body of Knowledge",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    localPdfUrl: "/pdfs/pmbok.pdf",
    externalPdfUrl:
      "https://trainupinstitute.com/wp-content/uploads/2022/03/Project-Management-Institute-A-Guide-to-the-Project-Management-Body-of-Knowledge-PMBOK%C2%AE-Guide%E2%80%93Sixth-Edition-Project-Management-Institute-2017.pdf",
  },
  prince2: {
    title: "PRINCE2 Methodology",
    description: "Managing Successful Projects with PRINCE2",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    localPdfUrl: "/pdfs/prince2.pdf",
    externalPdfUrl: "https://www.itu.int/en/testweb/v6master/training/Documents/PRINCE2.pdf",
  },
  iso: {
    title: "ISO 21500/21502",
    description: "Project, Programme and Portfolio Management Standards",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    localPdfUrl: "/pdfs/iso.pdf",
    externalPdfUrl:
      "https://www.nqa.com/getmedia/ae12c945-4dbb-4b73-a4e3-996261a540af/NQA-ISO-27001-Implementation-Guide.pdf",
  },
} as const

export default function StandardPage() {
  const params = useParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pdfSrc, setPdfSrc] = useState<string | null>(null)
  const standard = params.standard as string
  const standardInfo = standardsInfo[standard as keyof typeof standardsInfo]

  useEffect(() => {
    if (!standardInfo) return
    
    // For deployment, we'll use external URLs directly since local PDFs may not be accessible
    // due to CORS restrictions or deployment issues
    const isProduction = process.env.NODE_ENV === 'production'
    
    if (isProduction) {
      // In production, use external URLs directly
      setPdfSrc(standardInfo.externalPdfUrl)
    } else {
      // In development, try local first, then fallback to external
      const local = standardInfo.localPdfUrl
      const checkLocal = async () => {
        try {
          console.log("[PRISMO] Checking local PDF:", local)
          const res = await fetch(local, { method: "HEAD" })
          if (res.ok) {
            setPdfSrc(local)
            console.log("[PRISMO] Local PDF available:", local)
          } else {
            console.log("[PRISMO] Local PDF not found, using external:", res.status)
            setPdfSrc(standardInfo.externalPdfUrl)
          }
        } catch (err) {
          console.log("[PRISMO] Local PDF check failed, using external:", (err as any)?.message || err)
          setPdfSrc(standardInfo.externalPdfUrl)
        }
      }
      void checkLocal()
    }
  }, [standardInfo, standard])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // In a real app, this would search within the PDF
      console.log(`Searching for "${searchTerm}" in ${standard}`)
    }
  }

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium text-lg">PRISMO</span>
              </Button>

              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h1 className="font-semibold">{standardInfo.title}</h1>
                  <p className="text-sm text-muted-foreground">{standardInfo.description}</p>
                </div>
                <Badge className={standardInfo.color}>{standard.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* PDF Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search in document..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64"
                  />
                </div>
              </form>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <div className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
            {pdfSrc ? (
              <div className="h-[calc(100vh-220px)] overflow-auto">
                <PdfViewer fileUrl={pdfSrc} />
              </div>
            ) : (
              <div className="flex h-[calc(100vh-220px)] items-center justify-center p-6 text-center">
                <div className="max-w-lg space-y-4">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold">PDF Viewer Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    The PDF will load automatically. If you encounter issues, you can always open the document 
                    in a new tab or download it directly.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={standardInfo.externalPdfUrl} target="_blank" rel="noopener noreferrer">
                        Open in new tab
                      </a>
                    </Button>
                    <Button asChild size="sm">
                      <a href={standardInfo.externalPdfUrl} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Using external PDF source for better compatibility with deployment environments.
                  </p>
                </div>
              </div>
            )}
          </div>

          {(() => {
            const openLink = pdfSrc ?? standardInfo.externalPdfUrl
            return (
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="truncate">
                  Source: <span className="font-mono">{openLink}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={openLink} target="_blank" rel="noopener noreferrer">
                      Open in new tab
                    </a>
                  </Button>
                  <Button asChild size="sm">
                    <a href={openLink} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
