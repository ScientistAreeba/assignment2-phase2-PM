"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Search, BookOpen, Maximize2, Minimize2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Document, Page, pdfjs } from "react-pdf"

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const standardsInfo = {
  pmbok: {
    title: "PMBOK Guide - 7th Edition",
    description: "A Guide to the Project Management Body of Knowledge",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    pdfUrl: "/pdfs/PMBOK.pdf",
  },
  prince2: {
    title: "PRINCE2 Methodology",
    description: "Managing Successful Projects with PRINCE2",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pdfUrl: "/pdfs/PRINCE2.pdf",
  },
  iso: {
    title: "ISO 21500/21502",
    description: "Project, Programme and Portfolio Management Standards",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    pdfUrl: "/pdfs/ISO.pdf",
  },
}

export default function StandardPage() {
  const params = useParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const standard = params.standard as string
  const standardInfo = standardsInfo[standard as keyof typeof standardsInfo]

  if (!standardInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Standard Not Found</h1>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // In a real app, this would search within the PDF
      console.log(`Searching for "${searchTerm}" in ${standard}`)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error: Error) => {
    setError(`Failed to load PDF: ${error.message}`)
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1))
  }

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const downloadPdf = () => {
    const link = document.createElement('a')
    link.href = standardInfo.pdfUrl
    link.download = `${standardInfo.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
              {/* PDF Controls */}
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button variant="ghost" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">
                  {pageNumber} / {numPages || '--'}
                </span>
                <Button variant="ghost" size="sm" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button variant="ghost" size="sm" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={rotate}>
                <RotateCw className="h-4 w-4" />
              </Button>

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

              <Button variant="outline" size="sm" onClick={downloadPdf}>
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
            {loading && (
              <div className="aspect-[8.5/11] bg-white flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50 animate-pulse" />
                  <h3 className="text-xl font-semibold mb-2">Loading PDF...</h3>
                  <p className="text-sm">Please wait while the document loads</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="aspect-[8.5/11] bg-white flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading PDF</h3>
                  <p className="text-sm max-w-md mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="flex justify-center bg-gray-100 p-4">
                <Document
                  file={standardInfo.pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
                        <p className="text-sm">Loading document...</p>
                      </div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    className="shadow-lg"
                  />
                </Document>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
