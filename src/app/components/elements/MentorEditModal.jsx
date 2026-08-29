"use client";

import { X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectField from "./SelectFiled";
import InputField from "./InputField";

const MentorEditModal = ({ mentor, onClose, onUpdated }) => {
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: mentor?.name || "",

      email: mentor?.email || "",

      mobileNumber:
        mentor?.mobileNumber || mentor?.mobile || mentor?.contact || "",

      department: mentor?.department || "",

      designation: mentor?.designation || "",

      status: mentor?.status || "",
    },

    validationSchema: Yup.object({
      name: Yup.string().trim().required("Name is required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10 digit mobile number")
        .required("Mobile number is required"),

      department: Yup.string().required("Department is required"),

      designation: Yup.string().required("Designation is required"),

      status: Yup.string()
        .oneOf(["active", "inactive"])
        .required("Status is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        // IMPORTANT:
        // mentor._id is the Mentor collection ID
        const mentorId = mentor?._id || mentor?.id;

        console.log("Updating mentor:", mentorId);

        if (!mentorId) {
          throw new Error("Mentor ID not found");
        }

        const response = await fetch("/api/mentors", {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mentorId,
            ...values,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to update mentor");
        }

        console.log("Updated mentor:", data.mentor);

        // Same approach as StudentEditModal
        onUpdated(data.mentor);
      } catch (error) {
        console.error("UPDATE_MENTOR_ERROR:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1c3a5e]">
              Edit Mentor
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update mentor information
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

        {/* FORM */}

        <form onSubmit={formik.handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              label="Full Name"
              name="name"
              required
              formik={formik}
              error={formik.touched.name && formik.errors.name}
            />

            <InputField
              label="Email"
              name="email"
              required
              formik={formik}
              error={formik.touched.email && formik.errors.email}
            />

            <InputField
              label="Mobile Number"
              name="mobileNumber"
              required
              formik={formik}
              error={formik.touched.mobileNumber && formik.errors.mobileNumber}
            />

            <InputField
              label="Department"
              name="department"
              required
              formik={formik}
              error={formik.touched.department && formik.errors.department}
            />

            <InputField
              label="Designation"
              name="designation"
              required
              formik={formik}
              error={formik.touched.designation && formik.errors.designation}
            />

            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-sm font-medium text-primary"
              >
                STATUS
              </label>

              <select
                id="status"
                name="status"
                value={formik.values.status || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-10 w-full rounded-md border bg-slate-100 px-3 text-sm text-gray-700 outline-none transition ${
                  formik.touched.status && formik.errors.status
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select status</option>

                <option value="active">Active</option>

                <option value="inactive">Inactive</option>
              </select>

              {formik.touched.status && formik.errors.status && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.status}
                </p>
              )}
            </div>
          </div>

          {/* BUTTONS */}

          <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={formik.isSubmitting}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-primary-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#df681c]"
            >
              {formik.isSubmitting ? "Updating..." : "Update Mentor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorEditModal;
