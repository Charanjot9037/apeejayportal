"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/* =========================================================
   NOT FOUND STATE
========================================================= */

export default function NotFoundState() {
  const router = useRouter();

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
      <p className="text-sm text-slate-500">Project not found.</p>

      <Button onClick={() => router.push("/student")} variant="outline">
        Back to Dashboard
      </Button>
    </div>
  );
}