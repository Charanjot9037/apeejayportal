"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeamMemberCard({ canRemove, formik, onRemove }) {
  const { department, program, academicBatch } = useSelector(
    (state) => state.student,
  );

  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);

  useEffect(() => {
    if (!department || !program || !academicBatch) {
      return;
    }

    const fetchStudents = async () => {
      try {
        setStudentLoading(true);

        const response = await fetch("/api/student/team-member", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department,
            program,
            academicBatch,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch students");
        }

        console.log("STUDENTS FROM API:", data);

        setStudents(data.formattedStudents || []);
      } catch (error) {
        console.error("STUDENTS_FETCH_ERROR:", error);

        setStudents([]);
      } finally {
        setStudentLoading(false);
      }
    };

    fetchStudents();
  }, []);
  console.log("student", students);
  /* =====================================================
     CURRENT SELECTED VALUE
  ===================================================== */

  const selectedTeamMember = formik.values.teamMembers || "";
  const selectedStudent = students.find(
    (student) => String(student._id) === String(selectedTeamMember),
  );

  const mentorName = selectedStudent?.mentor?.name || "";
  console.log("FORMIK TEAM MEMBER:", selectedTeamMember);
  console.log(students);
  return (
    <div className="rounded-md border border-slate-200 bg-white p-2 text-sm">
      <div className="mb-4 flex items-center justify-between">
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Assign Team Member
          </label>
          <Select
            value={selectedTeamMember}
            onValueChange={(value) => {
              formik.setFieldValue("teamMembers", value);
            }}
          >
            <SelectTrigger className="h-10 bg-slate-50 text-sm">
              <SelectValue placeholder="Select a student">
                {students.find(
                  (student) =>
                    String(student._id) === String(selectedTeamMember),
                )?.fullName || "Select a student"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {studentLoading ? (
                <SelectItem value="loading" disabled>
                  Loading students...
                </SelectItem>
              ) : students.length === 0 ? (
                <SelectItem value="no-student" disabled>
                  No students available
                </SelectItem>
              ) : (
                students.map((student) => (
                  <SelectItem key={student._id} value={String(student._id)}>
                    {student.fullName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>{" "}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Assigned Mentor
          </label>
          <input
            type="text"
            value={mentorName || "Select a team member"}
            readOnly
            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none"
          />
        </div>
        {formik.touched.teamMembers && formik.errors.teamMembers && (
          <p className="mt-1 text-xs text-red-500">
            {formik.errors.teamMembers}
          </p>
        )}
      </div>
    </div>
  );
}
