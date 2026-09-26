import { CloudUpload } from 'lucide-react';

export default function UploadStep({
  role = 'student',
  handleFileParse,
  isDragging,
  setIsDragging,
  downloadTemplate,
}) {
  const isMentor = role === 'mentor';

  const handleSelectedFile = (file) => {
    if (!file) return;

    handleFileParse(file);
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl font-semibold text-main-blue">
        {isMentor ? 'Bulk Import Mentors' : 'Bulk Import Students'}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {isMentor
          ? 'Upload a CSV or Excel file containing mentor details.'
          : 'Upload a CSV or Excel file containing student details.'}
      </p>

      {/* Required file format */}
      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">
          Required file format
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Your file must contain the following columns:
        </p>

        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100">
              {isMentor ? (
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Guide Name</th>
                  <th className="px-4 py-3">Guide Email</th>
                </tr>
              )}
            </thead>

            <tbody>
              {isMentor ? (
                <tr className="border-t">
                  <td className="px-4 py-3 font-medium">Dr. Sarah Jenkins</td>

                  <td className="px-4 py-3">sarah.jenkins@university.edu</td>

                  <td className="px-4 py-3">9876543210</td>

                  <td className="px-4 py-3">Information Technology</td>

                  <td className="px-4 py-3">assistant_professor</td>
                </tr>
              ) : (
                <tr className="border-t">
                  <td className="px-4 py-3 font-medium">Student Name</td>

                  <td className="px-4 py-3">student@gmail.com</td>

                  <td className="px-4 py-3 font-medium">Guide Name</td>

                  <td className="px-4 py-3">guide@gmail.com</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download template */}
      <button
        type="button"
        onClick={downloadTemplate}
        className="mt-4 rounded-lg border bg-primary-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-50 hover:text-primary-orange"
      >
        Download Template
      </button>

      {/* Upload area */}
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
            handleSelectedFile(file);
          }
        }}
        className={`mt-5 flex h-[150px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition ${
          isDragging
            ? 'border-primary-orange bg-orange-50'
            : 'border-slate-300 bg-slate-50'
        }`}
      >
        <label
          htmlFor={`${role}-file`}
          className="flex cursor-pointer flex-col items-center justify-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 transition hover:bg-blue-100">
            <CloudUpload className="h-8 w-8 text-blue-500" strokeWidth={1.8} />
          </div>

          <p className="mt-2 text-sm font-medium text-slate-700">
            Drag & drop or click to upload
          </p>

          <p className="mt-1 text-xs text-slate-400">CSV, XLSX or XLS</p>
        </label>

        <input
          id={`${role}-file`}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];

            if (!file) return;

            handleSelectedFile(file);

            // Allow selecting the same file again
            event.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
