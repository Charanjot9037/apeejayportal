"use client";

import { X } from "lucide-react";

export default function ProjectImagePreview({ image, onRemove }) {
  return (
    <div className="group relative min-h-[130px] overflow-hidden rounded-md border border-slate-200 bg-slate-100">
      <img
        src={image.url}
        alt={image.originalName || "Project image"}
        className="h-[130px] w-full object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-2 py-1 text-xs text-white">
        {image.originalName}
      </div>
    </div>
  );
}
