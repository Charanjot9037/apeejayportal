const MentorRosterSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <div className="h-6 w-40 animate-pulse rounded-md bg-slate-200" />

          {/* Search */}
          <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-100" />
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-100" />

          <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-100" />

          <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-100" />

          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-4 w-20 animate-pulse rounded bg-slate-200"
          />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: 8 }).map((_, row) => (
        <div
          key={row}
          className="grid grid-cols-5 gap-4 border-b border-slate-100 px-5 py-4"
        >
          {/* Mentor Name */}
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

          {/* Email */}
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

          {/* Department */}
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

          {/* Designation */}
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

          {/* Action */}
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
};

export default MentorRosterSkeleton;
