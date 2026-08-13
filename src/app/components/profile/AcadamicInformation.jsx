"use client";

import { useState } from "react";
import { useFormik } from "formik";
import InformationField from "../elements/InformationField";
import { Pencil, Check, X } from "lucide-react";
import { academicInformationSchema} from "@/validations/profileSchema"
const defaultData = {
  university: "Punjab Engineering College",
  department: "Computer Science & Engineering",
  program: "B.Tech",
  currentSemester: "6th Semester",
  rollNumber: "21CS1045",
  cumulativeGPA: "8.42",
  academicBatch: "2021-2025",
};

export default function AcademicInformation({
  data ,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      department: data.department || "",
      program: data.program || "",
      currentSemester: data.currentSemester || "",
      rollNumber: data.rollNumber || "",
      academicBatch: data.academicBatch || "",
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
        console.error(
          "Failed to save academic information:",
          error
        );
      }
    },
  });

  /* ================================================
     EDIT
  ================================================ */

  function handleEdit() {
    setIsEditing(true);
  }

  /* ================================================
     CANCEL
  ================================================ */

  function handleCancel() {
    formik.resetForm();
    setIsEditing(false);
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {/* ============================================
          HEADER
      ============================================ */}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            Academic Information
          </h2>

          <div className="mt-1 h-0.5 w-6 bg-orange-500" />
        </div>

        {/* ==========================================
            ACTION BUTTONS
        ========================================== */}

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

      {/* ============================================
          FORM
      ============================================ */}

      <form
        id="academic-information-form"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          {/* UNIVERSITY */}

          {/* DEPARTMENT */}

          <InformationField
            label="DEPARTMENT"
            name="department"
            value={formik.values.department}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.department &&
              formik.errors.department
            }
          />

          {/* PROGRAM / DEGREE */}

          <InformationField
            label="PROGRAM / DEGREE"
            name="program"
            value={formik.values.program}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.program &&
              formik.errors.program
            }
          />

          {/* CURRENT SEMESTER */}

          <InformationField
            label="CURRENT SEMESTER"
            name="currentSemester"
            value={formik.values.currentSemester}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.currentSemester &&
              formik.errors.currentSemester
            }
          />

          {/* ROLL NUMBER */}

          <InformationField
            label="ROLL NUMBER"
            name="rollNumber"
            value={formik.values.rollNumber}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.rollNumber &&
              formik.errors.rollNumber
            }
          />

          {/* CUMULATIVE GPA */}
          {/* ACADEMIC BATCH */}

          <InformationField
            label="ACADEMIC BATCH"
            name="academicBatch"
            value={formik.values.academicBatch}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.academicBatch &&
              formik.errors.academicBatch
            }
          />
        </div>
      </form>
    </section>
  );
}

