"use client";

/* =========================================================
   SMALL INFORMATION ITEM
========================================================= */

export default function SmallInfo({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-orange-500">{icon}</div>

      <div>
        <p className="text-[8px] uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-[10px] font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}