"use client";

import { Code } from "lucide-react";

import TextAreaField from "../elements/TextField";

export default function SkillsInterestsTab({
  formik,
  getError,
  onBack,
  onNext,
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div>
        <div className="flex items-center gap-2 text-main-blue">

          <Code size={18} />

          <h2 className="text-xl font-semibold">
            Skills & Interests
          </h2>

        </div>

        <div className="mt-1 h-0.5 w-6 bg-orange-500" />
      </div>

      {/* FIELDS */}

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

        <TextAreaField
          required
          label="SKILLS"
          name="skills"
          placeholder="React, Next.js, MongoDB, Node.js..."
          formik={formik}
          error={getError("skills")}
        />

        <TextAreaField
          required
          label="INTERESTS"
          name="interests"
          placeholder="Web Development, AI, Cloud Computing..."
          formik={formik}
          error={getError("interests")}
        />

      </div>

      {/* BUTTONS */}

      <div className="mt-8 flex justify-between">

        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          Save & Continue
        </button>

      </div>

    </div>
  );
}