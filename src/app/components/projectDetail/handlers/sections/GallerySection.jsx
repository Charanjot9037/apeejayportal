'use client';

import { Image as ImageIcon, Eye } from 'lucide-react';

import DetailCard from '../DetailCard';

/* =========================================================
   GALLERY SECTION
========================================================= */

export default function GallerySection({ project }) {
  return (
    <DetailCard title="Project Gallery" icon={<ImageIcon />}>
      {project.projectImages?.length ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {project.projectImages.map((image, index) => (
            <div
              key={image.publicId || index}
              className="overflow-hidden rounded border border-slate-200 bg-white"
            >
              <div className="group relative aspect-[16/8.5] overflow-hidden bg-slate-100">
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
                  className="absolute right-1.5 top-1.5 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Eye className="h-3 w-3" />
                </a>
              </div>

              <div className="px-2 py-1.5">
                <p className="truncate text-xs font-medium text-slate-700">
                  {image.originalName || `Project Image ${index + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[100px] items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-1.5 h-5 w-5 text-slate-300" />

            <p className="text-xs text-slate-400">
              No project images uploaded.
            </p>
          </div>
        </div>
      )}
    </DetailCard>
  );
}
