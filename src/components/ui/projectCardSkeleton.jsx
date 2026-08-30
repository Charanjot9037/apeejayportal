"use client";

const ProjectCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="col-span-full grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-md
            border
            border-slate-200
            bg-white
            shadow-sm
            animate-pulse
          "
        >
          {/* =========================================
              PROJECT IMAGE
          ========================================= */}
          <div className="h-[198px] bg-slate-200" />

          {/* =========================================
              CARD CONTENT
          ========================================= */}
          <div className="p-4">
            {/* Mentor Verified */}
            <div className="mx-auto h-7 w-40 rounded-full bg-slate-200" />

            {/* Project Type */}
            <div className="mx-auto mt-3 h-4 w-32 rounded bg-slate-200" />

            {/* Program + Semester */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="h-14 rounded-lg bg-slate-100" />
              <div className="h-14 rounded-lg bg-slate-100" />
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-slate-200" />

            {/* Student */}
            <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3">
              {/* Avatar */}
              <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />

              {/* Name + Roll Number */}
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-28 rounded bg-slate-200" />
                <div className="h-2.5 w-16 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectCardSkeleton;