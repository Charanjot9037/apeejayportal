"use client";

import { useEffect, useState } from "react";
import { Roster } from "@/app/components/elements";
import { MENTOR_STUDENTS_COLUMNS } from "@/constants/mentorData";
import { mapStudentsToRoster } from "@/mappers/mentor";
import { DashboardHeader } from "@/app/components/elements";
import { MENTORTO_DASHBOARD_HEADER } from "@/constants/mentorData";
// =====================================================
// FILTER CONFIG
// =====================================================

const MENTOR_STUDENT_FILTERS = [
  {
    key: "department",
    label: "Department",
    placeholder: "All Departments",
    options: [
      {
        value: "ENGINEERING",
        label: "Engineering",
      },
      {
        value: "MANAGEMENT",
        label: "Management",
      },
      {
        value: "IT",
        label: "Information Technology",
      },
    ],
  },

  {
    key: "program",
    label: "Program / Degree",
    placeholder: "All Programs",
    dependsOn: "department",
    options: {
      ENGINEERING: [
        {
          value: "BTECH",
          label: "B.Tech",
        },
        {
          value: "MTECH",
          label: "M.Tech",
        },
      ],

      MANAGEMENT: [
        {
          value: "MBA",
          label: "MBA",
        },
        {
          value: "BBA",
          label: "BBA",
        },
        {
          value: "BCOM",
          label: "B.Com",
        },
      ],

      IT: [
        {
          value: "MCA",
          label: "MCA",
        },
        {
          value: "BCA",
          label: "BCA",
        },
      ],
    },
  },

  {
    key: "specialization",
    label: "Specialization",
    placeholder: "All Specializations",
    dependsOn: "department",
    options: {
      ENGINEERING: [
        {
          value: "CSE",
          label: "Computer Science & Engineering",
        },
        {
          value: "ECE",
          label: "Electronics & Communication Engineering",
        },
        {
          value: "ME",
          label: "Mechanical Engineering",
        },
        {
          value: "CIVIL",
          label: "Civil Engineering",
        },
      ],

      MANAGEMENT: [
        {
          value: "FINANCE",
          label: "Finance",
        },
        {
          value: "MARKETING",
          label: "Marketing",
        },
        {
          value: "HR",
          label: "Human Resource Management",
        },
      ],

      IT: [
        {
          value: "SOFTWARE_DEVELOPMENT",
          label: "Software Development",
        },
        {
          value: "DATA_SCIENCE",
          label: "Data Science",
        },
        {
          value: "AI_ML",
          label: "Artificial Intelligence & Machine Learning",
        },
        {
          value: "CYBER_SECURITY",
          label: "Cyber Security",
        },
      ],
    },
  },

  {
    key: "academicBatch",
    label: "Academic Batch",
    placeholder: "All Batches",
    options: [
      {
        value: "2023",
        label: "2023",
      },
      {
        value: "2024",
        label: "2024",
      },
      {
        value: "2025",
        label: "2025",
      },
      {
        value: "2026",
        label: "2026",
      },
    ],
  },
];

// =====================================================
// DEFAULT FILTERS
// Engineering + B.Tech + CSE
// =====================================================

const DEFAULT_FILTERS = {
  department: "ENGINEERING",
  program: "BTECH",
  academicBatch: "",
  specialization: "CSE",
};

// =====================================================
// FILTER STUDENTS
// =====================================================

const filterStudents = (students, selectedFilters) => {
  let result = [...students];

  if (selectedFilters.department) {
    result = result.filter(
      (student) =>
        String(student.department || "")
          .trim()
          .toLowerCase() ===
        String(selectedFilters.department).trim().toLowerCase(),
    );
  }

  if (selectedFilters.program) {
    result = result.filter(
      (student) =>
        String(student.program || "")
          .trim()
          .toLowerCase() ===
        String(selectedFilters.program).trim().toLowerCase(),
    );
  }

  if (selectedFilters.academicBatch) {
    result = result.filter(
      (student) =>
        String(student.academicBatch || "")
          .trim()
          .toLowerCase() ===
        String(selectedFilters.academicBatch).trim().toLowerCase(),
    );
  }

  if (selectedFilters.specialization) {
    result = result.filter(
      (student) =>
        String(student.specialization || "")
          .trim()
          .toLowerCase() ===
        String(selectedFilters.specialization).trim().toLowerCase(),
    );
  }

  return result;
};

// =====================================================
// PAGE
// =====================================================

export default function Student() {
  // All students returned by the API.
  // IMPORTANT: API already restricts this to the
  // currently logged-in mentor's assigned students.
  const [allStudents, setAllStudents] = useState([]);

  // Students currently displayed after filters.
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // ===================================================
  // FETCH ASSIGNED STUDENTS
  // ===================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/mentors/my-students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      // -----------------------------------------------
      // Read response safely
      // This prevents:
      // "Unexpected end of JSON input"
      // -----------------------------------------------

      const responseText = await response.text();

      console.log("Mentor students API status:", response.status);

      console.log("Mentor students API response:", responseText);

      if (!responseText) {
        throw new Error(`API returned an empty response (${response.status})`);
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("INVALID_JSON_RESPONSE:", responseText);

        throw new Error("The server returned an invalid response.");
      }

      // -----------------------------------------------
      // Authentication / API error
      // -----------------------------------------------

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch assigned students.");
      }

      // -----------------------------------------------
      // API returns:
      //
      // {
      //   success: true,
      //   studentDetails: [...]
      // }
      // -----------------------------------------------

      const assignedStudents = Array.isArray(data.studentDetails)
        ? data.studentDetails
        : [];

      console.log("Students assigned to logged-in mentor:", assignedStudents);

      // Store ONLY students returned by the mentor API.
      setAllStudents(assignedStudents);

      // Apply default filters.
      const filteredStudents = filterStudents(
        assignedStudents,
        DEFAULT_FILTERS,
      );

      setStudents(filteredStudents);
    } catch (err) {
      console.error("FETCH_MENTOR_STUDENTS_ERROR:", err);

      setError(err.message || "Something went wrong while fetching students.");

      setAllStudents([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // ===================================================
  // APPLY FILTERS
  // ===================================================

  const handleApplyFilters = (selectedFilters) => {
    console.log("Applied student filters:", selectedFilters);

    setFilters(selectedFilters);

    // IMPORTANT:
    // Filter ONLY allStudents.
    //
    // allStudents already contains ONLY students
    // assigned to the logged-in mentor.
    const filteredStudents = filterStudents(allStudents, selectedFilters);

    setStudents(filteredStudents);
  };

  // ===================================================
  // RETRY
  // ===================================================

  const handleRetry = () => {
    fetchStudents();
  };

  // ===================================================
  // MAP API DATA FOR ROSTER
  // ===================================================

  const rosterData = students.map(mapStudentsToRoster);

  // ===================================================
  // UI
  // ===================================================
  const studentDashboardHeader = {
    ...MENTORTO_DASHBOARD_HEADER,
  };
  return (
    <div className="min-h-full ">
      <main className="mx-auto ">
        {/* =========================================
            ERROR
        ========================================= */}
        <DashboardHeader {...studentDashboardHeader} />
        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-base font-semibold text-slate-700">
                Unable to load students
              </h2>

              <p className="mt-1 text-sm text-slate-500">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 rounded-lg bg-primary-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#df681c]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            LOADING
        ========================================= */}

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Loading students...</p>
          </div>
        )}

        {/* =========================================
            ROSTER
        ========================================= */}

        {!loading && !error && (
          <Roster
            title="My Students"
            data={rosterData}
            setData={setStudents}
            columns={MENTOR_STUDENTS_COLUMNS}
            searchPlaceholder="Search students..."
            filterConfig={MENTOR_STUDENT_FILTERS}
            defaultFilters={filters}
            showApplyButton={true}
            onApplyFilters={handleApplyFilters}
            onRowClick={(student) => {
              console.log("Selected student:", student);
            }}
            className="mt-0 shadow-sm"
          />
        )}
      </main>
    </div>
  );
}
