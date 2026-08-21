"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeamMemberCard({ index, canRemove, formik, onRemove }) {
  const { department, program, academicBatch, userId } = useSelector(
    (state) => state.student,
  );

  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);

  useEffect(() => {
    if (!department || !program || !academicBatch) return;

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
            excludeUserId: userId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch students");
        }

        setStudents(data.students || []);
      } catch (error) {
        console.error("STUDENTS_FETCH_ERROR:", error);
        setStudents([]);
      } finally {
        setStudentLoading(false);
      }
    };

    fetchStudents();
  }, [department, program, academicBatch, userId]);

  const selectedStudent = students.find(
    (student) => student._id === formik.values.teamMembers,
  );

  return (
    <div className="rounded-md border border-slate-200 bg-white p-2 text-sm">
      <div className="mb-4 flex items-center justify-between">
        {/* <h4 className="text-xs font-semibold text-slate-700">
          Team Member 
        </h4> */}

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

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-700">
          Assign Team Member
        </label>

        <Select
          value={formik.values.teamMembers || ""}
          onValueChange={(value) => {
            formik.setFieldValue("teamMembers", value);
          }}
        >
          <SelectTrigger className="h-10 bg-slate-50 text-sm">
            <SelectValue placeholder="Select a student">
              {selectedStudent?.fullName || "Select a student"}
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
                <SelectItem key={student.userId} value={student.userId}>
                  {student.fullName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
