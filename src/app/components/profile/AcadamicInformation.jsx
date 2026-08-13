"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { Pencil, Check, X } from "lucide-react";

import InformationField from "../elements/InformationField";
import SelectField from "../elements/SelectFiled";
import YearField from "../elements/Calendar";

import { academicInformationSchema } from "@/validations/profileSchema";

const specializationOptions = {
  ENGINEERING: [
    {
      value: "CSE",
      label: "Computer Science & Engineering",
    },
    {
      value: "ECE",
      label: "Electronics & Communication Engineering",
    },
    {
      value: "ME",
      label: "Mechanical Engineering",
    },
    {
      value: "CIVIL",
      label: "Civil Engineering",
    },
    {
      value: "EEE",
      label: "Electrical & Electronics Engineering",
    },
  ],

  MANAGEMENT: [
    {
      value: "FINANCE",
      label: "Finance",
    },
    {
      value: "MARKETING",
      label: "Marketing",
    },
    {
      value: "HR",
      label: "Human Resource Management",
    },
    {
      value: "BUSINESS_ANALYTICS",
      label: "Business Analytics",
    },
  ],

  IT: [
    {
      value: "SOFTWARE_DEVELOPMENT",
      label: "Software Development",
    },
    {
      value: "DATA_SCIENCE",
      label: "Data Science",
    },
    {
      value: "AI_ML",
      label: "Artificial Intelligence & Machine Learning",
    },
    {
      value: "CYBER_SECURITY",
      label: "Cyber Security",
    },
    {
      value: "CLOUD_COMPUTING",
      label: "Cloud Computing",
    },
  ],
};

const programOptions = {
  ENGINEERING: [
    {
      value: "BTECH",
      label: "B.Tech",
    },
  ],

  IT: [
    {
      value: "MCA",
      label: "MCA",
    },
    {
      value: "BCA",
      label: "BCA",
    },
  ],

  MANAGEMENT: [
    {
      value: "MBA",
      label: "MBA",
    },
    {
      value: "BBA",
      label: "BBA",
    },
    {
      value: "BCOM",
      label: "B.Com",
    },
  ],
};

const semesterOptions = {
  BTECH: Array.from({ length: 8 }, (_, index) => ({
    value: String(index + 1),
    label: `Semester ${index + 1}`,
  })),

  BCA: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: `Semester ${index + 1}`,
  })),

  BBA: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: `Semester ${index + 1}`,
  })),

  BCOM: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: `Semester ${index + 1}`,
  })),

  MCA: Array.from({ length: 4 }, (_, index) => ({
    value: String(index + 1),
    label: `Semester ${index + 1}`,
  })),

  MBA: Array.from({ length: 4 }, (_, index) => ({
    value: String(index + 1),
    label: `Semester ${index + 1}`,
  })),
};

export default function AcademicInformation({ data, onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      department: data?.department || "",
      program: data?.program || "",
      specialization: data?.specialization || "",
      currentSemester: data?.currentSemester || "",
      rollNumber: data?.rollNumber || "",
      academicBatch: data?.academicBatch || "",
    },

    enableReinitialize: true,

    validationSchema: academicInformationSchema,

    onSubmit: async (values) => {
      try {
        if (onSave) {
          await onSave(values);
        }

        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save academic information:", error);
      }
    },
  });

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    formik.resetForm();
    setIsEditing(false);
  }

  /*
   * Get options dynamically according to
   * the currently selected department.
   */
  const availablePrograms = programOptions[formik.values.department] || [];

  const availableSpecializations =
    specializationOptions[formik.values.department] || [];

  /*
   * Get semesters dynamically according to
   * the currently selected program.
   */
  const availableSemesters = semesterOptions[formik.values.program] || [];

  /*
   * Department changed
   */
  const handleDepartmentChange = (value) => {
    formik.setFieldValue("department", value);

    // Reset dependent fields
    formik.setFieldValue("program", "");
    formik.setFieldValue("specialization", "");
    formik.setFieldValue("currentSemester", "");
  };

  /*
   * Program changed
   */
  const handleProgramChange = (value) => {
    formik.setFieldValue("program", value);

    // Semester depends on program
    formik.setFieldValue("currentSemester", "");
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {/* HEADER */}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            Academic Information
          </h2>

          <div className="mt-1 h-0.5 w-6 bg-orange-500" />
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-1.5 rounded-md border border-orange-500 px-3 py-1.5 text-sm font-medium text-orange-500 transition hover:bg-orange-50"
          >
            <Pencil size={14} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* CANCEL */}

            <button
              type="button"
              onClick={handleCancel}
              disabled={formik.isSubmitting}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={14} />
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="submit"
              form="academic-information-form"
              disabled={formik.isSubmitting}
              className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={14} />

              {formik.isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* FORM */}

      <form id="academic-information-form" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          {/* =========================
              DEPARTMENT
          ========================== */}

          {!isEditing ? (
            <InformationField
              label="DEPARTMENT"
              name="department"
              value={formik.values.department}
              editing={false}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.department && formik.errors.department}
            />
          ) : (
            <SelectField
              label="DEPARTMENT"
              name="department"
              required
              value={formik.values.department}
              onChange={handleDepartmentChange}
              onBlur={() => formik.setFieldTouched("department", true)}
              error={formik.touched.department && formik.errors.department}
              options={[
                {
                  value: "ENGINEERING",
                  label: "Engineering",
                },
                {
                  value: "MANAGEMENT",
                  label: "Management",
                },
                {
                  value: "IT",
                  label: "IT",
                },
              ]}
            />
          )}

          {/* =========================
              PROGRAM
          ========================== */}

          {!isEditing ? (
            <InformationField
              label="PROGRAM / DEGREE"
              name="program"
              value={formik.values.program}
              editing={false}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.program && formik.errors.program}
            />
          ) : (
            <SelectField
              label="PROGRAM / DEGREE"
              name="program"
              required
              value={formik.values.program}
              onChange={handleProgramChange}
              onBlur={() => formik.setFieldTouched("program", true)}
              error={formik.touched.program && formik.errors.program}
              options={availablePrograms}
            />
          )}

          {/* =========================
              SPECIALIZATION
          ========================== */}

          {!isEditing ? (
            <InformationField
              label="SPECIALIZATION"
              name="specialization"
              value={formik.values.specialization}
              editing={false}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.specialization && formik.errors.specialization
              }
            />
          ) : (
            <SelectField
              label="SPECIALIZATION"
              name="specialization"
              required
              value={formik.values.specialization}
              onChange={(value) =>
                formik.setFieldValue("specialization", value)
              }
              onBlur={() => formik.setFieldTouched("specialization", true)}
              error={
                formik.touched.specialization && formik.errors.specialization
              }
              options={availableSpecializations}
            />
          )}

          {/* =========================
              CURRENT SEMESTER
          ========================== */}

          {!isEditing ? (
            <InformationField
              label="CURRENT SEMESTER"
              name="currentSemester"
              value={
                formik.values.currentSemester
                  ? `Semester ${formik.values.currentSemester}`
                  : ""
              }
              editing={false}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.currentSemester && formik.errors.currentSemester
              }
            />
          ) : (
            <SelectField
              label="CURRENT SEMESTER"
              name="currentSemester"
              required
              value={formik.values.currentSemester}
              onChange={(value) =>
                formik.setFieldValue("currentSemester", value)
              }
              onBlur={() => formik.setFieldTouched("currentSemester", true)}
              error={
                formik.touched.currentSemester && formik.errors.currentSemester
              }
              options={availableSemesters}
            />
          )}

          {/* =========================
              ROLL NUMBER
          ========================== */}

          <InformationField
            label="ROLL NUMBER"
            name="rollNumber"
            value={formik.values.rollNumber}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.rollNumber && formik.errors.rollNumber}
          />

          {/* =========================
              ACADEMIC BATCH
          ========================== */}

          {isEditing ? (
            <YearField
              label="ACADEMIC BATCH"
              name="academicBatch"
              required
              placeholder="Select batch"
              formik={formik}
              error={
                formik.touched.academicBatch && formik.errors.academicBatch
              }
            />
          ) : (
            <InformationField
              label="ACADEMIC BATCH"
              name="academicBatch"
              value={formik.values.academicBatch}
              editing={false}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.academicBatch && formik.errors.academicBatch
              }
            />
          )}
        </div>
      </form>
    </section>
  );
}
