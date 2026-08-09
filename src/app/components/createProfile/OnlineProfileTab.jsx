"use client";

import { FileText, Link as LinkIcon, Upload, X } from "lucide-react";

import InputField from "../elements/InputField";

export default function OnlineProfilesTab({
  formik,
  getError,
  resumeInputRef,
  handleResume,
  removeResume,
  onBack,
  onSubmit,
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">



      <div>
        <div className="flex items-center gap-2 text-main-blue">

          <LinkIcon size={18} />

          <h2 className="text-xl font-semibold">
            Online Profiles
          </h2>

        </div>

        <div className="mt-1 h-0.5 w-6 bg-orange-500" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

        <InputField
          label="LINKEDIN"
          name="linkedin"
          placeholder="https://linkedin.com/in/username"
          formik={formik}
          error={getError("linkedin")}
        />
        <InputField
          label="GITHUB"
          name="github"
          placeholder="https://github.com/username"
          formik={formik}
          error={getError("github")}
        />

        <InputField
          label="PORTFOLIO"
          name="portfolio"
          placeholder="https://yourportfolio.com"
          formik={formik}
          error={getError("portfolio")}
        />

      </div>

      {/* ==========================================
          RESUME
      ========================================== */}

      <div className="mt-8">

        <div className="flex items-center gap-2 text-main-blue">

          <FileText size={18} />

          <h2 className="text-xl font-semibold">
            Resume
          </h2>

        </div>

        <div className="mt-1 h-0.5 w-6 bg-orange-500" />

      </div>

      <div className="mt-6">

        <input
          ref={resumeInputRef}
          type="file"
          required
          accept=".pdf,.doc,.docx"
          onChange={handleResume}
          className="hidden"
        />

      {!formik.values.resumeFile ? (
  <button
    type="button"
    onClick={() => resumeInputRef.current?.click()}
    className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-orange-400 hover:bg-orange-50/30"
  >
    <Upload size={28} className="text-gray-400" />

    <p className="mt-2 text-sm font-medium text-gray-600">
      Upload your resume
    </p>

    <p className="mt-1 text-xs text-gray-400">
      PDF, DOC or DOCX · Max 5MB
    </p>
  </button>
) : (
  <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
    <div className="flex items-center gap-3">
      <FileText
        size={22}
        className="text-main-blue"
      />

      <div>
        <p className="text-sm font-medium text-gray-700">
          {formik.values.resumeFile.name}
        </p>

        <p className="text-xs text-gray-400">
          {(formik.values.resumeFile.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={removeResume}
      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-red-50 hover:text-red-500"
    >
      <X size={15} />
    </button>
  </div>
)}

        {getError("resume") && (
          <p className="mt-1 text-xs text-red-500">
            {getError("resume")}
          </p>
        )}

      </div>

      {/* ==========================================
          BUTTONS
      ========================================== */}

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
          onClick={onSubmit}
          className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          Complete Profile
        </button>

      </div>

    </div>
  );
}