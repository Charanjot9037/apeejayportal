"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Roster, DashboardHeader } from "@/app/components/elements";
import {
  MENTOR_DASHBOARD_HEADER,
  MENTOR_STUDENTS_COLUMNS,
} from "@/constants/mentorData";
import { mapStudentsToRoster } from "@/mappers/mentor";

export default function Student() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudnets = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/mentors/my-students");
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load projects.");
          return;
        }
        setStudents(data?.studentDetails);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudnets();
  }, []);

  console.log(students);
  const mentorDashboardHeader = {
    ...MENTOR_DASHBOARD_HEADER,
    actionLabel: null,
  };
  const rosterData = students?.map(mapStudentsToRoster);
  console.log(rosterData);
  return (
    <div className="flex h-full">
      <main className="flex-1 ">
        {loading && <p>Loading students...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <DashboardHeader {...mentorDashboardHeader} />
            <Roster
              title="Student Roster"
              data={rosterData}
              columns={MENTOR_STUDENTS_COLUMNS}
              searchPlaceholder="Search students..."

              onViewAll={() => console.log("View all students")}
              viewAllLabel="View All Students"
            />
          </>
        )}
      </main>
    </div>
  );
}
