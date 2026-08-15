"use client";

import { X } from "lucide-react";

/* =========================================================
   PROJECT IMAGE PREVIEW
========================================================= */

export default function ProjectImagePreview({ file, onRemove }) {
  const imageUrl = URL.createObjectURL(file);

  return (
    <div className="group relative min-h-[130px] overflow-hidden rounded-md border border-slate-200 bg-slate-100">
      <img
        src={imageUrl}
        alt={file.name}
        className="h-[130px] w-full object-cover"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 text-[10px] text-white">
        {file.name}
      </div>
    </div>
  );
}