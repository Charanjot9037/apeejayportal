
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

const ProjectFilters = ({
  department,
  setDepartment,
  skill,
  setSkill,
  onFilter,
}) => {
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
        sm:items-center
      "
    >
      {/* ================= Department ================= */}
      <Select
        value={department}
        label="Select Department"
        onValueChange={setDepartment}
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
            ease-out

            hover:border-slate-400
            hover:bg-slate-50

            focus:ring-1
            focus:ring-slate-300
            focus:ring-offset-0

            sm:w-[170px]
          "
        >
<SelectValue>
  {department === "all" ? "Select Department" : department}
</SelectValue>
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
          <SelectItem
            value="all"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            All
          </SelectItem>

          <SelectItem
            value="Computer Science"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            Computer Science
          </SelectItem>

          <SelectItem
            value="Electronics"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            Electronics
          </SelectItem>

          <SelectItem
            value="Management"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            Management
          </SelectItem>
        </SelectContent>
      </Select>

      {/* ================= Skills ================= */}
      <Select
        value={skill}
        onValueChange={setSkill}
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
            ease-out

            hover:border-slate-400
            hover:bg-slate-50

            focus:ring-1
            focus:ring-slate-300
            focus:ring-offset-0

            sm:w-[170px]
          "
        >
<SelectValue>
  {skill === "all" ? "Select Skill" : skill}
</SelectValue>
        </SelectTrigger>

        <SelectContent
          className="
            rounded-sm
            border-slate-200
            bg-white
            shadow-lg
          "
        >
          <SelectItem
            value="all"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            All
          </SelectItem>

          <SelectItem
            value="Machine Learning"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            Machine Learning
          </SelectItem>

          <SelectItem
            value="IoT"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            IoT
          </SelectItem>

          <SelectItem
            value="Python"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
              "
          >
            Python
          </SelectItem>

          <SelectItem
            value="Marketing"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            Marketing
          </SelectItem>

          <SelectItem
            value="Finance"
            className="
              text-xs
              transition-colors
              duration-150
              focus:bg-slate-100
            "
          >
            Finance
          </SelectItem>
        </SelectContent>
      </Select>

      {/* ================= More Filters ================= */}
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
          ease-out

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
            ease-out

            group-hover:rotate-90
          "
        />

        More Filters
      </Button>
    </div>
  );
};

export default ProjectFilters;