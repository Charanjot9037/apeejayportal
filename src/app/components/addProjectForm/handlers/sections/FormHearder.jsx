"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* =========================================================
   FORM HEADER
========================================================= */

export default function FormHeader({ isEdit }) {
  return (
    <>
      <Link
        href="/student"
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-blue-900">
          {isEdit ? "Update Project" : "Add Project"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {isEdit
            ? "Update your project details and submit the changes for review."
            : "Submit your project details for academic review or portfolio showcase."}
        </p>
      </div>
    </>
  );
}