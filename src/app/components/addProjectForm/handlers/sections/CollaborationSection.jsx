"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import TeamMemberCard from "./TeamMemberCard";
import { use, useEffect, useState } from "react";
/* =========================================================
   COLLABORATION SECTION
========================================================= */

export default function CollaborationSection({
  formik,
  addTeamMember,
  removeTeamMember,
  getTeamError,
}) {
  const [mentors, setMentors] = useState();
  const [loading, setMentorLoading] = useState(false);
  const department = useSelector((state) => state.student.department);
  useEffect(() => {
    if (!department) return;

    const fetchMentors = async () => {
      try {
        setMentorLoading(true);

        const response = await fetch("/api/mentors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setMentors(data.mentors);
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
        setMentors([]);
      } finally {
        setMentorLoading(false);
      }
    };

    fetchMentors();
  }, [department]);

  const handleFieldChange = (index, field, value) => {
    formik.setFieldValue(`teamMembers[${index}].${field}`, value);
  };

  const handleFieldBlur = (index, field) => {
    formik.setFieldTouched(`teamMembers[${index}].${field}`, true);
  };

  return (
    <section className="mt-6">
      <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
        <span className="border-b-2 border-orange-500 pb-2">Collaboration</span>
      </h2>

      {/* PROJECT TYPE */}

      <div className="mt-4">
        <label className="mb-2 block text-xs font-medium text-slate-700">
          Project Type
        </label>

        <div className="flex gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="radio"
              name="projectType"
              value="individual"
              checked={formik.values.projectType === "individual"}
              onChange={formik.handleChange}
              className="accent-orange-500"
            />
            Individual
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="radio"
              name="projectType"
              value="team"
              checked={formik.values.projectType === "team"}
              onChange={formik.handleChange}
              className="accent-orange-500"
            />
            Team
          </label>
        </div>
      </div>

      {/* TEAM MEMBERS */}

      {formik.values.projectType === "team" && (
        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Team Members
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Add the students who are working on this project.
              </p>
            </div>

            <span className="text-xs text-slate-400">
              {formik.values.teamMembers.length}{" "}
              {formik.values.teamMembers.length === 1 ? "Member" : "Members"}
            </span>
          </div>

          <div className="space-y-4">
            {formik.values.teamMembers.map((member, index) => (
              <TeamMemberCard
                key={index}
                member={member}
                index={index}
                canRemove={formik.values.teamMembers.length > 1}
                onRemove={() => removeTeamMember(index)}
                getTeamError={getTeamError}
                onFieldChange={handleFieldChange}
                onFieldBlur={handleFieldBlur}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addTeamMember}
            className="mt-4 flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            <span className="text-lg leading-none">+</span>
            Add Team Member
          </button>
        </div>
      )}

      {/* SEMESTER / MENTOR */}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* SEMESTER */}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Semester <span className="text-orange-500">*</span>
          </label>

          <Select
            value={formik.values.semester}
            onValueChange={(value) => {
              formik.setFieldValue("semester", value);

              formik.setFieldTouched("semester", true, false);
            }}
          >
            <SelectTrigger className="h-10 bg-slate-50 text-sm">
              <SelectValue placeholder="Select semester..." />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
              <SelectItem value="3">Semester 3</SelectItem>
              <SelectItem value="4">Semester 4</SelectItem>
              <SelectItem value="5">Semester 5</SelectItem>
              <SelectItem value="6">Semester 6</SelectItem>
              <SelectItem value="7">Semester 7</SelectItem>
              <SelectItem value="8">Semester 8</SelectItem>
            </SelectContent>
          </Select>

          {formik.touched.semester && formik.errors.semester && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors.semester}
            </p>
          )}
        </div>

        {/* MENTOR */}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Assigne Mentor <span className="text-slate-400"></span>
          </label>

          <Select
            value={formik.values.mentor}
            onValueChange={(value) => {
              formik.setFieldValue("mentor", value);
            }}
          >
            <SelectTrigger className="h-10 bg-slate-50 text-sm">
              <SelectValue placeholder="Select a faculty mentor">
                {formik?.values?.mentor
                  ? mentors?.find(
                      (mentor) => mentor._id === formik.values.mentor,
                    )?.userId?.name
                  : "Select a faculty mentor"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading mentors...
                </SelectItem>
              ) : mentors?.length === 0 ? (
                <SelectItem value="no-mentor" disabled>
                  No mentors available
                </SelectItem>
              ) : (
                mentors?.map((mentor) => (
                  <SelectItem key={mentor._id} value={mentor._id}>
                    {mentor.userId?.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
