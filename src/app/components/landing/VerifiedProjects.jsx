
"use client";

import { useEffect, useState } from "react";

import ProjectHeader from "@/app/components/elements/ProjectHeader";
import ProjectFilters from "@/app/components/elements/ProjectFilters";
import ProjectCard from "@/app/components/elements/ProjectCard";

import { Button } from "@/components/ui/button";
import ProjectCardSkeleton from "@/components/ui/projectCardSkeleton";

const VerifiedProjects = () => {
  const [projects, setProjects] = useState([]);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  // ============================================================
  // SELECTED FILTERS
  // ============================================================

  const [department, setDepartment] =
    useState("all");

  const [program, setProgram] =
    useState("all");

  const [specialization, setSpecialization] =
    useState("all");

  // ============================================================
  // PAGINATION
  // ============================================================

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] =
    useState(true);

  // ============================================================
  // FETCH PROJECTS
  // ============================================================

  const fetchProjects = async ({
    pageNumber = 1,
    append = false,
    filters = {},
  }) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoadingProjects(true);
      }

      const params = new URLSearchParams();

      // Pagination
      params.set(
        "page",
        String(pageNumber)
      );

      // Department
      if (
        filters.department &&
        filters.department !== "all"
      ) {
        params.set(
          "department",
          filters.department
        );
      }

      // Program
      if (
        filters.program &&
        filters.program !== "all"
      ) {
        params.set(
          "program",
          filters.program
        );
      }

      // Specialization
      if (
        filters.specialization &&
        filters.specialization !== "all"
      ) {
        params.set(
          "specialization",
          filters.specialization
        );
      }

      const response = await fetch(
        `/api/projects/verified?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      console.log(
        "Verified projects response:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch verified projects"
        );
      }

      // ========================================================
      // MAP PROJECTS
      // ========================================================

      const mappedProjects = (
        result.projects || []
      ).map((project) => ({
        ...project,

        id: project._id,

        title: project.title || "",
        subtitle: project.subtitle || "",
        description: project.description || "",

        image:
          project.projectImages?.[0]?.url ||
          null,

        skills: Array.isArray(
          project.techStack
        )
          ? project.techStack
          : [],

        verified:
          String(project.status || "")
            .toLowerCase() === "approved",

        // Existing flat fields
        department:
          project.studentInfo?.department ||
          project.department ||
          "",

        program:
          project.studentInfo?.program ||
          project.program ||
          "",

        specialization:
          project.studentInfo?.specialization ||
          project.specialization ||
          "",

        // ======================================================
        // STUDENT INFORMATION
        // ======================================================

        studentInfo: {
          id:
            project.studentInfo?.id ||
            null,

          name:
            project.studentInfo?.name ||
            "",

          email:
            project.studentInfo?.email ||
            "",

          profileImage:
            project.studentInfo?.profileImage ||
            "",

          department:
            project.studentInfo?.department ||
            "",

          program:
            project.studentInfo?.program ||
            "",

          specialization:
            project.studentInfo?.specialization ||
            "",

          academicBatch:
            project.studentInfo?.academicBatch ||
            "",

          rollNumber:
            project.studentInfo?.rollNumber ||
            "-",
        },
      }));

      // ========================================================
      // SET / APPEND PROJECTS
      // ========================================================

      if (append) {
        setProjects((previous) => [
          ...previous,
          ...mappedProjects,
        ]);
      } else {
        setProjects(mappedProjects);
      }

      // ========================================================
      // PAGINATION RESPONSE
      // ========================================================

      if (result.pagination) {
        setPage(
          result.pagination.page ||
            pageNumber
        );

        setHasMore(
          Boolean(
            result.pagination.hasMore
          )
        );
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "FETCH_VERIFIED_PROJECTS_ERROR:",
        error
      );

      if (!append) {
        setProjects([]);
      }
    } finally {
      setLoadingProjects(false);
      setLoadingMore(false);
    }
  };

  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    fetchProjects({
      pageNumber: 1,
      append: false,
      filters: {
        department: "all",
        program: "all",
        specialization: "all",
      },
    });
  }, []);

  // ============================================================
  // APPLY FILTERS
  // ============================================================

  const handleFilter = () => {
    const filters = {
      department,
      program,
      specialization,
    };

    console.log(
      "Applying project filters:",
      filters
    );

    // Reset to first page
    setPage(1);

    setHasMore(true);

    setProjects([]);

    // Fetch first 3 filtered projects
    fetchProjects({
      pageNumber: 1,
      append: false,
      filters,
    });
  };

  // ============================================================
  // LOAD MORE
  // ============================================================

  const loadMore = () => {
    if (loadingMore || !hasMore) {
      return;
    }

    const nextPage = page + 1;

    fetchProjects({
      pageNumber: nextPage,
      append: true,
      filters: {
        department,
        program,
        specialization,
      },
    });
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      id="projects"
      className="
        flex
        w-full
        flex-col
        gap-2
        bg-[#fafafa]
        px-5
        py-12
        md:px-10
      "
    >
      <ProjectHeader title="Verified Projects" />

      <div className="mt-5">
        <ProjectFilters
          department={department}
          setDepartment={setDepartment}

          program={program}
          setProgram={setProgram}

          specialization={specialization}
          setSpecialization={
            setSpecialization
          }

          onFilter={handleFilter}
        />
      </div>

      {/* ======================================================
          PROJECT GRID
      ====================================================== */}

      <div
        className="
          mx-auto
          mt-7
          grid
          w-5/6
          grid-cols-1
          gap-7
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {loadingProjects ? (
          <ProjectCardSkeleton/>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))
        )}
      </div>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {!loadingProjects &&
        projects.length === 0 && (
          <div className="flex justify-center py-12">
            <p className="text-sm text-slate-500">
              No verified projects found.
            </p>
          </div>
        )}

      {/* ======================================================
          LOAD MORE
      ====================================================== */}

      {!loadingProjects &&
        projects.length > 0 &&
        hasMore && (
          <div className="mt-7 flex justify-center">
            <Button
              onClick={loadMore}
              disabled={loadingMore}
              className="
                h-8
                cursor-pointer
                rounded-md
                bg-secondary
                px-6
                py-5
                text-sm
                font-medium
                text-white
                transition-all
                delay-100
                hover:scale-102
                hover:bg-secondary/90
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loadingMore
                ? "Loading..."
                : "Load More"}
            </Button>
          </div>
        )}
    </div>
  );
};

export default VerifiedProjects;
