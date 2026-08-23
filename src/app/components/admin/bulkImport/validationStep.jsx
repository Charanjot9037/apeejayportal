export default function ValidationStep({
  validatedStudents,
  validCount,
  invalidCount,
  fileName,
  handleStudentChange,
  setStep,
  setValidatedStudents,
}) {
  return (
    <div className="flex h-[70vh] flex-col">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Validate Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and correct the imported data.
            </p>
          </div>

          <div className="text-sm text-slate-500">{fileName}</div>
        </div>

        {/* Summary */}
        <div className="mt-5 flex gap-4">
          <div className="rounded-lg bg-slate-50 px-5 py-3">
            <p className="text-xs text-slate-500">Total</p>

            <p className="text-lg font-semibold">{validatedStudents.length}</p>
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
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Validation</th>
            </tr>
          </thead>

          <tbody>
            {validatedStudents.map((student, index) => (
              <tr key={index} className="border-t border-slate-200">
                <td className="px-4 py-3">{index + 1}</td>

                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={student.name}
                    onChange={(event) =>
                      handleStudentChange(index, 'name', event.target.value)
                    }
                    className={`w-full rounded-md border px-3 py-2 outline-none ${
                      student.errors.some((error) => error.includes('Name'))
                        ? 'border-red-400'
                        : 'border-slate-300'
                    }`}
                  />
                </td>

                <td className="px-4 py-3">
                  <input
                    type="email"
                    value={student.email}
                    onChange={(event) =>
                      handleStudentChange(index, 'email', event.target.value)
                    }
                    className={`w-full rounded-md border px-3 py-2 outline-none ${
                      student.errors.some(
                        (error) =>
                          error.includes('email') || error.includes('Email'),
                      )
                        ? 'border-red-400'
                        : 'border-slate-300'
                    }`}
                  />
                </td>

                <td className="px-4 py-3">
                  {student.isValid ? (
                    <span className="font-medium text-green-600">✓ Valid</span>
                  ) : (
                    <div>
                      <span className="font-medium text-red-600">✗ Error</span>

                      <div className="mt-1 text-xs text-red-500">
                        {student.errors.join(', ')}
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
              setValidatedStudents([]);
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Change File
          </button>

          <button
            type="button"
            disabled={validatedStudents.length === 0 || invalidCount > 0}
            onClick={() => {
              if (invalidCount === 0) {
                setStep(3);
              }
            }}
            className="rounded-lg bg-primary-orange px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
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
