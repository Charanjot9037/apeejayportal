"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

const StudentFilters = ({
  search,
  setSearch,
  department,
  setDepartment,
  skill,
  setSkill,
  onFilter,
}) => {
  return (
    <div
      className="
        w-full
        rounded-xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm

        transition-all
        duration-300
        ease-out

        hover:shadow-md
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-5

          md:grid-cols-[minmax(0,1fr)_170px_170px_auto]
          md:items-end
        "
      >
        {/* ================= Search ================= */}

        <div className="w-full">
          <p
            className="
              mb-1.5
              text-sm
              font-medium
              text-slate-600
            "
          >
            Search Students
          </p>

          <div className="relative">
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-3.5
                w-3.5
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Name, course, or keyword..."
              className="
                h-9
                w-full
                rounded-md
                border
                border-slate-300
                bg-white
                pl-9
                pr-3
                text-xs
                text-slate-700
                outline-none

                placeholder:text-slate-400

                transition-all
                duration-200
                ease-out

                hover:border-slate-400

                focus:border-[#064a82]
                focus:ring-2
                focus:ring-[#064a82]/10
              "
            />
          </div>
        </div>

        {/* ================= Department ================= */}

        <div>
          <p
            className="
              mb-1.5
              text-sm
              font-medium
              text-slate-600
            "
          >
            Department
          </p>

          <Select
            value={department}
            onValueChange={setDepartment}
          >
            <SelectTrigger
              className="
                h-9
                w-full
                rounded-md
                border-slate-300
                bg-white
                px-3
                text-sm
                font-normal
                text-slate-700
                shadow-none

                transition-all
                duration-200

                hover:border-slate-400
                hover:bg-slate-50

                focus:ring-2
                focus:ring-[#064a82]/10
              "
            >
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              sideOffset={6}
              className="
                rounded-md
                border-slate-200
                bg-white
                shadow-lg
              "
            >
              <SelectItem value="all">
                All Departments
              </SelectItem>

              <SelectItem value="Computer Science">
                Computer Science
              </SelectItem>

              <SelectItem value="Electronics">
                Electronics
              </SelectItem>

              <SelectItem value="Management">
                Management
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ================= Skills ================= */}

        <div>
          <p
            className="
              mb-1.5
              text-sm
              font-medium
              text-slate-600
            "
          >
            Skills
          </p>

          <Select
            value={skill}
            onValueChange={setSkill}
          >
            <SelectTrigger
              className="
                h-9
                w-full
                rounded-md
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

                focus:ring-2
                focus:ring-[#064a82]/10
              "
            >
              <SelectValue placeholder="All Skills" />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              sideOffset={6}
              className="
                rounded-md
                border-slate-200
                bg-white
                shadow-lg
              "
            >
              <SelectItem value="all">
                All Skills
              </SelectItem>

              <SelectItem value="Machine Learning">
                Machine Learning
              </SelectItem>

              <SelectItem value="IoT">
                IoT
              </SelectItem>

              <SelectItem value="Python">
                Python
              </SelectItem>

              <SelectItem value="Marketing">
                Marketing
              </SelectItem>

              <SelectItem value="Finance">
                Finance
              </SelectItem>

              <SelectItem value="Analytics">
                Analytics
              </SelectItem>

              <SelectItem value="Next.js">
                Next.js
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ================= Filter ================= */}

        <Button
          onClick={onFilter}
          className="
            group
            h-9
            rounded-md
            bg-[#064a82]
            px-5
            text-xs
            font-medium
            text-white
            shadow-sm

            transition-all
            duration-300
            ease-out

            hover:bg-[#053b68]
            hover:shadow-md

            active:scale-[0.98]
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

          Filter
        </Button>
      </div>
    </div>
  );
};

export default StudentFilters;