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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setError(null)
  }

  function onDocumentLoadError(err: any) {
    setError(typeof err?.message === "string" ? err.message : "Failed to load PDF")
  }

  useEffect(() => {
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
          loading={<div className="text-sm opacity-70">Loading PDF…</div>}
          error={<div className="text-sm text-red-600">Failed to load PDF.</div>}
          externalLinkTarget="_blank"
          options={{
            // Improve CORS reliability for static/public PDFs
            cMapUrl: "https://unpkg.com/pdfjs-dist@latest/cmaps/",
            cMapPacked: true,
            standardFontDataUrl: "https://unpkg.com/pdfjs-dist@latest/standard_fonts/",
          }}
        >
          <Page pageNumber={pageNumber} width={900} renderAnnotationLayer={false} renderTextLayer={false} />
        </Document>
      </div>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Couldn&apos;t render inline PDF. You can still open it:{" "}
          <a className="underline" href={fileUrl} target="_blank" rel="noopener noreferrer">
            Open in new tab
          </a>
        </div>
      ) : null}
    </div>
  )
}
