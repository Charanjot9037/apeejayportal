import { CloudUpload } from 'lucide-react';

export default function UploadStep({
  setFieldValue,
  handleFileParse,
  isDragging,
  setIsDragging,
  downloadTemplate,
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-main-blue">
        Bulk Import Students
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Upload a CSV or Excel file containing student name and email.
      </p>

      {/* Required format */}
      <div>
        <div className="mt-2 rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            Required file format
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Your file must contain the following columns:
          </p>

          <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Guide Name</th>
                  <th className="px-4 py-3">Guide Email</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 font-medium">studnet name</td>

                  <td className="px-4 py-3">xyz@gmail.com</td>
                  <td className="px-4 py-3 font-medium">Guide name</td>

                  <td className="px-4 py-3">xyz@gmail.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Download template */}
      <button
        type="button"
        onClick={downloadTemplate}
        className="mt-4 rounded-lg border bg-primary-orange px-4 py-2 text-sm font-medium text-white hover:bg-slate-50 hover:text-primary-orange"
      >
        Download Template
      </button>

      {/* Dropzone */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);

          const file = event.dataTransfer.files?.[0];

          if (file) {
            setFieldValue("file", file);
            handleFileParse(file);
          }
        }}
        className={`mt-5 flex h-[150px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition ${
          isDragging
            ? "border-primary-orange bg-orange-50"
            : "border-slate-300 bg-slate-50"
        }`}
      >
        <label
          htmlFor="student-file"
          className="flex cursor-pointer flex-col items-center justify-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 transition hover:bg-blue-100">
            <CloudUpload className="h-8 w-8 text-blue-500" strokeWidth={1.8} />
          </div>

          <p className="mt-2 text-sm font-medium text-slate-700">
            Drag & drop or click to upload
          </p>

          <p className="mt-1 text-xs text-slate-400">CSV or XLSX</p>
        </label>

        <input
          id="student-file"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];

            if (!file) return;

            setFieldValue("file", file);
            handleFileParse(file);
          }}
        />
      </div>
    </div>
  );
}
