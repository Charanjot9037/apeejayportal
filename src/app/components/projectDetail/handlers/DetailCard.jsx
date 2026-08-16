"use client";

/* =========================================================
   DETAIL CARD

   Reused wrapper for left-column sections (Overview,
   Technologies, Gallery, Documents). Import Card/CardContent
   from your UI kit at the call site's parent instead of
   duplicating here to keep this file dependency-light.
========================================================= */

import { Card, CardContent } from "@/components/ui/card";

export default function DetailCard({ title, icon, children }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
          <div className="h-4 w-0.5 bg-orange-500" />

          <div className="text-blue-700">{icon}</div>

          <h2 className="text-sm font-semibold text-blue-900">{title}</h2>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}