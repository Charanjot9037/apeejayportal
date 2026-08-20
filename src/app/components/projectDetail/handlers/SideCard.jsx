"use client";

import { Card, CardContent } from "@/components/ui/card";

/* =========================================================
   SIDE CARD

   Reused wrapper for right-column sections (Team, Mentor,
   Project Info, Approval History).
========================================================= */

export default function SideCard({ title, children }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="">
        <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wide text-blue-800">
          {title}
        </h3>

        {children}
      </CardContent>
    </Card>
  );
}