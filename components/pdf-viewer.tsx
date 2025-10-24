"use client"

import { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

// Configure pdf.js worker from CDN to avoid bundling issues.
// This is the recommended minimal setup for Next.js-like environments.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

type PdfViewerProps = {
  fileUrl: string
  initialPage?: number
}

export function PdfViewer({ fileUrl, initialPage = 1 }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(initialPage)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setError(null)
    setIsLoading(false)
  }

  function onDocumentLoadError(err: any) {
    const errorMessage = typeof err?.message === "string" ? err.message : "Failed to load PDF"
    setError(errorMessage)
    setIsLoading(false)
    console.error("[PRISMO] PDF Load Error:", errorMessage, err)
  }

  useEffect(() => {
    // Reset loading state when file URL changes
    setIsLoading(true)
    setError(null)
    // Clamp page number if file changes or numPages changes
    setPageNumber((p) => Math.min(Math.max(1, p), Math.max(1, numPages)))
  }, [numPages, fileUrl])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            className="rounded border px-3 py-1 text-sm"
            aria-label="Previous page"
            disabled={pageNumber <= 1}
          >
            Prev
          </button>
          <span className="text-sm">
            Page {pageNumber} {numPages ? `of ${numPages}` : ""}
          </span>
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.min(numPages || p + 1, p + 1))}
            className="rounded border px-3 py-1 text-sm"
            aria-label="Next page"
            disabled={!!numPages && pageNumber >= numPages}
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="rounded border px-3 py-1 text-sm">
            Open in new tab
          </a>
          <a href={fileUrl} download className="rounded border px-3 py-1 text-sm">
            Download
          </a>
        </div>
      </div>

      <div className="flex w-full justify-center">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-sm opacity-70 mb-2">Loading PDF…</div>
                <div className="text-xs text-muted-foreground">This may take a moment</div>
              </div>
            </div>
          }
          error={<div className="text-sm text-red-600">Failed to load PDF.</div>}
          externalLinkTarget="_blank"
          options={{
            // Improve CORS reliability for static/public PDFs
            cMapUrl: "https://unpkg.com/pdfjs-dist@latest/cmaps/",
            cMapPacked: true,
            standardFontDataUrl: "https://unpkg.com/pdfjs-dist@latest/standard_fonts/",
            // Add CORS mode for external URLs
            httpHeaders: {
              'Access-Control-Allow-Origin': '*',
            },
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-sm opacity-70 mb-2">Rendering PDF…</div>
                <div className="text-xs text-muted-foreground">Page {pageNumber}</div>
              </div>
            </div>
          ) : (
            <Page pageNumber={pageNumber} width={900} renderAnnotationLayer={false} renderTextLayer={false} />
          )}
        </Document>
      </div>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-medium mb-2">PDF Loading Issue</div>
          <div className="mb-3">
            The PDF couldn&apos;t be rendered inline. This is common when:
            <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
              <li>The PDF source blocks embedding (CORS restrictions)</li>
              <li>The file is too large for inline viewing</li>
              <li>Network connectivity issues</li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <a 
              className="underline font-medium" 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Open in new tab
            </a>
            <span className="text-muted-foreground">•</span>
            <a 
              className="underline font-medium" 
              href={fileUrl} 
              download
            >
              Download PDF
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
