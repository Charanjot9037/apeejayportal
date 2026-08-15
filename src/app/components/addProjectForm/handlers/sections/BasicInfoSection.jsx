"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* =========================================================
   BASIC INFORMATION SECTION
========================================================= */

export default function BasicInfoSection({ formik }) {
  return (
    <section>
      <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
        <span className="border-b-2 border-orange-500 pb-2">
          Basic Information
        </span>
      </h2>

      <div className="mt-4 space-y-4">
        {/* PROJECT NAME */}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Project Name <span className="text-orange-500">*</span>
          </label>

          <Input
            name="projectName"
            value={formik.values.projectName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter project title"
            className={`h-10 bg-slate-50 text-sm ${
              formik.touched.projectName && formik.errors.projectName
                ? "border-red-500"
                : ""
            }`}
          />

          {formik.touched.projectName && formik.errors.projectName && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors.projectName}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Description <span className="text-orange-500">*</span>
          </label>

          <Textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Provide a detailed overview of your project, its objectives, and outcomes."
            className={`min-h-[100px] resize-none bg-slate-50 text-sm ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : ""
            }`}
          />

          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}