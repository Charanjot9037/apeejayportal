"use client";

import { X, Eye } from "lucide-react";

/* =========================================================
   EXISTING PROJECT IMAGES GRID
========================================================= */

export default function ExistingImagesGrid({ images, onRemove }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-medium text-slate-700">
        Existing Project Images
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((image, index) => {
          const imageUrl = typeof image === "string" ? image : image?.url;

          const imageName =
            typeof image === "string"
              ? `Project image ${index + 1}`
              : image?.originalName || `Project image ${index + 1}`;

          if (!imageUrl) return null;

          return (
            <div
              key={image?.publicId || imageUrl || index}
              className="group relative overflow-hidden rounded-md border border-slate-200 bg-slate-100"
            >
              <img
                src={imageUrl}
                alt={imageName}
                className="h-32 w-full object-cover"
              />

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                title="Remove existing image"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-black/60 px-2 py-1">
                <span className="truncate text-[10px] text-white">
                  {imageName}
                </span>

                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-white hover:text-orange-300"
                  title="View image"
                >
                  <Eye className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}