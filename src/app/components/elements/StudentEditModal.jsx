"use client";

import { X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import InputField from "./InputField";

const StudentEditModal = ({ student, onClose, onUpdated }) => {
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  // ==========================================
  // FETCH MENTORS
  // ==========================================

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoadingMentors(true);

        const response = await fetch("/api/mentors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: student?.department,
          }),
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch mentors");
        }

        setMentors(data.mentors || []);
      } catch (error) {
        console.error("FETCH_MENTORS_ERROR:", error);
        setMentors([]);
      } finally {
        setLoadingMentors(false);
      }
    };

    fetchMentors();
  }, []);

  // ==========================================
  // FORMIK
  // ==========================================

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      fullName: student?.name || student?.fullName || "",

      department: student?.department || "",

      program: student?.program || "",

      academicBatch: student?.academicBatch || "",

      specialization: student?.specialization || "",

      // Current mentor name
      mentor: student?.mentor || "",

      // Current mentor ID
      mentorId: student?.mentorId || "",
    },

    validationSchema: Yup.object({
      fullName: Yup.string().trim().required("Full name is required"),

      department: Yup.string().required("Department is required"),

      program: Yup.string().required("Program is required"),

      academicBatch: Yup.string().required("Academic batch is required"),

      specialization: Yup.string(),

      mentorId: Yup.string().required("Mentor is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch("/api/admin/getstudents", {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            studentId: student._id,

            ...values,

            // Only this ID is important for mentor update
            mentorId: values.mentorId,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to update student");
        }

        onUpdated(data.student);
      } catch (error) {
        console.error("UPDATE_STUDENT_ERROR:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ==========================================
  // MENTOR CHANGE
  // ==========================================

  const handleMentorChange = (e) => {
    const mentorId = e.target.value;

    // Update Formik mentorId
    formik.setFieldValue("mentorId", mentorId);

    // Find selected mentor
    const selectedMentor = mentors.find((mentor) => {
      const id = mentor?.userId?._id || mentor?.userId;

      return id?.toString() === mentorId?.toString();
    });

    // Store mentor name as well
    formik.setFieldValue(
      "mentor",
      selectedMentor?.userId?.name || selectedMentor?.name || "",
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1c3a5e]">
              Edit Student
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update student and mentor information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ======================================
            FORM
        ====================================== */}

        <form onSubmit={formik.handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* FULL NAME */}

            <InputField
              label="Full Name"
              name="fullName"
              required
              formik={formik}
              error={formik.touched.fullName && formik.errors.fullName}
            />

            {/* EMAIL */}

            <InputField
              label="Department"
              name="department"
              required
              formik={formik}
              error={formik.touched.department && formik.errors.department}
            />

            {/* PROGRAM */}

            <InputField
              label="Program"
              name="program"
              required
              formik={formik}
              error={formik.touched.program && formik.errors.program}
            />

            {/* ACADEMIC BATCH */}

            <InputField
              label="Academic Batch"
              name="academicBatch"
              required
              formik={formik}
              error={
                formik.touched.academicBatch && formik.errors.academicBatch
              }
            />

            {/* SPECIALIZATION */}

            <InputField
              label="Specialization"
              name="specialization"
              formik={formik}
              error={
                formik.touched.specialization && formik.errors.specialization
              }
            />

            {/* ==================================
                MENTOR SELECT
            ================================== */}

            <div>
              <label
                htmlFor="mentorId"
                className="mb-1.5 block text-sm font-medium text-primary"
              >
                Mentor
                <span className="ml-1 text-main-blue">*</span>
              </label>

              <div className="relative">
                <select
                  id="mentorId"
                  name="mentorId"
                  value={formik.values.mentorId || ""}
                  onChange={handleMentorChange}
                  onBlur={formik.handleBlur}
                  disabled={loadingMentors}
                  className={`
                    h-10 w-full
                    appearance-none
                    rounded-md
                    border
                    bg-slate-100
                    px-3 pr-9
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    focus:ring-1

                    ${
                      formik.touched.mentorId && formik.errors.mentorId
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 focus:border-main-blue focus:ring-main-blue/20"
                    }

                    ${loadingMentors ? "cursor-not-allowed opacity-60" : ""}
                  `}
                >
                  <option value="">
                    {loadingMentors ? "Loading mentors..." : "Select mentor"}
                  </option>

                  {mentors.map((mentor) => {
                    const mentorId = mentor?.userId?._id || mentor?.userId;

                    const mentorName =
                      mentor?.userId?.name || mentor?.name || "Unknown Mentor";

                    return (
                      <option key={mentorId} value={mentorId}>
                        {mentorName}
                      </option>
                    );
                  })}
                </select>

                <ChevronDown
                  className="
                    pointer-events-none
                    absolute right-3 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-slate-400
                  "
                />
              </div>

              {formik.touched.mentorId && formik.errors.mentorId && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.mentorId}
                </p>
              )}
            </div>
          </div>

          {/* ======================================
              BUTTONS
          ====================================== */}

          <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={formik.isSubmitting}
              className="
                rounded-lg
                border border-slate-200
                px-5 py-2.5
                text-sm font-medium
                text-slate-600
                transition
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="
                rounded-lg
                bg-primary-orange
                px-5 py-2.5
                text-sm font-semibold
                text-white
                transition
                hover:bg-[#df681c]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {formik.isSubmitting ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEditModal;
