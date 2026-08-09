"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { Pencil, Check, X, Plus, Trash2 } from "lucide-react";

const defaultData = {
  technicalSkills: [
    "Python",
    "React",
    "Node.js",
    "Machine Learning",
    "Docker",
    "AWS",
    "SQL",
    "TensorFlow",
  ],

  interests: [
    "AI Research",
    "Open Source",
    "Competitive Programming",
    "Cloud Computing",
  ],
};

export default function SkillsAndInterests({
  data = defaultData,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      technicalSkills: data.technicalSkills || [],
      interests: data.interests || [],
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        if (onSave) {
          await onSave(values);
        }

        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save skills and interests:", error);
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


  function addSkill(skill) {
    const trimmedSkill = skill.trim();

    if (
      trimmedSkill &&
      !formik.values.technicalSkills.includes(trimmedSkill)
    ) {
      formik.setFieldValue("technicalSkills", [
        ...formik.values.technicalSkills,
        trimmedSkill,
      ]);
    }
  }



  function removeSkill(index) {
    const updatedSkills = formik.values.technicalSkills.filter(
      (_, i) => i !== index
    );

    formik.setFieldValue("technicalSkills", updatedSkills);
  }


  function addInterest(interest) {
    const trimmedInterest = interest.trim();

    if (
      trimmedInterest &&
      !formik.values.interests.includes(trimmedInterest)
    ) {
      formik.setFieldValue("interests", [
        ...formik.values.interests,
        trimmedInterest,
      ]);
    }
  }


  function removeInterest(index) {
    const updatedInterests = formik.values.interests.filter(
      (_, i) => i !== index
    );

    formik.setFieldValue("interests", updatedInterests);
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {/* ============================================
          HEADER
      ============================================ */}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-main-blue">
            Skills & Interests
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
              form="skills-interests-form"
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
        id="skills-interests-form"
        onSubmit={formik.handleSubmit}
      >
        {/* ==========================================
            TECHNICAL SKILLS
        ========================================== */}

        <SkillSection
          title="Technical Skills"
          items={formik.values.technicalSkills}
          editing={isEditing}
          type="skill"
          onAdd={addSkill}
          onRemove={removeSkill}
        />

        {/* ==========================================
            INTERESTS
        ========================================== */}

        <div className="mt-5">
          <SkillSection
            title="Interests"
            items={formik.values.interests}
            editing={isEditing}
            type="interest"
            onAdd={addInterest}
            onRemove={removeInterest}
          />
        </div>
      </form>
    </section>
  );
}

/* =================================================
   REUSABLE SKILL SECTION
================================================= */

function SkillSection({
  title,
  items,
  editing,
  type,
  onAdd,
  onRemove,
}) {
  const [inputValue, setInputValue] = useState("");

  function handleAdd() {
    if (!inputValue.trim()) return;

    onAdd(inputValue);
    setInputValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div>
      {/* LABEL */}

      <p className="mb-2 text-sm font-medium text-gray-600">
        {title}
      </p>

      {/* ==========================================
          TAGS
      ========================================== */}

      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <SkillTag
              key={`${item}-${index}`}
              text={item}
              type={type}
              editing={editing}
              onRemove={() => onRemove(index)}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400">
            No {title.toLowerCase()} added.
          </p>
        )}
      </div>

      {/* ==========================================
          ADD INPUT
      ========================================== */}

      {editing && (
        <div className="mt-3 flex w-full max-w-md gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Add ${title.toLowerCase()}`}
            className="h-9 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />

          <button
            type="button"
            onClick={handleAdd}
            className="flex h-9 items-center gap-1 rounded-md bg-orange-500 px-3 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      )}
    </div>
  );
}

/* =================================================
   REUSABLE TAG
================================================= */

function SkillTag({
  text,
  type,
  editing,
  onRemove,
}) {
  const isSkill = type === "skill";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        isSkill
          ? "bg-orange-50 text-orange-500"
          : "bg-blue-50 text-blue-600"
      }`}
    >
      {text}

      {editing && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 transition hover:bg-black/5"
          aria-label={`Remove ${text}`}
        >
          <Trash2 size={10} />
        </button>
      )}
    </span>
  );
}