
"use client";

import { useMemo, useState } from "react";
import StudentFilters from "../components/elements/StudentFilter";
import StudentCard from "../components/elements/StudentCard";

import { students } from "@/constants/studentData";
import ProjectHeader from "../components/elements/ProjectHeader";

const StudentSearch = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [skill, setSkill] = useState("all");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    department: "all",
    skill: "all",
  });

  const handleFilter = () => {
    setAppliedFilters({
      search,
      department,
      skill,
    });
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue =
        appliedFilters.search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        student.student
          .toLowerCase()
          .includes(searchValue) ||
        student.course
          .toLowerCase()
          .includes(searchValue) ||
        student.department
          .toLowerCase()
          .includes(searchValue) ||
        student.skills.some((item) =>
          item.toLowerCase().includes(searchValue)
        );

      const matchesDepartment =
        appliedFilters.department === "all" ||
        student.department ===
          appliedFilters.department;

      const matchesSkill =
        appliedFilters.skill === "all" ||
        student.skills.includes(
          appliedFilters.skill
        );

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSkill
      );
    });
  }, [appliedFilters]);

  const handleSave = (student) => {
    console.log("Saved student:", student);
  };

  return (

    <section
      className="
        w-full
        bg-[#fafafa]
        sm:py-12
      "
    >  <div className="py-5">
        <ProjectHeader title="Discover Student Talent" subtitle="Explore verified student profiles, skills, projects, and technical expertise" />
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
        />

        {/* ================= Results Header ================= */}

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
              {filteredStudents.length} students
              found
            </p>
          </div>
        </div>

        {/* ================= Student Grid ================= */}

        {filteredStudents.length > 0 ? (
          <div
            className="
              mt-4
              grid
              grid-cols-1
              gap-5

              sm:grid-cols-2

              lg:grid-cols-3
            "
          >
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onSave={handleSave}
              />
            ))}
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
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentSearch;