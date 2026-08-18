// "use client";

// import { useMemo, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Download } from "lucide-react";
// import { students as studentData } from "@/constants/studentData";

// import StudentFilters from "../components/elements/StudentFilter";
// import StudentCard from "../components/elements/StudentCard";
// import ProjectHeader from "../components/elements/ProjectHeader";

// const StudentSearch = () => {
//   const searchParams = useSearchParams();

//   // ================= INITIAL SEARCH =================

//   const initialSearch = searchParams.get("search") || "";

//   // ================= STATIC STUDENTS =================

//   /*
//    * Convert your static data structure into the structure
//    * expected by StudentCard.
//    */
//   const students = useMemo(() => {
//     return studentData.map((student) => ({
//       _id: student.id,
//       fullName: student.student,
//       profileImage: student.image,
//       program: student.course,
//       currentSemester: student.year?.match(/\d+/)?.[0] || "",
//       department: student.department,
//       skills: student.skills || [],

//       // Keep the original data too
//       initials: student.initials,
//       status: student.status,
//       match: student.match,
//       projects: student.projects,
//       intake: student.intake,
//       verified: student.verified,
//       project: student.project,
//     }));
//   }, []);

//   // ================= FILTERS =================

//   const [search, setSearch] = useState(initialSearch);

//   const [department, setDepartment] = useState("all");

//   const [skill, setSkill] = useState("all");

//   const [appliedFilters, setAppliedFilters] = useState({
//     search: initialSearch,
//     department: "all",
//     skill: "all",
//   });

//   // ================= DEPARTMENTS =================

//   const departments = useMemo(() => {
//     const values = students
//       .map((student) => student.department)
//       .filter(Boolean);

//     return [...new Set(values)];
//   }, [students]);

//   // ================= SKILLS =================

//   const availableSkills = useMemo(() => {
//     const values = students.flatMap((student) =>
//       Array.isArray(student.skills) ? student.skills : []
//     );

//     return [...new Set(values)].filter(Boolean);
//   }, [students]);

//   // ================= FILTER =================

//   const handleFilter = () => {
//     setAppliedFilters({
//       search,
//       department,
//       skill,
//     });
//   };

//   // ================= FILTERED STUDENTS =================

//   const filteredStudents = useMemo(() => {
//     return students.filter((student) => {
//       const searchValue = appliedFilters.search
//         .toLowerCase()
//         .trim();

//       const studentSkills = Array.isArray(student.skills)
//         ? student.skills
//         : [];

//       // ================= SEARCH =================

//       const matchesSearch =
//         !searchValue ||
//         (student.fullName || "")
//           .toLowerCase()
//           .includes(searchValue) ||
//         (student.program || "")
//           .toLowerCase()
//           .includes(searchValue) ||
//         (student.department || "")
//           .toLowerCase()
//           .includes(searchValue) ||
//         studentSkills.some((item) =>
//           String(item)
//             .toLowerCase()
//             .includes(searchValue)
//         );

//       // ================= DEPARTMENT =================

//       const matchesDepartment =
//         appliedFilters.department === "all" ||
//         student.department === appliedFilters.department;

//       // ================= SKILL =================

//       const matchesSkill =
//         appliedFilters.skill === "all" ||
//         studentSkills.some(
//           (item) =>
//             String(item).toLowerCase() ===
//             appliedFilters.skill.toLowerCase()
//         );

//       return (
//         matchesSearch &&
//         matchesDepartment &&
//         matchesSkill
//       );
//     });
//   }, [students, appliedFilters]);

//   // ================= DOWNLOAD =================

//   const handleDownload = () => {
//     if (filteredStudents.length === 0) return;

//     const headers = [
//       "Name",
//       "Department",
//       "Course",
//       "Year",
//       "Status",
//       "Match",
//       "Skills",
//       "Projects",
//       "Intake",
//     ];

//     const rows = filteredStudents.map((student) => [
//       student.fullName,
//       student.department,
//       student.program,
//       `${student.currentSemester}th Year`,
//       student.status,
//       `${student.match}%`,
//       student.skills.join(", "),
//       student.projects,
//       student.intake,
//     ]);

//     const csvContent = [
//       headers,
//       ...rows,
//     ]
//       .map((row) =>
//         row
//           .map((value) => {
//             const stringValue = String(value ?? "");

//             // Escape quotes for CSV
//             return `"${stringValue.replace(/"/g, '""')}"`;
//           })
//           .join(",")
//       )
//       .join("\n");

//     const blob = new Blob(
//       [csvContent],
//       {
//         type: "text/csv;charset=utf-8;",
//       }
//     );

//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");

//     link.href = url;
//     link.download = "student-profiles.csv";

//     document.body.appendChild(link);

//     link.click();

//     link.remove();

//     window.URL.revokeObjectURL(url);
//   };

//   // ================= SAVE =================

//   const handleSave = (student) => {
//     console.log("Saved student:", student);
//   };

//   // ================= RETURN =================

//   return (
//     <section
//       className="
//         w-full
//         bg-[#fafafa]
//         sm:py-12
//       "
//     >
//       {/* ================= HEADER ================= */}

//       <div className="py-3 text-center md:py-5">
//         <ProjectHeader
//           title="Discover Student Talent"
//           subtitle="Explore verified student profiles, skills, projects, and technical expertise"
//         />
//       </div>

//       <div
//         className="
//           mx-auto
//           w-full
//           max-w-7xl
//           px-5
//           sm:px-6
//           lg:px-8
//         "
//       >
//         {/* ================= FILTERS ================= */}

//         <StudentFilters
//           search={search}
//           setSearch={setSearch}
//           department={department}
//           setDepartment={setDepartment}
//           skill={skill}
//           setSkill={setSkill}
//           onFilter={handleFilter}
//           departments={departments}
//           skills={availableSkills}
//         />

//         {/* ================= RESULTS HEADER ================= */}

//         <div
//           className="
//             mt-7
//             flex
//             flex-col
//             gap-4
//             sm:flex-row
//             sm:items-center
//             sm:justify-between
//           "
//         >
//           <div>
//             <p
//               className="
//                 text-sm
//                 font-semibold
//                 text-slate-800
//               "
//             >
//               Student Profiles
//             </p>

//             <p
//               className="
//                 mt-0.5
//                 text-[10px]
//                 text-slate-500
//               "
//             >
//               {filteredStudents.length} students found
//             </p>
//           </div>

//           {/* ================= DOWNLOAD ================= */}

//           <button
//             type="button"
//             onClick={handleDownload}
//             disabled={filteredStudents.length === 0}
//             className="
//               inline-flex
//               cursor-pointer
//               items-center
//               justify-center
//               gap-2
//               rounded-lg
//               bg-primary
//               px-4
//               py-2.5
//               text-sm
//               font-medium
//               text-white
//               shadow-sm
//               transition
//               hover:bg-primary/90
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >
//             <Download className="h-4 w-4" />
//             Download CSV
//           </button>
//         </div>

//         {/* ================= STUDENT GRID ================= */}

//         {filteredStudents.length > 0 ? (
//           <div
//             className="
//               mt-4
//               grid
//               grid-cols-1
//               gap-5
//               sm:grid-cols-2
//               lg:grid-cols-3
//             "
//           >
//             {filteredStudents.map((student) => (
//               <StudentCard
//                 key={student._id}
//                 student={student}
//                 onSave={handleSave}
//               />
//             ))}
//           </div>
//         ) : (
//           <div
//             className="
//               mt-5
//               rounded-xl
//               border
//               border-dashed
//               border-slate-300
//               bg-white
//               px-6
//               py-16
//               text-center
//             "
//           >
//             <p
//               className="
//                 text-sm
//                 font-medium
//                 text-slate-700
//               "
//             >
//               No students found
//             </p>

//             <p
//               className="
//                 mt-1
//                 text-xs
//                 text-slate-500
//               "
//             >
//               Try adjusting your search or filters.
//             </p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default StudentSearch;





// // to map data use this code -- DONT DELETE >> IMP 
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Download,
  Loader2,
} from "lucide-react";

import StudentFilters from "../components/elements/StudentFilter";
import StudentCard from "../components/elements/StudentCard";

import ProjectHeader from "../components/elements/ProjectHeader";

const StudentSearch = () => {
  const searchParams = useSearchParams();

  // ================= INITIAL SEARCH =================

  const initialSearch =
    searchParams.get("search") || "";

  // ================= STUDENTS =================

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] =
    useState(true);

  // ================= FILTERS =================

  const [search, setSearch] =
    useState(initialSearch);

  const [department, setDepartment] =
    useState("all");

  const [skill, setSkill] =
    useState("all");

    const [downloading, setDownloading] =
  useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState({
      search: initialSearch,
      department: "all",
      skill: "all",
    });

  // ================= FETCH STUDENTS =================

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);

        const response =
          await fetch("/api/students");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch students"
          );
        }

        setStudents(result.students || []);
      } catch (error) {
        console.error(
          "FETCH_STUDENTS_ERROR:",
          error
        );

        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // ================= DEPARTMENTS =================

  const departments = useMemo(() => {
    const values = students
      .map((student) => student.department)
      .filter(Boolean);

    return [...new Set(values)];
  }, [students]);
  const handleDownload = async () => {
  try {
    setDownloading(true);

    const params = new URLSearchParams();

    if (appliedFilters.search) {
      params.set(
        "search",
        appliedFilters.search
      );
    }

    if (
      appliedFilters.department !== "all"
    ) {
      params.set(
        "department",
        appliedFilters.department
      );
    }

    if (appliedFilters.skill !== "all") {
      params.set(
        "skill",
        appliedFilters.skill
      );
    }

    const response = await fetch(
      `/api/students/export?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to download students"
      );
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "student-profiles.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      "DOWNLOAD_ERROR:",
      error
    );
  } finally {
    setDownloading(false);
  }
};

  // ================= SKILLS =================

  const availableSkills = useMemo(() => {
    const values = students.flatMap((student) =>
      Array.isArray(student.skills)
        ? student.skills
        : []
    );

    return [...new Set(values)].filter(Boolean);
  }, [students]);

  // ================= FILTER =================

  const handleFilter = () => {
    setAppliedFilters({
      search,
      department,
      skill,
    });
  };

  // ================= FILTERED STUDENTS =================

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue =
        appliedFilters.search
          .toLowerCase()
          .trim();

      const studentSkills =
        Array.isArray(student.skills)
          ? student.skills
          : [];

      // Search

      const matchesSearch =
        !searchValue ||
        (student.fullName || "")
          .toLowerCase()
          .includes(searchValue) ||
        (student.program || "")
          .toLowerCase()
          .includes(searchValue) ||
        (student.department || "")
          .toLowerCase()
          .includes(searchValue) ||
        studentSkills.some((item) =>
          String(item)
            .toLowerCase()
            .includes(searchValue)
        );

      // Department

      const matchesDepartment =
        appliedFilters.department ===
          "all" ||
        student.department ===
          appliedFilters.department;

      // Skill

      const matchesSkill =
        appliedFilters.skill === "all" ||
        studentSkills.some(
          (item) =>
            String(item).toLowerCase() ===
            appliedFilters.skill.toLowerCase()
        );

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSkill
      );
    });
  }, [students, appliedFilters]);

  // ================= SAVE =================

  const handleSave = (student) => {
    console.log(
      "Saved student:",
      student
    );
  };

  // ================= RETURN =================

  return (
    <section
      className="
        w-full
        bg-[#fafafa]
        sm:py-12
      "
    >
      <div className="  text-center py-3 ">
        <ProjectHeader
          title="Discover Student Talent"
          subtitle="Explore verified student profiles, skills, projects, and technical expertise"
        />
      </div>

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-5
          sm:px-6
          lg:px-8
        "
      >
        {/* ================= Filters ================= */}

        <StudentFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          skill={skill}
          setSkill={setSkill}
          onFilter={handleFilter}
          departments={departments}
          skills={availableSkills}
        />
       
        {/* ================= Results Header ================= */}
{/* 
        <div
          className="
            mt-7
            flex
            items-center
            justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                text-slate-800
              "
            >
              Student Profiles
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                text-slate-500
              "
            >
              {loadingStudents
                ? "Loading students..."
                : `${filteredStudents.length} students found`}
            </p>
          </div>
        </div> */}
        <div
  className="
    mt-7
    flex
    flex-col
    gap-4
    sm:flex-row
    sm:items-center
    sm:justify-between
  "
>
  <div>
    <p
      className="
        text-sm
        font-semibold
        text-slate-800
      "
    >
      Student Profiles
    </p>

    <p
      className="
        mt-0.5
        text-[10px]
        text-slate-500
      "
    >
      {loadingStudents
        ? "Loading students..."
        : `${filteredStudents.length} students found`}
    </p>
  </div>

  <button
    type="button"
    onClick={handleDownload}
    disabled={
      downloading ||
      loadingStudents ||
      filteredStudents.length === 0
    }
    className="
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-lg
      bg-secondary
      px-4
      py-2.5
      text-sm
      font-medium
      text-white
      shadow-sm
      transition
      hover:bg-primary/90
      cursor-pointer
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
  >
    {downloading ? (
      <>
        <Loader2
          className="h-4 w-4 animate-spin"
        />
        Preparing...
      </>
    ) : (
      <>
        <Download className="h-4 w-4" />
        Download Excel
      </>
    )}
  </button>
</div>

        {/* ================= Student Grid ================= */}

        {loadingStudents ? (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-6
              py-16
              text-center
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Loading students...
            </p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div
            className="
              mt-4
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {filteredStudents.map(
              (student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onSave={handleSave}
                />
              )
            )}
          </div>
        ) : (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-6
              py-16
              text-center
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              No students found
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Try adjusting your search or
              filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentSearch;


