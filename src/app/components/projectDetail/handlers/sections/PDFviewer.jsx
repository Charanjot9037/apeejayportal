"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ fileUrl, zoom = 1 }) {
  const [numPages, setNumPages] = useState(null);

  return (
    <div className="flex min-h-full flex-col items-center">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
        }}
        loading={
          <p className="py-10 text-center text-sm text-gray-500">
            Loading PDF...
          </p>
        }
        error={
          <p className="py-10 text-center text-sm text-red-500">
            Failed to load PDF
          </p>
        }
      >
        {Array.from(new Array(numPages || 0), (_, index) => (
          <div key={`page_${index + 1}`} className="mb-4">
            <Page
              pageNumber={index + 1}
              scale={zoom}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
