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

export default function CollaborationSection({ formik }) {
  const [mentors, setMentors] = useState();
  const [loading, setMentorLoading] = useState(false);
  const department = useSelector((state) => state.student.department);
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setMentorLoading(true);

        const response = await fetch("/api/student/my-mentor", {
          method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        // API returns a single mentor
        setMentors(data.mentor ? data.mentor?.name : " ");
      } catch (error) {
        console.error("Failed to fetch mentor:", error);
        setMentors([]);
      } finally {
        setMentorLoading(false);
      }
    };

    fetchMentor();
  }, []);
  console.log("mentors", mentors);

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
                Add the student who are working on this project.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <TeamMemberCard formik={formik} />
          </div>
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
            Assigned Mentor
          </label>

          <input
            type="text"
            value={
              loading ? "Loading mentor..." : mentors || "No mentor assigned"
            }
            readOnly
            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none"
          />
        </div>
      </div>
    </section>
  );
}
