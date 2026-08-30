"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

// ============================================================
// FILTER OPTIONS
// ============================================================

const PROGRAM_OPTIONS = {
  ENGINEERING: [
    {
      value: "BTech",
      label: "B.Tech",
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
      value: "B.Com",
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
};

const SPECIALIZATION_OPTIONS = {
  ENGINEERING: [
    {
      value: "CSE",
      label: "Computer Science & Engineering",
    },
    {
      value: "AI_ML",
      label: "Artificial Intelligence & Machine Learning",
    },
    {
      value: "CS_IOT",
      label: "Cyber Security & IoT",
    },
  ],

  MANAGEMENT: [],

  IT: [],
};

const DEPARTMENT_OPTIONS = [
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
    label: "IT",
  },
];

const ProjectFilters = ({
  department,
  setDepartment,

  program,
  setProgram,

  specialization,
  setSpecialization,

  onFilter,
}) => {
  // ============================================================
  // DEPENDENT OPTIONS
  // ============================================================

  const programOptions =
    department !== "all"
      ? PROGRAM_OPTIONS[department] || []
      : [];

  const specializationOptions =
    department !== "all"
      ? SPECIALIZATION_OPTIONS[department] || []
      : [];

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        flex
        w-full
        flex-col
        items-stretch
        justify-center
        gap-3
        sm:flex-row
        sm:flex-wrap
        sm:items-center
      "
    >
      {/* ======================================================
          DEPARTMENT
      ====================================================== */}

      <Select
        value={department || "all"}
        onValueChange={(value) => {
          setDepartment(value);

          // Reset dependent filters
          setProgram("all");
          setSpecialization("all");
        }}
      >
        <SelectTrigger
          className="
            h-9
            w-full
            rounded-sm
            border-slate-300
            bg-white
            px-3
            text-xs
            font-normal
            text-slate-700
            shadow-none

            transition-all
            duration-200

            hover:border-slate-400
            hover:bg-slate-50

            focus:ring-1
            focus:ring-slate-300
            focus:ring-offset-0

            sm:w-[170px]
          "
        >
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>

        <SelectContent
          side="bottom"
          sideOffset={6}
          className="
            rounded-sm
            border-slate-200
            bg-white
            shadow-lg
          "
        >
          <SelectItem value="all">
            All Departments
          </SelectItem>

          {DEPARTMENT_OPTIONS.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ======================================================
          PROGRAM
      ====================================================== */}

      <Select
        value={program || "all"}
        onValueChange={setProgram}
        disabled={department === "all"}
      >
        <SelectTrigger
          className="
            h-9
            w-full
            rounded-sm
            border-slate-300
            bg-white
            px-3
            text-xs
            font-normal
            text-slate-700
            shadow-none

            transition-all
            duration-200

            hover:border-slate-400
            hover:bg-slate-50

            focus:ring-1
            focus:ring-slate-300
            focus:ring-offset-0

            sm:w-[170px]
          "
        >
          <SelectValue placeholder="Select Program" />
        </SelectTrigger>

        <SelectContent
          side="bottom"
          sideOffset={6}
          className="
            rounded-sm
            border-slate-200
            bg-white
            shadow-lg
          "
        >
          <SelectItem value="all">
            All Programs
          </SelectItem>

          {programOptions.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ======================================================
          SPECIALIZATION
      ====================================================== */}

      <Select
        value={specialization || "all"}
        onValueChange={setSpecialization}
        disabled={department === "all"}
      >
        <SelectTrigger
          className="
            h-9
            w-full
            rounded-sm
            border-slate-300
            bg-white
            px-3
            text-xs
            font-normal
            text-slate-700
            shadow-none

            transition-all
            duration-200

            hover:border-slate-400
            hover:bg-slate-50

            focus:ring-1
            focus:ring-slate-300
            focus:ring-offset-0

            sm:w-[220px]
          "
        >
          <SelectValue placeholder="Select Specialization" />
        </SelectTrigger>

        <SelectContent
          side="bottom"
          sideOffset={6}
          className="
            rounded-sm
            border-slate-200
            bg-white
            shadow-lg
          "
        >
          <SelectItem value="all">
            All Specializations
          </SelectItem>

          {specializationOptions.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ======================================================
          APPLY FILTER
      ====================================================== */}

      <Button
        onClick={onFilter}
        variant="outline"
        className="
          group
          h-9
          w-full
          rounded-sm
          border-slate-300
          bg-white
          px-4
          text-xs
          font-normal
          text-slate-700
          shadow-none

          transition-all
          duration-200

          hover:border-slate-400
          hover:bg-slate-50
          hover:text-slate-900

          active:scale-[0.98]

          sm:w-auto
        "
      >
        <SlidersHorizontal
          className="
            mr-1.5
            h-3.5
            w-3.5

            transition-transform
            duration-300

            group-hover:rotate-90
          "
        />

        Apply Filters
      </Button>
    </div>
  );
};

export default ProjectFilters;