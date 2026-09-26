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
    <div className="flex h-[70vh] flex-col">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {isMentor ? 'Validate Mentors' : 'Validate Students'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and correct the imported data.
            </p>
          </div>

          {fileName && (
            <div className="max-w-[250px] truncate text-sm text-slate-500">
              {fileName}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-5 flex gap-4">
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

      {/* Table */}
      <div className="mt-5 min-h-0 flex-1 overflow-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr>
              <th className="px-4 py-3">#</th>

              <th className="px-4 py-3">
                {isMentor ? 'Mentor Name' : 'Student Name'}
              </th>

              <th className="px-4 py-3">Email</th>

              {isMentor ? (
                <>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3">Guide Name</th>
                  <th className="px-4 py-3">Guide Email</th>
                </>
              )}

              <th className="px-4 py-3">Validation</th>
            </tr>
          </thead>

          <tbody>
            {validatedRows.map((row, index) => (
              <tr key={index} className="border-t border-slate-200">
                {/* Row number */}
                <td className="px-4 py-3 text-slate-600">
                  {row.rowNumber || index + 2}
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(event) =>
                      handleChange(index, 'name', event.target.value)
                    }
                    className={`w-full min-w-[150px] rounded-md border px-3 py-2 outline-none transition focus:ring-1 ${
                      row.errors?.some((error) =>
                        error.toLowerCase().includes('name'),
                      )
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                    }`}
                  />
                </td>

                {/* Email */}
                <td className="px-4 py-3">
                  <input
                    type="email"
                    value={row.email}
                    onChange={(event) =>
                      handleChange(index, 'email', event.target.value)
                    }
                    className={`w-full min-w-[200px] rounded-md border px-3 py-2 outline-none transition focus:ring-1 ${
                      row.errors?.some((error) =>
                        error.toLowerCase().includes('email'),
                      )
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                    }`}
                  />
                </td>

                {/* Mentor fields */}
                {isMentor ? (
                  <>
                    {/* Mobile */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.mobileNumber}
                        onChange={(event) =>
                          handleChange(
                            index,
                            'mobileNumber',
                            event.target.value,
                          )
                        }
                        className={`w-full min-w-[140px] rounded-md border px-3 py-2 outline-none transition focus:ring-1 ${
                          row.errors?.some((error) =>
                            error.toLowerCase().includes('mobile'),
                          )
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                        }`}
                      />
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3">
                      <select
                        value={row.department}
                        onChange={(event) =>
                          handleChange(index, 'department', event.target.value)
                        }
                        className={`w-full min-w-[200px] rounded-md border px-3 py-2 outline-none transition focus:ring-1 ${
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

                    {/* Designation */}
                    <td className="px-4 py-3">
                      <select
                        value={row.designation}
                        onChange={(event) =>
                          handleChange(index, 'designation', event.target.value)
                        }
                        className={`w-full min-w-[180px] rounded-md border px-3 py-2 outline-none transition focus:ring-1 ${
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
                    {/* Guide Name */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.guidename}
                        onChange={(event) =>
                          handleChange(index, 'guidename', event.target.value)
                        }
                        className={`w-full min-w-[150px] rounded-md border px-3 py-2 outline-none transition focus:ring-1 ${
                          row.errors?.some((error) =>
                            error.toLowerCase().includes('guide name'),
                          )
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-primary-orange focus:ring-orange-200'
                        }`}
                      />
                    </td>

                    {/* Guide Email */}
                    <td className="px-4 py-3">
                      <input
                        type="email"
                        value={row.guideemail}
                        onChange={(event) =>
                          handleChange(index, 'guideemail', event.target.value)
                        }
                        className={`w-full min-w-[200px] rounded-md border px-3 py-2 outline-none transition focus:ring-1 ${
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

                {/* Validation */}
                <td className="px-4 py-3">
                  {row.isValid ? (
                    <span className="whitespace-nowrap font-medium text-green-600">
                      ✓ Valid
                    </span>
                  ) : (
                    <div>
                      <span className="whitespace-nowrap font-medium text-red-600">
                        ✗ Error
                      </span>

                      <div className="mt-1 min-w-[180px] text-xs leading-5 text-red-500">
                        {row.errors?.join(', ')}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="shrink-0 p-4">
        <div className="flex justify-end gap-3">
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

        {invalidCount > 0 && (
          <p className="mt-3 text-right text-sm text-red-500">
            Please fix all row errors before continuing.
          </p>
        )}
      </div>
    </div>
  );
}
