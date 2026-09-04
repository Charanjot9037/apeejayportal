'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function RosterSkeleton({
  title = 'Roster',
  columns = [],
  rows = 5,
  showDelete = false,
  showExport = true,
  showFilters = true,
}) {
  return (
    <div
      className="
        mt-4 flex flex-col
        overflow-hidden rounded-xl
        border border-slate-200
        bg-white shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="mt-2 h-0.5 w-8 rounded-full bg-orange-200" />
        </div>

        {showExport && <Skeleton className="h-9 w-32 rounded-lg" />}
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="px-5 py-4">
        <Skeleton className="mb-2 h-3 w-12 rounded" />

        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      {showFilters && (
        <div className="px-5 pb-4 pt-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            {/* Filter label */}

            <div className="hidden lg:block">
              <Skeleton className="mb-2 h-3 w-12 rounded" />
              <Skeleton className="h-10 w-20 rounded-lg" />
            </div>

            {/* Filter fields */}

            <div className="flex flex-1 flex-wrap gap-3">
              <div className="w-full lg:w-[150px]">
                <Skeleton className="mb-2 h-3 w-16 rounded" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              <div className="w-full lg:w-[150px]">
                <Skeleton className="mb-2 h-3 w-16 rounded" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              <div className="w-full lg:w-[150px]">
                <Skeleton className="mb-2 h-3 w-20 rounded" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              <div className="w-full lg:w-[150px]">
                <Skeleton className="mb-2 h-3 w-24 rounded" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-x-auto">
        <table className="mt-2 w-full min-w-[700px] text-left text-sm">
          {/* TABLE HEADER */}

          <thead>
            <tr className="border-y border-slate-100">
              {columns.length > 0 ? (
                columns.map((column) => (
                  <th key={column.key} className="px-3 py-3">
                    <Skeleton className="h-3 w-20 rounded" />
                  </th>
                ))
              ) : (
                <>
                  <th className="px-3 py-3">
                    <Skeleton className="h-3 w-20 rounded" />
                  </th>

                  <th className="px-3 py-3">
                    <Skeleton className="h-3 w-16 rounded" />
                  </th>

                  <th className="px-3 py-3">
                    <Skeleton className="h-3 w-20 rounded" />
                  </th>

                  <th className="px-3 py-3">
                    <Skeleton className="h-3 w-16 rounded" />
                  </th>
                </>
              )}

              {/* ACTION */}

              <th className="px-5 py-3 text-right">
                <Skeleton className="ml-auto h-3 w-12 rounded" />
              </th>

              {showDelete && (
                <th className="px-5 py-3 text-right">
                  <Skeleton className="ml-auto h-3 w-12 rounded" />
                </th>
              )}
            </tr>
          </thead>

          {/* TABLE BODY */}

          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-slate-50 last:border-0"
              >
                {/* Dynamic columns */}

                {columns.length > 0 ? (
                  columns.map((column, columnIndex) => (
                    <td key={column.key} className="px-3 py-3.5">
                      {/* Name / Student */}

                      {column.key === 'name' || column.key === 'student' ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                          <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-28 rounded" />
                            <Skeleton className="h-2.5 w-16 rounded" />
                          </div>
                        </div>
                      ) : column.key === 'projectTitle' ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

                          <Skeleton className="h-3.5 w-32 rounded" />
                        </div>
                      ) : column.key === 'status' ? (
                        <Skeleton className="h-6 w-24 rounded-full" />
                      ) : (
                        <Skeleton
                          className={`h-3.5 rounded ${
                            columnIndex % 2 === 0 ? 'w-28' : 'w-20'
                          }`}
                        />
                      )}
                    </td>
                  ))
                ) : (
                  <>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />

                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-28 rounded" />
                          <Skeleton className="h-2.5 w-16 rounded" />
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3.5">
                      <Skeleton className="h-3.5 w-32 rounded" />
                    </td>

                    <td className="px-3 py-3.5">
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </td>

                    <td className="px-3 py-3.5">
                      <Skeleton className="h-3.5 w-28 rounded" />
                    </td>
                  </>
                )}

                {/* VIEW / EDIT ACTION */}

                <td className="px-5 py-3 text-right">
                  <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                </td>

                {/* DELETE */}

                {showDelete && (
                  <td className="px-5 py-3 text-right">
                    <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          VIEW ALL
      ===================================================== */}

      <div className="border-t border-slate-100 px-5 py-3">
        <Skeleton className="mx-auto h-4 w-20 rounded" />
      </div>
    </div>
  );
}
