'use client';

import { Search, ChevronRight } from 'lucide-react';

export default function Roster({
  title = 'Roster',
  data = [],
  columns = [],
  searchPlaceholder = 'Search...',
  onRowClick,
  onViewAll,
  viewAllLabel = 'View All',
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Table Title */}
      <div className="px-5 pt-5">
        <h2 className="text-lg font-bold text-[#1c3a5e]">{title}</h2>

        <div className="mt-1 h-0.5 w-8 bg-[#f2792a]" />
      </div>

      {/* Search */}
      <div className="px-5 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-600 placeholder:text-slate-400 focus:border-[#f2792a] focus:outline-none focus:ring-1 focus:ring-[#f2792a]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="mt-4 w-full min-w-[600px] text-left text-sm">
          {/* Dynamic Table Headings */}
          <thead>
            <tr className="border-y border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              {columns.map((column) => (
                <th key={column.key} className="px-2 py-2 font-medium">
                  {column.label}
                </th>
              ))}

              {/* Dynamic Action Heading */}
              <th className="px-5 py-2 text-right font-medium">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-slate-50 last:border-0"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-2 py-3 text-slate-600">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}

                {/* Action */}
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onRowClick?.(item)}
                    className="text-slate-300 hover:text-slate-500"
                  >
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All */}
      <button
        type="button"
        onClick={onViewAll}
        className="mt-auto rounded-b-xl border-t border-slate-100 py-3 text-center text-sm font-semibold text-[#1c3a5e] hover:bg-slate-50"
      >
        {viewAllLabel}
      </button>
    </div>
  );
}
