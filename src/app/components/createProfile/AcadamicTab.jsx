"use client";

import { GraduationCap } from "lucide-react";

import InputField from "../elements/InputField";

export default function AcademicInformationTab({
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

          <GraduationCap size={18} />

          <h2 className="text-xl font-semibold">
            Academic Information
          </h2>

        </div>

        <div className="mt-1 h-0.5 w-6 bg-orange-500" />
      </div>

      {/* FIELDS */}

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

        <InputField
          label="UNIVERSITY"
          name="university"
          required
          placeholder="Enter university"
          formik={formik}
          error={getError("university")}
        />

        <InputField
          label="DEPARTMENT"
          name="department"
          required
          placeholder="Computer Science & Engineering"
          formik={formik}
          error={getError("department")}
        />

        <InputField
          label="PROGRAM / DEGREE"
          name="program"
          required
          placeholder="B.Tech"
          formik={formik}
          error={getError("program")}
        />

        <InputField
          label="CURRENT SEMESTER"
          name="currentSemester"
          required
          placeholder="6th Semester"
          formik={formik}
          error={getError("currentSemester")}
        />

        <InputField
          label="ROLL NUMBER"
          name="rollNumber"
          required
          placeholder="Enter roll number"
          formik={formik}
          error={getError("rollNumber")}
        />

        <InputField
          label="CUMULATIVE GPA (CGPA)"
          name="cumulativeGPA"
          required
          placeholder="8.42"
          formik={formik}
          error={getError("cumulativeGPA")}
        />

        <InputField
          label="ACADEMIC BATCH"
          name="academicBatch"
          required
          placeholder="2023-2027"
          formik={formik}
          error={getError("academicBatch")}
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