"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

/* =========================================================
   FORM ACTIONS
========================================================= */

export default function FormActions({ formik, isEdit }) {
  
  return (
    <div className="mt-7 flex justify-end gap-3 border-t border-slate-200 pt-4">
      <Link href="/student">
        <Button type="button" variant="outline" className="border-slate-400">
          Cancel
        </Button>
      </Link>

      <Button
        type="button"
        variant="outline"
        className="border-orange-500 text-orange-500 hover:bg-orange-50"
        onClick={() => {
          console.log("Save draft", formik.values);
        }}
      >
        Save Draft
      </Button>

      <Button
        type="submit"
        disabled={formik.isSubmitting}
        className="bg-orange-500 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formik.isSubmitting
          ? "Uploading..."
          : isEdit
            ? "Save Changes"
            : "Send for Approval"}
      </Button>
    </div>
  );
}