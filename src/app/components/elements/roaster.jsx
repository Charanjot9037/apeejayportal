"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Pencil,
  SlidersHorizontal,
  FolderKanban,
  ChevronDown,
  Trash2,
} from "lucide-react";
import MentorEditModal from "./MentorEditModal";
import { mapStudentToRoster } from "@/constants/adminData";
import StudentEditModal from "./StudentEditModal";
import Avatar from "./avatar";
import { toast } from "sonner";
import { newmapMentorToRoster } from "@/constants/adminData";
import SelectField from "./SelectFiled";
import { useRouter } from "next/navigation";
export default function Roster({
  title = "Roster",
  data = [],
  showDelete = false,
  setData,
  isMentor,
  showEdit = false,
  columns = [],
  setStudents,
  searchPlaceholder = "Search...",
  onRowClick,
  onApplyFilters,
  className = "",
  defaultFilters = {},
  filterConfig = [],
  showApplyButton = false,
  initialVisibleRows = 5,
}) {
  const [search, setSearch] = useState("");

  const [showAll, setShowAll] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const router = useRouter();
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };
  const handleDelete = async (id) => {
    try {
      console.log("Student deleting:", id);

      const response = await fetch(`/api/student/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete student");
      }

      toast.success("User deleted successfully");
      setData?.((prevData) =>
        prevData.map((item) =>
          item._id === id || item.id === id
            ? {
                ...item,
                status: "inactive",
              }
            : item,
        ),
      );
      setShowDeleteModal(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error("DELETE_STUDENT_ERROR:", error);
      toast.error(error.message || "Failed to delete student");
    }
  };
  const handleFilterChange = (key, value) => {
    setFilters((previousFilters) => {
      const updatedFilters = {
        ...previousFilters,
        [key]: value,
      };

      if (key === "department") {
        updatedFilters.program = "";
        updatedFilters.specialization = "";
        updatedFilters.currentSemester = "";
      }

      if (key === "program") {
        updatedFilters.currentSemester = "";
      }

      console.log("Roster - filter changed:", updatedFilters);

      return updatedFilters;
    });
  };

  /*
   * Apply selected filters.
   */
  const handleApplyFilters = () => {
    console.log("Roster - applying filters:", filters);

    onApplyFilters?.({
      ...filters,
    });
  };

  const renderCell = (column, item) => {
    /*
     * =========================
     * PROJECT COLUMN
     * =========================
     */
    if (column.key === "projectTitle") {
      return (
        <div className=" bg-red-5000 flex items-center gap-3">
          <div
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-lg bg-blue-50
              transition-all duration-200 ease-out
              group-hover:bg-blue-100
            "
          >
            <FolderKanban className="h-4 w-4 text-blue-600" />
          </div>

          <div className="min-w-0">
            <p
              className="
                max-w-[280px] truncate
                font-semibold text-slate-700
                transition-colors duration-200
                group-hover:text-[#1c3a5e]
              "
            >
              {item.projectTitle || "-"}
            </p>
          </div>
        </div>
      );
    }
    if (column.key === "techStack") {
      return (
        <span className="text-sm text-slate-600">
          {Array.isArray(item.techStack) ? item.techStack.join("") : "-"}
        </span>
      );
    }

    /*
     * =========================
     * NAME / STUDENT COLUMN
     * =========================
     */
    if (column.key === "name" || column.key === "student") {
      const name = item.name || item.student;

      return (
        <div className="flex items-center gap-3">
          <div
            className="
              transition-transform duration-200
              group-hover:scale-[1.03]
            "
          >
            <Avatar name={name} />
          </div>

          <div className="min-w-0">
            <p
              className="
                font-semibold text-slate-700
                transition-colors duration-200
                group-hover:text-[#1c3a5e]
              "
            >
              {name || "-"}
            </p>
            {/* 
            {(item.rollNo || item.id) && (
              <p className="text-xs text-slate-400">
                {item.rollNo || item.id}
              </p>
            )} */}
          </div>
        </div>
      );
    }

    /*
     * =========================
     * STATUS COLUMN
     * =========================
     */
    if (column.key === "status") {
      const statusStyles = {
        Verified: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
        "Pending Approval": "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
        "Changes Required":
          "bg-orange-50 text-orange-600 ring-1 ring-orange-100",
        Placed: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
        Looking: "bg-orange-50 text-orange-primary",
        Approved: "bg-green text-emerald-600 ring-1 ring-emerald-100",
      };

      return (
        <span
          className={`
            inline-flex items-center rounded-full
            px-2.5 py-1
            text-xs font-semibold
            transition-all duration-200
            ${statusStyles[item.status] || "bg-slate-100 text-slate-600"}
          `}
        >
          <span
            className={`
              mr-1.5 h-1.5 w-1.5 rounded-full
              ${
                item.status === "Verified" || item.status === "Placed"
                  ? "bg-emerald-500"
                  : item.status === "Pending"
                    ? "bg-amber-500"
                    : item.status === "Changes Required" ||
                        item.status === "Looking"
                      ? "bg-orange-500"
                      : "bg-slate-400"
              }
            `}
          />

          {item.status || "-"}
        </span>
      );
    }
    if (column.key === "email") {
      return (
        <span className="whitespace-nowrap text-slate-600">
          {item.email || "-"}
        </span>
      );
    }

    /*
     * =========================
     * CONTACT COLUMN
     * =========================
     */
    if (column.key === "contact") {
      return (
        <span className="whitespace-nowrap text-slate-600">
          {item.contact || "-"}
        </span>
      );
    }

    /*
     * =========================
     * ACTION COLUMN
     * =========================
     */
    if (column.key === "action") {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRowClick?.(item);
          }}
          title="View"
          aria-label="View"
          className="
            ml-auto flex h-8 w-8 items-center justify-center
            rounded-lg text-slate-400
            transition-all duration-200 ease-out
            hover:bg-blue-50 hover:text-blue-600
            hover:scale-105
            active:scale-95
            cursor-pointer
          "
        >
          <Eye className="h-4 w-4" />
        </button>
      );
    }

    /*
     * Generic columns
     */
    return item[column.key] ?? "-";
  };

  /*
   * Search existing data.
   */
  const filteredData = data.filter((item) => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return true;
    }

    return Object.values(item).some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(searchValue),
    );
  });

  /*
   * Show first 5 records initially.
   */
  const displayedData = showAll
    ? filteredData
    : filteredData.slice(0, initialVisibleRows);

  return (
    <div
      className={`
        mt-4 flex flex-col
        overflow-hidden rounded-xl
        border border-slate-200
        bg-white shadow-sm
        transition-shadow duration-300
        hover:shadow-md
        ${className}
      `}
    >
      <div className="px-5 pt-5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#1c3a5e]">{title}</h2>
        </div>

        <div className="mt-1 h-0.5 w-8 bg-primary-orange" />
      </div>

      {/* ================= SEARCH + FILTERS ================= */}

      <div className="px-5 pt-4">
        <div
          className="
            flex flex-col gap-3
            lg:flex-row lg:items-end
          "
        >
          {/* SEARCH */}

          <div className="w-full lg:flex-1">
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Search
            </label>

            <div className="group relative">
              <Search
                className="
                  pointer-events-none absolute left-3 top-1/2
                  h-4 w-4 -translate-y-1/2
                  text-slate-400
                  transition-colors duration-200
                  group-focus-within:text-[#f2792a]
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowAll(false);
                }}
                placeholder={searchPlaceholder}
                className="
                  w-full rounded-lg
                  border border-slate-200
                  bg-slate-50
                  py-2 pl-9 pr-3
                  text-sm text-slate-600
                  placeholder:text-slate-400

                  transition-all duration-200 ease-out

                  hover:border-slate-300
                  hover:bg-white

                  focus:border-[#f2792a]
                  focus:bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#f2792a]/10
                "
              />
            </div>
          </div>

          {/* FILTERS */}

          {filterConfig.length > 0 && (
            <>
              {/* Filter label */}

              <div className="hidden items-center gap-1.5 pb-2 lg:flex">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />

                <span className="text-xs font-semibold text-slate-500">
                  Filters
                </span>
              </div>

              {/* Filter fields */}

              {filterConfig.map((filter) => {
                const { key, label, placeholder } = filter;

                const options = filter.dependsOn
                  ? filter.options?.[filters[filter.dependsOn]] || []
                  : Array.isArray(filter.options)
                    ? filter.options
                    : [];

                return (
                  <div key={key} className="w-full lg:w-[150px]">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                      {label}
                    </label>

                    <div className="relative">
                      <select
                        value={filters[key] ?? ""}
                        onChange={(e) =>
                          handleFilterChange(key, e.target.value)
                        }
                        className="
                          w-full appearance-none
                          rounded-lg
                          border border-slate-200
                          bg-slate-50
                          px-3 py-2 pr-8
                          text-sm text-slate-600

                          transition-all duration-200 ease-out

                          hover:border-slate-300
                          hover:bg-white

                          focus:border-[#f2792a]
                          focus:bg-white
                          focus:outline-none
                          focus:ring-2
                          focus:ring-[#f2792a]/10

                          cursor-pointer
                        "
                      >
                        {placeholder && <option value="">{placeholder}</option>}

                        {options.map((option, index) => {
                          const value =
                            typeof option === "object" ? option.value : option;

                          const label =
                            typeof option === "object" ? option.label : option;

                          return (
                            <option
                              key={`${key}-${value}-${index}`}
                              value={value}
                            >
                              {label}
                            </option>
                          );
                        })}
                      </select>

                      <ChevronDown
                        className="
                          pointer-events-none
                          absolute right-2.5 top-1/2
                          h-4 w-4
                          -translate-y-1/2
                          text-slate-400
                          transition-transform duration-200
                        "
                      />
                    </div>
                  </div>
                );
              })}

              {/* APPLY FILTERS */}

              {showApplyButton && (
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="
                    w-full
                    rounded-lg
                    bg-[#f2792a]
                    px-4 py-2
                    text-sm font-semibold
                    text-white

                    transition-all duration-200 ease-out

                    hover:bg-[#df681c]
                    hover:shadow-sm
                    hover:-translate-y-0.5

                    active:translate-y-0
                    active:scale-[0.98]

                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#f2792a]
                    focus:ring-offset-2

                    cursor-pointer

                    lg:w-auto
                  "
                >
                  Apply Filters
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="mt-4 w-full min-w-[700px] text-left text-sm">
          {/* TABLE HEADER */}

          <thead>
            <tr
              className="
                border-y border-slate-100
                text-xs uppercase
                tracking-wide text-slate-400
                transition-colors duration-200
              "
            >
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2.5 font-medium">
                  {column.label}
                </th>
              ))}

              {/* ONE ACTION COLUMN */}

              <th className="px-5 py-2.5 text-right font-medium">Action</th>

              {showDelete && (
                <th className="px-5 py-2.5 text-right font-medium">Delete</th>
              )}
            </tr>
          </thead>

          {/* TABLE BODY */}

          <tbody>
            {displayedData.length > 0 ? (
              displayedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  onClick={() => onRowClick?.(item)}
                  className="
                    group
                    border-b border-slate-50
                    last:border-0

                    transition-all duration-200 ease-out

                    hover:bg-slate-50/80
                    hover:shadow-[inset_3px_0_0_#f2792a]

                    cursor-pointer
                  "
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="
                        px-3 py-3
                        text-slate-600
                        transition-colors duration-200
                      "
                    >
                      {renderCell(column, item)}
                    </td>
                  ))}

                  {/* ACTION */}

                  <td className="px-5 py-3 text-right">
                    {showEdit ? (
                      <button
                        type="button"
                        onClick={() => setEditingStudent(item)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-orange-50 hover:text-primary-orange"
                        title="Edit student"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRowClick?.(item)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        title="View student"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {" "}
                    {showDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-orange-50 hover:text-primary-orange"
                        title="Edit student"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="
                    px-5 py-8
                    text-center text-sm
                    text-slate-400
                  "
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= VIEW ALL ================= */}

      {filteredData.length > initialVisibleRows && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="
            mt-auto
            rounded-b-xl
            border-t border-slate-100
            py-3
            text-center
            text-sm font-semibold
            text-[#1c3a5e]

            transition-all duration-200

            hover:bg-slate-50
            hover:text-[#f2792a]

            active:bg-slate-100

            cursor-pointer
          "
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent &&
        (isMentor ? (
          <MentorEditModal
            mentor={editingStudent}
            onClose={() => setEditingStudent(null)}
            onUpdated={(updatedMentor) => {
              const updatedRosterMentor = newmapMentorToRoster(updatedMentor);

              setData((prevData) =>
                prevData.map((mentor) =>
                  mentor.id?.toString() ===
                  (editingStudent.id || editingStudent._id)?.toString()
                    ? updatedRosterMentor
                    : mentor,
                ),
              );

              setEditingStudent(null);
            }}
          />
        ) : (
          <StudentEditModal
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onUpdated={(updatedStudent) => {
              setData((prevData) =>
                prevData.map((student) =>
                  student._id === editingStudent._id
                    ? mapStudentToRoster(updatedStudent)
                    : student,
                ),
              );

              setEditingStudent(null);
            }}
          />
        ))}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Delete Student
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to make status Inactive for{" "}
                <span className="font-semibold text-slate-700">
                  {selectedStudent.fullName || selectedStudent.name}
                </span>
                ?
              </p>

              <p className="mt-2 text-sm text-red-500">
                This action cannot be undone.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStudent(null);
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    title === "Mentor Roster"
                      ? selectedStudent.id
                      : selectedStudent._id,
                  )
                }
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
