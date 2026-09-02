"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Loader2 } from "lucide-react";

import StudentFilters from "../components/elements/StudentFilter";
import StudentCard from "../components/elements/StudentCard";
import ProjectHeader from "../components/elements/ProjectHeader";

const StudentSearch = () => {
  const searchParams = useSearchParams();

  // ============================================================
  // INITIAL SEARCH
  // ============================================================

  const initialSearch = searchParams.get("search") || "";

  // ============================================================
  // STUDENTS
  // ============================================================

  const [students, setStudents] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  // ============================================================
  // PAGINATION
  // ============================================================

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  // Prevent multiple requests
  const isFetching = useRef(false);

  // Infinite scroll target
  const loadMoreRef = useRef(null);

  // ============================================================
  // FILTERS
  // ============================================================

  const [search, setSearch] = useState(initialSearch);

  const [department, setDepartment] = useState("all");

  const [appliedFilters, setAppliedFilters] = useState({
    search: initialSearch,
    department: "all",
  });

  // ============================================================
  // DOWNLOAD
  // ============================================================

  const [downloading, setDownloading] = useState(false);

  // ============================================================
  // FETCH STUDENTS
  // ============================================================

  const fetchStudents = async (pageNumber, append = false) => {
    if (isFetching.current) return;

    try {
      isFetching.current = true;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoadingStudents(true);
      }
        
      const response = await fetch(`/api/students?page=${pageNumber}`, {
        cache: "no-store",
      });

      const result = await response.json();
      console.log("result in students : ",result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch students");
      }

      const newStudents = result.students || [];

      // ----------------------------------------------------------
      // FIRST PAGE
      // ----------------------------------------------------------

      if (!append) {
        setStudents(newStudents);
      }

      // ----------------------------------------------------------
      // NEXT PAGES
      // ----------------------------------------------------------

      else {
        setStudents((prev) => [...prev, ...newStudents]);
      }

      // ----------------------------------------------------------
      // PAGINATION
      // ----------------------------------------------------------

      setPage(result.pagination?.page || pageNumber);

      setHasMore(result.pagination?.hasMore || false);
    } catch (error) {
      console.error("FETCH_STUDENTS_ERROR:", error);

      if (!append) {
        setStudents([]);
      }
    } finally {
      isFetching.current = false;

      setLoadingStudents(false);
      setLoadingMore(false);
    }
  };

  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    fetchStudents(1, false);
  }, []);

  // ============================================================
  // INFINITE SCROLL
  // ============================================================

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          hasMore &&
          !loadingStudents &&
          !loadingMore &&
          !isFetching.current
        ) {
          fetchStudents(page + 1, true);
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [page, hasMore, loadingStudents, loadingMore]);

  // ============================================================
  // DEPARTMENTS
  // ============================================================

  const departments = useMemo(() => {
    const values = students
      .map((student) => student.department)
      .filter(Boolean);

    return [...new Set(values)];
  }, [students]);

  // ============================================================
  // APPLY FILTER
  // ============================================================

  const handleFilter = () => {
    setAppliedFilters({
      search,
      department,
    });
  };

  // ============================================================
  // FILTER STUDENTS
  // ============================================================

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue = appliedFilters.search.toLowerCase().trim();

      const studentSkills = Array.isArray(student.skills)
        ? student.skills
        : [];

      // ----------------------------------------------------------
      // SEARCH
      // ----------------------------------------------------------

      const matchesSearch =
        !searchValue ||
        (student.fullName || "").toLowerCase().includes(searchValue) ||
        (student.program || "").toLowerCase().includes(searchValue) ||
        (student.department || "").toLowerCase().includes(searchValue) ||
        studentSkills.some((item) =>
          String(item).toLowerCase().includes(searchValue),
        );

      // ----------------------------------------------------------
      // DEPARTMENT
      // ----------------------------------------------------------

      const matchesDepartment =
        appliedFilters.department === "all" ||
        student.department === appliedFilters.department;

      return matchesSearch && matchesDepartment;
    });
  }, [students, appliedFilters]);

  // ============================================================
  // DOWNLOAD EXCEL
  // ============================================================

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const params = new URLSearchParams();

      if (appliedFilters.search) {
        params.set("search", appliedFilters.search);
      }

      if (appliedFilters.department !== "all") {
        params.set("department", appliedFilters.department);
      }

      const response = await fetch(
        `/api/students/export?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to download students");
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
      console.error("DOWNLOAD_ERROR:", error);
    } finally {
      setDownloading(false);
    }
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = (student) => {
    console.log("Saved student:", student);
  };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <section
      className="
        w-full
        bg-[#fafafa]
        sm:py-12
      "
    >
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="py-3 text-center">
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
        {/* ======================================================
            FILTERS
        ====================================================== */}

        <StudentFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          onFilter={handleFilter}
          departments={departments}
        />

        {/* ======================================================
            RESULTS HEADER
        ====================================================== */}

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

          {/* ====================================================
              DOWNLOAD EXCEL
          ==================================================== */}

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
              cursor-pointer
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
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {downloading ? (
              <>
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
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

        {/* ======================================================
            STUDENT GRID
        ====================================================== */}

        {loadingStudents ? (
          /* ----------------------------------------------------
             INITIAL LOADING
          ---------------------------------------------------- */

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
            <Loader2
              className="
                mx-auto
                h-6
                w-6
                animate-spin
                text-orange-500
              "
            />

            <p
              className="
                mt-3
                text-sm
                font-medium
                text-slate-700
              "
            >
              Loading students...
            </p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <>
            {/* --------------------------------------------------
                CARDS
            -------------------------------------------------- */}

            <div
              className="
              justify-items-center
                mt-4
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onSave={handleSave}
                />
              ))}
            </div>

            {/* --------------------------------------------------
                INFINITE SCROLL TRIGGER
            -------------------------------------------------- */}

            <div
              ref={loadMoreRef}
              className="
                flex
                min-h-24
                items-center
                justify-center
                py-8
              "
            >
              {loadingMore && (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-medium
                    text-slate-500
                  "
                >
                  <Loader2
                    className="
                      h-4
                      w-4
                      animate-spin
                      text-orange-500
                    "
                  />
                  Loading more students...
                </div>
              )}

              {!hasMore && students.length > 0 && (
                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  You have reached the end.
                </p>
              )}
            </div>
          </>
        ) : (
          /* ----------------------------------------------------
             NO STUDENTS
          ---------------------------------------------------- */

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