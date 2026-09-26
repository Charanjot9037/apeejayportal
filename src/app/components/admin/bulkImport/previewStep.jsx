export default function PreviewStep({
  role = 'student',
  validatedRows = [],
  isUploading,
  handleFinalUpload,
  setStep,
}) {
  const isMentor = role === 'mentor';

  return (
    <div className="flex h-[70vh] flex-col">
      {/* Header */}
      <div className="shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Final Preview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review the {isMentor ? 'mentors' : 'students'} before importing
            them.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-5 flex gap-4">
          <div className="rounded-lg bg-slate-50 px-5 py-3">
            <p className="text-xs text-slate-500">
              Total {isMentor ? 'Mentors' : 'Students'}
            </p>

            <p className="text-lg font-semibold text-slate-800">
              {validatedRows.length}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 px-5 py-3">
            <p className="text-xs text-slate-500">Ready to Import</p>

            <p className="text-lg font-semibold text-green-600">
              {validatedRows.length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 min-h-0 flex-1 overflow-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">#</th>

              <th className="px-4 py-3 font-semibold text-slate-700">
                {isMentor ? 'Mentor Name' : 'Student Name'}
              </th>

              <th className="px-4 py-3 font-semibold text-slate-700">Email</th>

              {isMentor ? (
                <>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Mobile
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Department
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Designation
                  </th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Guide Name
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Guide Email
                  </th>
                </>
              )}

              <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
            </tr>
          </thead>

          <tbody>
            {validatedRows.map((row, index) => (
              <tr key={index} className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>

                <td className="px-4 py-3 text-slate-800">{row.name}</td>

                <td className="px-4 py-3 text-slate-600">{row.email}</td>

                {isMentor ? (
                  <>
                    <td className="px-4 py-3 text-slate-600">
                      {row.mobileNumber}
                    </td>

                    <td className="px-4 py-3 text-slate-800">
                      {row.department}
                    </td>

                    <td className="px-4 py-3 text-slate-800">
                      {row.designation}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-slate-800">
                      {row.guidename}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {row.guideemail}
                    </td>
                  </>
                )}

                <td className="px-4 py-3">
                  <span className="whitespace-nowrap font-medium text-green-600">
                    ✓ Ready
                  </span>
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
            disabled={isUploading}
            onClick={() => setStep(2)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back to Edit
          </button>

          <button
            type="button"
            onClick={handleFinalUpload}
            disabled={isUploading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-orange px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading...
              </>
            ) : (
              `Upload ${isMentor ? 'Mentors' : 'Students'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
