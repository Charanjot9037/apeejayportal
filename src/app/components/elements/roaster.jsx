'use client';

import { Search, ChevronRight } from 'lucide-react';
import Avatar from './avatar';

export default function Roster({
  title = 'Roster',
  data = [],
  columns = [],
  searchPlaceholder = 'Search...',
  onRowClick,
  onViewAll,
  className = '',
}) {
  const renderCell = (column, item) => {
    if (column.key === 'name') {
      return (
        <div className="flex items-center gap-3">
          <Avatar name={item.name} />

          <div>
            <p className="font-semibold text-slate-700">{item.name}</p>

            <p className="text-xs text-slate-400">{item.id}</p>
          </div>
        </div>
      );
    }

    if (column.key === 'status') {
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            item.status === 'Placed'
              ? 'bg-emerald-50 text-emerald-600'
              : item.status === 'Looking'
                ? 'bg-orange-50 text-orange-primary'
                : 'bg-slate-100 text-slate-600'
          }`}
        >
          {item.status}
        </span>
      );
    }

    return item[column.key];
  };

  return (
    <div
      className={`mt-4 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="px-5 pt-5">
        <h2 className="text-lg font-bold text-[#1c3a5e]">{title}</h2>

        <div className="mt-1 h-0.5 w-8 bg-primary-orange" />
      </div>

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

      <div className="overflow-x-auto">
        <table className="mt-4 w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-y border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              {columns.map((column) => (
                <th key={column.key} className="px-2 py-2 font-medium">
                  {column.label}
                </th>
              ))}

              <th className="px-5 py-2 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-slate-50 last:border-0"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-2 py-3 text-slate-600">
                    {renderCell(column, item)}
                  </td>
                ))}

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

      <button
        type="button"
        onClick={onViewAll}
        className="mt-auto rounded-b-xl border-t border-slate-100 py-3 text-center text-sm font-semibold text-[#1c3a5e] hover:bg-slate-50"
      >
        View All
      </button>
    </div>
  );
}
