'use client';

import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { CloudUpload } from 'lucide-react';

const validationSchema = Yup.object({
  file: Yup.mixed()
    .required('Please select a file')
    .test('fileType', 'Only CSV or XLSX files are allowed', (value) => {
      if (!value) return false;

      const fileName = value.name?.toLowerCase();

      return fileName.endsWith('.csv') || fileName.endsWith('.xlsx');
    }),
});

const validateStudents = (students) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailCount = {};

  students.forEach((student) => {
    const email = student.email?.toString().trim().toLowerCase();

    if (email) {
      emailCount[email] = (emailCount[email] || 0) + 1;
    }
  });

  return students.map((student) => {
    const name = student.name?.toString().trim() || '';

    const email = student.email?.toString().trim().toLowerCase() || '';

    const errors = [];

    if (!name) {
      errors.push('Name is required');
    }

    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Invalid email');
    }

    if (email && emailCount[email] > 1) {
      errors.push('Duplicate email');
    }

    return {
      name,
      email,
      errors,
      isValid: errors.length === 0,
    };
  });
};

const downloadTemplate = () => {
  const csvContent = 'name,email\n' + 'xyz,xyz@example.com\n';

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = 'student-import-template.csv';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export default function BulkImport() {
  const [step, setStep] = useState(1);

  const [validatedStudents, setValidatedStudents] = useState([]);

  const [isDragging, setIsDragging] = useState(false);

  const [fileName, setFileName] = useState('');

  const handleFileParse = (file) => {
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target.result;

        const workbook = XLSX.read(data, {
          type: 'array',
        });

        if (!workbook.SheetNames.length) {
          setValidatedStudents([]);
          return;
        }

        const firstSheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[firstSheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet);

        const validatedRows = validateStudents(rows);

        setValidatedStudents(validatedRows);

        // Move to step 2
        setStep(2);
      } catch (error) {
        console.error('Error reading file:', error);

        setValidatedStudents([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...validatedStudents];

    updatedStudents[index] = {
      ...updatedStudents[index],
      [field]: value,
    };

    const revalidatedStudents = validateStudents(
      updatedStudents.map((student) => ({
        name: student.name,
        email: student.email,
      })),
    );

    setValidatedStudents(revalidatedStudents);
  };

  const handleFinalUpload = async () => {
    try {
      const validStudents = validatedStudents
        .filter((student) => student.isValid)
        .map((student) => ({
          name: student.name,
          email: student.email,
        }));

      if (validStudents.length === 0) {
        alert('No valid students to import.');
        return;
      }

      const response = await fetch('/api/bulkImport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students: validStudents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Import failed:', data);

        alert(data.message || 'Failed to import students.');

        return;
      }

      console.log('Bulk import response:', data);

      console.log('Student credentials:', data.credentials);

      alert(
        `Import successful!\n\n` +
          `Imported: ${data.summary.imported}\n` +
          `Already Exists: ${data.summary.alreadyExists}`,
      );
    } catch (error) {
      console.error('Bulk import error:', error);

      alert('Something went wrong while importing students.');
    }
  };

  const invalidCount = validatedStudents.filter(
    (student) => !student.isValid,
  ).length;

  const validCount = validatedStudents.filter(
    (student) => student.isValid,
  ).length;

  return (
    <Formik
      initialValues={{
        file: null,
      }}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ setFieldValue }) => (
        <Form>
          <div className="mx-auto mt-8  w-full max-w-3xl h-[600px] rounded-xl border border-slate-200  p-6">
            <div className="mb-8 flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= 1
                    ? 'bg-primary-orange text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                1
              </div>

              <div className="mx-3 h-px flex-1 bg-slate-200" />

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= 2
                    ? 'bg-primary-orange text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </div>

              <div className="mx-3 h-px flex-1 bg-slate-200" />

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= 3
                    ? 'bg-primary-orange text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                3
              </div>
            </div>

            {/* ========================================
                STEP 1
            ========================================= */}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Bulk Import Students
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a CSV or Excel file containing student name and email.
                </p>

                {/* Required format */}
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
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="border-t">
                          <td className="px-4 py-3 font-medium">
                            Simran Bhandari
                          </td>

                          <td className="px-4 py-3"> Simran@example.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Download template */}

                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                      setFieldValue('file', file);
                      handleFileParse(file);
                    }
                  }}
                  className={`mt-5 flex h-[150px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition ${
                    isDragging
                      ? 'border-primary-orange bg-orange-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {/* Cloud - Clickable */}
                  <label
                    htmlFor="student-file"
                    className="flex cursor-pointer flex-col items-center justify-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 transition hover:bg-blue-100">
                      <CloudUpload
                        className="h-8 w-8 text-blue-500"
                        strokeWidth={1.8}
                      />
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

                      setFieldValue('file', file);
                      handleFileParse(file);
                    }}
                  />
                </div>
              </div>
            )}

            {/* ========================================
                STEP 2
            ========================================= */}

            {step === 2 && (
              <div className="flex h-[70vh] flex-col">
                {/* Header - Fixed */}
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

                  {/* Summary - Fixed */}
                  <div className="mt-5 flex gap-4">
                    <div className="rounded-lg bg-slate-50 px-5 py-3">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-lg font-semibold">
                        {validatedStudents.length}
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-50 px-5 py-3">
                      <p className="text-xs text-slate-500">Valid</p>
                      <p className="text-lg font-semibold text-green-600">
                        {validCount}
                      </p>
                    </div>

                    <div className="rounded-lg bg-red-50 px-5 py-3">
                      <p className="text-xs text-slate-500">Errors</p>
                      <p className="text-lg font-semibold text-red-600">
                        {invalidCount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TABLE - Only this scrolls */}
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
                                handleStudentChange(
                                  index,
                                  'name',
                                  event.target.value,
                                )
                              }
                              className={`w-full rounded-md border px-3 py-2 outline-none ${
                                student.errors.some((error) =>
                                  error.includes('Name'),
                                )
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
                                handleStudentChange(
                                  index,
                                  'email',
                                  event.target.value,
                                )
                              }
                              className={`w-full rounded-md border px-3 py-2 outline-none ${
                                student.errors.some(
                                  (error) =>
                                    error.includes('email') ||
                                    error.includes('Email'),
                                )
                                  ? 'border-red-400'
                                  : 'border-slate-300'
                              }`}
                            />
                          </td>

                          <td className="px-4 py-3">
                            {student.isValid ? (
                              <span className="font-medium text-green-600">
                                ✓ Valid
                              </span>
                            ) : (
                              <div>
                                <span className="font-medium text-red-600">
                                  ✗ Error
                                </span>

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

                {/* FOOTER - Fixed */}
                <div className=" shrink-0  p-4">
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
                      disabled={
                        validatedStudents.length === 0 || invalidCount > 0
                      }
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
            )}

            {/* ========================================
                STEP 3
            ========================================= */}

            {step === 3 && (
              <div className="flex h-[70vh] flex-col">
                {/* Header - Fixed */}
                <div className="shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      Final Preview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Review the students before importing them.
                    </p>
                  </div>

                  {/* Summary - Fixed */}
                  <div className="mt-5 flex gap-4">
                    <div className="rounded-lg bg-slate-50 px-5 py-3">
                      <p className="text-xs text-slate-500">Total Students</p>

                      <p className="text-lg font-semibold text-slate-800">
                        {validatedStudents.length}
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-50 px-5 py-3">
                      <p className="text-xs text-slate-500">Ready to Import</p>

                      <p className="text-lg font-semibold text-green-600">
                        {validatedStudents.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TABLE - Only this area scrolls */}
                <div className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-sm">
                    {/* Sticky table header */}
                    <thead className="sticky top-0 z-10 bg-slate-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-slate-700">
                          #
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Student Name
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Email
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {validatedStudents.map((student, index) => (
                        <tr key={index} className="border-t border-slate-200">
                          <td className="px-4 py-3 text-slate-600">
                            {index + 1}
                          </td>

                          {/* Read-only Name */}
                          <td className="px-4 py-3 text-slate-800">
                            {student.name}
                          </td>

                          {/* Read-only Email */}
                          <td className="px-4 py-3 text-slate-600">
                            {student.email}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span className="font-medium text-green-600">
                              ✓ Ready
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER - Fixed */}
                <div className="mt-5 shrink-0 border-t border-slate-200 pt-4">
                  <div className="flex justify-end gap-3">
                    {/* Back to Step 2 */}
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Back to Edit
                    </button>

                    {/* Final Upload */}
                    <button
                      type="button"
                      onClick={handleFinalUpload}
                      className="rounded-lg bg-primary-orange px-5 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                      Upload Students
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
