"use client";

import { Input } from "@/components/ui/input";

/* =========================================================
   TEAM INPUT
========================================================= */

export default function TeamInput({
  label,
  required = false,
  type = "text",
  value,
  placeholder,
  error,
  onChange,
  onBlur,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}

        {required && <span className="text-orange-500"> *</span>}
      </label>

      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`h-10 bg-white text-sm ${error ? "border-red-500" : ""}`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}