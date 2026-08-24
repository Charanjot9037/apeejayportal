export default function StudentRosterSkeleton() {
  return (
    <div className="mt-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-6 w-40 animate-pulse rounded-md bg-slate-200" />

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

      {/* Table */}
      <div className="overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-4 w-20 animate-pulse rounded bg-slate-200"
            />
          ))}
        </div>

        {/* Rows */}
        <div>
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div
              key={row}
              className="grid grid-cols-5 gap-4 border-b border-slate-100 px-5 py-4"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

              <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />

              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

              <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
