"use client";

import { Image as ImageIcon, Eye } from "lucide-react";

import DetailCard from "../DetailCard";

/* =========================================================
   GALLERY SECTION
========================================================= */

export default function GallerySection({ project }) {
  return (
    <DetailCard title="Project Gallery" icon={<ImageIcon />}>
      {project.projectImages?.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {project.projectImages.map((image, index) => (
            <div
              key={image.publicId || index}
              className="overflow-hidden rounded border border-slate-200 bg-white"
            >
              <div className="group relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={image.url}
                  alt={image.originalName || `Project image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* View button */}
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-2 rounded-md bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="px-2.5 py-2">
                <p className="truncate text-sm font-medium text-slate-700">
                  {image.originalName || `Project Image ${index + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[130px] items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-2 h-6 w-6 text-slate-300" />

            <p className="text-xs text-slate-400">
              No project images uploaded.
            </p>
          </div>
        </div>
      )}
    </DetailCard>
  );
}