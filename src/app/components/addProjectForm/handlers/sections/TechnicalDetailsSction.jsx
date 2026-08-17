"use client";

import { Link as LinkIcon, Code2 } from "lucide-react";

import { Input } from "@/components/ui/input";

/* =========================================================
   TECHNICAL DETAILS SECTION
========================================================= */

export default function TechnicalDetailsSection({
  formik,
  addTechnology,
  removeTechnology,
}) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
        <span className="border-b-2 border-orange-500 pb-2">
          Technical Details
        </span>
      </h2>

      {/* TECH STACK */}

      <div className="mt-4">
        <label className="mb-2 block text-xs font-medium text-slate-700">
          Tech Stack <span className="text-orange-500">*</span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {formik.values.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-orange-50 px-3 py-1 text-xs text-slate-600"
            >
              {tech}

              <button
                type="button"
                onClick={() => removeTechnology(tech)}
                className="ml-1 text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={addTechnology}
            className="text-xs text-slate-400 hover:text-orange-500"
          >
            + Add tech...
          </button>
        </div>

        {formik.touched.techStack && formik.errors.techStack && (
          <p className="mt-1 text-xs text-red-500">
            {formik.errors.techStack}
          </p>
        )}
      </div>

      {/* LINKS */}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* GITHUB */}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            GitHub Link
          </label>

          <div className="relative">
            <Code2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              name="githubLink"
              value={formik.values.githubLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="https://github.com/..."
              className="h-10 bg-slate-50 pl-9 text-sm"
            />
          </div>

          {formik.touched.githubLink && formik.errors.githubLink && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors.githubLink}
            </p>
          )}
        </div>

        {/* LIVE DEMO */}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Live Demo Link
          </label>

          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              name="liveDemoLink"
              value={formik.values.liveDemoLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="https://..."
              className="h-10 bg-slate-50 pl-9 text-sm"
            />
          </div>

          {formik.touched.liveDemoLink && formik.errors.liveDemoLink && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors.liveDemoLink}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}