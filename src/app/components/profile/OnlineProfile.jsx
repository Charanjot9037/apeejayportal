"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { Pencil, Check, X, Globe, Code2 } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { onlineProfilesSchema } from "@/validations/profileSchema";

const defaultData = {
  github: "https://github.com/alexjohnson",
  linkedin: "https://linkedin.com/in/alexjohnson",
  portfolio: "https://alexjohnson.dev",
  leetcode: "https://leetcode.com/alexjohnson",
  twitter: "https://twitter.com/alexjohnson_dev",
};

export default function OnlineProfiles({ data = defaultData, onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      github: data.github || "",
      linkedin: data.linkedin || "",
      portfolio: data.portfolio || "",
      leetcode: data.leetcode || "",
      twitter: data.twitter || "",
    },

    validationSchema: onlineProfilesSchema,

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        if (onSave) {
          await onSave(values);
        }

        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save online profiles:", error);
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

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            Online Profiles & Links
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
              form="online-profiles-form"
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

      <form id="online-profiles-form" onSubmit={formik.handleSubmit}>
        <div className="space-y-3">
          {/* GITHUB */}

          <ProfileField
            label="GitHub"
            name="github"
            icon={<FaGithub size={14} />}
            value={formik.values.github}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.github && formik.errors.github}
          />

          {/* LINKEDIN */}

          <ProfileField
            label="LinkedIn"
            name="linkedin"
            icon={<FaLinkedin size={14} />}
            value={formik.values.linkedin}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.linkedin && formik.errors.linkedin}
          />

          {/* PORTFOLIO */}

          <ProfileField
            label="Portfolio Website"
            name="portfolio"
            icon={<Globe size={14} />}
            value={formik.values.portfolio}
            editing={isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.portfolio && formik.errors.portfolio}
          />
        </div>
      </form>
    </section>
  );
}

/* =================================================
   REUSABLE PROFILE FIELD
================================================= */

function ProfileField({
  label,
  name,
  icon,
  value,
  editing,
  onChange,
  onBlur,
  error,
}) {
  return (
    <div className="flex gap-3">
      {/* ==========================================
          ICON
      ========================================== */}

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-50 text-primary">
        {icon}
      </div>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <div className="min-w-0 flex-1">
        {/* LABEL */}

        <label
          htmlFor={name}
          className="mb-0.5 block text-sm font-medium text-gray-500"
        >
          {label}
        </label>

        {/* ========================================
            EDIT MODE
        ======================================== */}

        {editing ? (
          <>
            <input
              id={name}
              name={name}
              type="url"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={`Enter ${label} URL`}
              className={`h-8 w-full rounded-md border bg-white px-2.5 text-sm text-gray-700 outline-none transition focus:ring-1 ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
              }`}
            />

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </>
        ) : (
          /* ========================================
             VIEW MODE
          ======================================== */

          <a
            href={value || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`block truncate text-xs ${
              value ? "text-orange-500 hover:underline" : "text-gray-400"
            }`}
          >
            {value || "-"}
          </a>
        )}
      </div>
    </div>
  );
}
