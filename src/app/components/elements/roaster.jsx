'use client';

import { useState } from 'react';
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react';

import Avatar from './avatar';
import SelectField from './SelectFiled';

export default function Roster({
  title = 'Roster',
  data = [],
  columns = [],
  searchPlaceholder = 'Search...',
  onRowClick,
  onApplyFilters,
  className = '',
  defaultFilters = {},
  filterConfig = [],
  showApplyButton = false,
}) {
  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [search, setSearch] = useState('');

  const [showAll, setShowAll] = useState(false);

  /*
   * Stores the currently selected filters.
   *
   * Example:
   *
   * {
   *   department: 'ENGINEERING',
   *   program: '',
   *   specialization: '',
   *   academicBatch: ''
   * }
   *
   * If department is present in defaultFilters,
   * it will automatically appear selected.
   */
  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
  }));

  /*
   * =========================================================
   * GET FILTER OPTIONS
   * =========================================================
   *
   * This supports both:
   *
   * Normal dropdown:
   *
   * options: [
   *   {
   *     value: 'ENGINEERING',
   *     label: 'Engineering'
   *   }
   * ]
   *
   * Dependent dropdown:
   *
   * dependsOn: 'department'
   *
   * options: {
   *   ENGINEERING: [...],
   *   MANAGEMENT: [...]
   * }
   */
  const getFilterOptions = (filter) => {
    const { options = [], dependsOn } = filter;

    /*
     * Normal dropdown.
     */
    if (!dependsOn) {
      return Array.isArray(options) ? options : [];
    }

    /*
     * Find the selected parent value.
     *
     * Example:
     *
     * dependsOn = 'department'
     *
     * filters.department = 'ENGINEERING'
     */
    const parentValue = filters[dependsOn];

    /*
     * Parent hasn't been selected.
     */
    if (!parentValue) {
      return [];
    }

    /*
     * Return options belonging to
     * selected parent.
     */
    return options?.[parentValue] || [];
  };

  /*
   * =========================================================
   * HANDLE FILTER CHANGE
   * =========================================================
   */
  const handleFilterChange = (key, value) => {
    setFilters((previousFilters) => {
      const updatedFilters = {
        ...previousFilters,
        [key]: value,
      };

      /*
       * Department changed.
       *
       * Clear fields that depend on department.
       */
      if (key === 'department') {
        updatedFilters.program = '';
        updatedFilters.specialization = '';
        updatedFilters.currentSemester = '';
      }

      /*
       * Program changed.
       *
       * Semester depends on program.
       */
      if (key === 'program') {
        updatedFilters.currentSemester = '';
      }

      console.log('Roster - filter changed:', updatedFilters);

      return updatedFilters;
    });
  };

  /*
   * =========================================================
   * APPLY FILTERS
   * =========================================================
   */
  const handleApplyFilters = () => {
    console.log('Roster - applying filters:', filters);

    /*
     * Send selected filters to parent.
     *
     * Roster itself does not call the API.
     */
    onApplyFilters?.({
      ...filters,
    });
  };

  /*
   * =========================================================
   * RENDER TABLE CELL
   * =========================================================
   */
  const renderCell = (column, item) => {
    /*
     * NAME COLUMN
     */
    if (column.key === 'name') {
      return (
        <div className="flex items-center gap-3">
          <Avatar name={item.name} />

          <div>
            <p className="font-semibold text-slate-700">{item.name || '-'}</p>

            {item.id && <p className="text-xs text-slate-400">{item.id}</p>}
          </div>
        </div>
      );
    }

    /*
     * STATUS COLUMN
     */
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
          {item.status || '-'}
        </span>
      );
    }

    /*
     * ALL OTHER COLUMNS
     */
    return item[column.key] ?? '-';
  };

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   *
   * Search only searches the data already loaded.
   *
   * It does NOT call the API.
   */
  const filteredData = data.filter((item) => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return true;
    }

    return Object.values(item).some((value) =>
      String(value ?? '')
        .toLowerCase()
        .includes(searchValue),
    );
  });

  /*
   * =========================================================
   * DISPLAY DATA
   * =========================================================
   */
  const displayedData = showAll ? filteredData : filteredData.slice(0, 5);

  return (
    <div
      className={`mt-4 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="px-5 pt-5">
        <h2 className="text-lg font-bold text-[#1c3a5e]">{title}</h2>

        <div className="mt-1 h-0.5 w-8 bg-primary-orange" />
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="px-5 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowAll(false);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-600 placeholder:text-slate-400 focus:border-[#f2792a] focus:outline-none focus:ring-1 focus:ring-[#f2792a]"
          />
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      {filterConfig.length > 0 && (
        <div className="px-5 pt-4">
          {/* Filter heading */}

          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />

            <span className="text-sm font-semibold text-slate-600">
              Filters
            </span>
          </div>

          {/* Filter grid */}

          <div
            className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${
              filterConfig.length === 1
                ? 'lg:grid-cols-1'
                : filterConfig.length === 2
                  ? 'lg:grid-cols-2'
                  : filterConfig.length === 3
                    ? 'lg:grid-cols-3'
                    : 'lg:grid-cols-4'
            }`}
          >
            {filterConfig.map((filter) => {
              const { key, label, placeholder, dependsOn } = filter;

              /*
               * Get options for this filter.
               */
              const options = getFilterOptions(filter);

              /*
               * Is this a dependent dropdown?
               */
              const isDependent = Boolean(dependsOn);

              /*
               * Find parent value.
               */
              const parentValue = dependsOn ? filters[dependsOn] : null;

              /*
               * Parent must exist before
               * dependent dropdown is enabled.
               */
              const parentSelected = !isDependent || Boolean(parentValue);

              return (
                <div key={key}>
                  <SelectField
                    label={label}
                    name={key}
                    value={filters[key] || ''}
                    onChange={(value) => handleFilterChange(key, value)}
                    onBlur={() => {}}
                    placeholder={
                      !parentSelected
                        ? `Select ${dependsOn}`
                        : placeholder || `Select ${label}`
                    }
                    options={options}
                    disabled={!parentSelected}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              APPLY BUTTON
          ================================================== */}

          {showApplyButton && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="rounded-lg bg-[#f2792a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#df681c] focus:outline-none focus:ring-2 focus:ring-[#f2792a] focus:ring-offset-2"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="overflow-x-auto">
        <table className="mt-4 w-full min-w-[600px] text-left text-sm">
          {/* Header */}

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

          {/* Body */}

          <tbody>
            {displayedData.length > 0 ? (
              displayedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-2 py-3 text-slate-600">
                      {renderCell(column, item)}
                    </td>
                  ))}

                  {/* Action */}

                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRowClick?.(item)}
                      className="text-slate-300 transition hover:text-slate-500"
                    >
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-5 py-8 text-center text-sm text-slate-400"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          VIEW ALL
      ====================================================== */}

      {filteredData.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll((previous) => !previous)}
          className="mt-auto rounded-b-xl border-t border-slate-100 py-3 text-center text-sm font-semibold text-[#1c3a5e] hover:bg-slate-50"
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      )}
    </div>
  );
}
