'use client';

export default function ValidationStep({
  role = 'student',
  validatedRows = [],
  validCount,
  invalidCount,
  fileName,
  handleChange,
  setStep,
  setRows,
}) {
  const isMentor = role === 'mentor';

  return (
    <div className="flex h-[70vh] min-w-0 flex-col">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="shrink-0">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-slate-800">
              {isMentor ? 'Validate Mentors' : 'Validate Students'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and correct the imported data.
            </p>
          </div>

          {fileName && (
            <div className="max-w-[250px] shrink-0 truncate text-sm text-slate-500">
              {fileName}
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <div className="mt-5 flex gap-3">
          <div className="rounded-lg bg-slate-50 px-5 py-3">
            <p className="text-xs text-slate-500">Total</p>

            <p className="text-lg font-semibold text-slate-800">
              {validatedRows.length}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 px-5 py-3">
            <p className="text-xs text-slate-500">Valid</p>

            <p className="text-lg font-semibold text-green-600">{validCount}</p>
          </div>

          <div className="rounded-lg bg-red-50 px-5 py-3">
            <p className="text-xs text-slate-500">Errors</p>

            <p className="text-lg font-semibold text-red-600">{invalidCount}</p>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-lg border border-slate-200">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          {/* ================================================= */}
          {/* COLUMN WIDTHS */}
          {/* ================================================= */}

          <colgroup>
            <col className="w-[5%]" />

            {isMentor ? (
              <>
                <col className="w-[15%]" />
                <col className="w-[18%]" />
                <col className="w-[13%]" />
                <col className="w-[17%]" />
                <col className="w-[15%]" />
                <col className="w-[17%]" />
              </>
            ) : (
              <>
                <col className="w-[18%]" />
                <col className="w-[21%]" />
                <col className="w-[18%]" />
                <col className="w-[21%]" />
                <col className="w-[17%]" />
              </>
            )}
          </colgroup>

          {/* ================================================= */}
          {/* TABLE HEADER */}
          {/* ================================================= */}

          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr>
              <th className="break-words px-2 py-3 font-semibold">#</th>

              <th className="break-words px-2 py-3 font-semibold">
                {isMentor ? 'Mentor Name' : 'Student Name'}
              </th>

              <th className="break-words px-2 py-3 font-semibold">Email</th>

              {isMentor ? (
                <>
                  <th className="break-words px-2 py-3 font-semibold">
                    Mobile
                  </th>

                  <th className="break-words px-2 py-3 font-semibold">
                    Department
                  </th>

                  <th className="break-words px-2 py-3 font-semibold">
                    Designation
                  </th>
                </>
              ) : (
                <>
                  <th className="break-words px-2 py-3 font-semibold">
                    Guide Name
                  </th>

                  <th className="break-words px-2 py-3 font-semibold">
                    Guide Email
                  </th>
                </>
              )}

              <th className="break-words px-2 py-3 font-semibold">
                Validation
              </th>
            </tr>
          </thead>

          {/* ================================================= */}
          {/* TABLE BODY */}
          {/* ================================================= */}

          <tbody>
            {validatedRows.map((row, index) => (
              <tr key={index} className="border-t border-slate-200 align-top">
                {/* ================================================= */}
                {/* ROW NUMBER */}
                {/* ================================================= */}

                <td className="px-2 py-4 text-slate-600">
                  {row.rowNumber || index + 2}
                </td>

                {/* ================================================= */}
                {/* NAME */}
                {/* ================================================= */}

                <td className="px-2 py-4">
                  <input
                    type="text"
                    value={row.name || ''}
                    onChange={(event) =>
                      handleChange(index, 'name', event.target.value)
                    }
                    className={`block w-full min-w-0 rounded-md border px-2 py-2 text-sm outline-none transition focus:ring-1 ${
                      row.errors?.some((error) =>
                        error.toLowerCase().includes('name'),
                      )
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                    }`}
                  />
                </td>

                {/* ================================================= */}
                {/* EMAIL */}
                {/* ================================================= */}

                <td className="px-2 py-4">
                  <input
                    type="email"
                    value={row.email || ''}
                    onChange={(event) =>
                      handleChange(index, 'email', event.target.value)
                    }
                    className={`block w-full min-w-0 rounded-md border px-2 py-2 text-sm outline-none transition focus:ring-1 ${
                      row.errors?.some((error) =>
                        error.toLowerCase().includes('email'),
                      )
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                    }`}
                  />
                </td>

                {/* ================================================= */}
                {/* MENTOR FIELDS */}
                {/* ================================================= */}

                {isMentor ? (
                  <>
                    {/* ============================================= */}
                    {/* MOBILE */}
                    {/* ============================================= */}

                    <td className="px-2 py-4">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={row.mobileNumber || ''}
                        onChange={(event) =>
                          handleChange(
                            index,
                            'mobileNumber',
                            event.target.value,
                          )
                        }
                        className={`block w-full min-w-0 rounded-md border px-2 py-2 text-sm outline-none transition focus:ring-1 ${
                          row.errors?.some((error) =>
                            error.toLowerCase().includes('mobile'),
                          )
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                        }`}
                      />
                    </td>

                    {/* ============================================= */}
                    {/* DEPARTMENT */}
                    {/* ============================================= */}

                    <td className="px-2 py-4">
                      <select
                        value={row.department || ''}
                        onChange={(event) =>
                          handleChange(index, 'department', event.target.value)
                        }
                        className={`block w-full min-w-0 rounded-md border px-2 py-2 text-sm outline-none transition focus:ring-1 ${
                          row.errors?.some((error) =>
                            error.toLowerCase().includes('department'),
                          )
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                        }`}
                      >
                        <option value="">Select Department</option>

                        <option value="Information Technology">
                          Information Technology
                        </option>

                        <option value="Management">Management</option>

                        <option value="Engineering">Engineering</option>
                      </select>
                    </td>

                    {/* ============================================= */}
                    {/* DESIGNATION */}
                    {/* ============================================= */}

                    <td className="px-2 py-4">
                      <select
                        value={row.designation || ''}
                        onChange={(event) =>
                          handleChange(index, 'designation', event.target.value)
                        }
                        className={`block w-full min-w-0 rounded-md border px-2 py-2 text-sm outline-none transition focus:ring-1 ${
                          row.errors?.some((error) =>
                            error.toLowerCase().includes('designation'),
                          )
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                        }`}
                      >
                        <option value="">Select Designation</option>

                        <option value="assistant_professor">
                          Assistant Professor
                        </option>

                        <option value="HOD">HOD</option>

                        <option value="Dean">Dean</option>

                        <option value="Director">Director</option>

                        <option value="Engineer">Engineer</option>
                      </select>
                    </td>
                  </>
                ) : (
                  <>
                    {/* ============================================= */}
                    {/* GUIDE NAME */}
                    {/* ============================================= */}

                    <td className="px-2 py-4">
                      <input
                        type="text"
                        value={row.guidename || ''}
                        onChange={(event) =>
                          handleChange(index, 'guidename', event.target.value)
                        }
                        className={`block w-full min-w-0 rounded-md border px-2 py-2 text-sm outline-none transition focus:ring-1 ${
                          row.errors?.some((error) =>
                            error.toLowerCase().includes('guide name'),
                          )
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                        }`}
                      />
                    </td>

                    {/* ============================================= */}
                    {/* GUIDE EMAIL */}
                    {/* ============================================= */}

                    <td className="px-2 py-4">
                      <input
                        type="email"
                        value={row.guideemail || ''}
                        onChange={(event) =>
                          handleChange(index, 'guideemail', event.target.value)
                        }
                        className={`block w-full min-w-0 rounded-md border px-2 py-2 text-sm outline-none transition focus:ring-1 ${
                          row.errors?.some((error) =>
                            error.toLowerCase().includes('guide email'),
                          )
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                        }`}
                      />
                    </td>
                  </>
                )}

                {/* ================================================= */}
                {/* VALIDATION */}
                {/* ================================================= */}

                <td className="px-2 py-4 align-top">
                  {row.isValid ? (
                    <span className="block break-words font-medium text-green-600">
                      ✓ Valid
                    </span>
                  ) : (
                    <div className="min-w-0">
                      <span className="block font-medium text-red-600">
                        ✗ Error
                      </span>

                      <div className="mt-1 break-words text-xs leading-5 text-red-500">
                        {row.errors?.map((error, errorIndex) => (
                          <div key={errorIndex}>{error}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {validatedRows.length === 0 && (
              <tr>
                <td
                  colSpan={isMentor ? 7 : 6}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="shrink-0 p-4">
        <div className="flex justify-end gap-3">
          {/* CHANGE FILE */}

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setRows([]);
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Change File
          </button>

          {/* CONTINUE */}

          <button
            type="button"
            disabled={validatedRows.length === 0 || invalidCount > 0}
            onClick={() => {
              if (invalidCount === 0) {
                setStep(3);
              }
            }}
            className="rounded-lg bg-primary-orange px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Preview
          </button>
        </div>

        {/* ERROR MESSAGE */}

        {invalidCount > 0 && (
          <p className="mt-3 text-right text-sm text-red-500">
            Please fix all row errors before continuing.
          </p>
        )}
      </div>
    </div>
  );
}
