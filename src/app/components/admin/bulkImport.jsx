'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

import {
  ImportSteps,
  UploadStep,
  ValidationStep,
  PreviewStep,
} from './bulkImport/index';

export default function BulkImport({ role = 'student' }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isMentor = role === 'mentor';

  // =========================================================
  // 1. DOWNLOAD TEMPLATE
  // =========================================================

  const downloadTemplate = () => {
    const data = isMentor
      ? [
          {
            name: '',
            email: '',
            mobileNumber: '',
            department: '',
            designation: '',
          },
        ]
      : [
          {
            name: '',
            email: '',
            guidename: '',
            guideemail: '',
          },
        ];

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      isMentor ? 'Mentor Template' : 'Student Template',
    );

    XLSX.writeFile(
      workbook,
      isMentor ? 'mentor-template.xlsx' : 'student-template.xlsx',
    );
  };

  // =========================================================
  // 2. PARSE FILE
  // =========================================================

  const handleFileParse = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);

        const workbook = XLSX.read(data, {
          type: 'array',
        });

        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          toast.error('The uploaded file is empty.');
          return;
        }

        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
        });

        if (!jsonData.length) {
          toast.error('The uploaded file is empty.');
          return;
        }

        const formattedRows = isMentor
          ? validateMentors(jsonData)
          : validateStudents(jsonData);

        setRows(formattedRows);
        setStep(2);
      } catch (error) {
        console.error('FILE_PARSE_ERROR:', error);

        toast.error('Unable to read the file.');
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  // =========================================================
  // 3. STUDENT VALIDATION
  // =========================================================

  const validateStudents = (data) => {
    return data.map((student, index) => {
      const errors = [];

      const name = String(student.name || '').trim();

      const email = String(student.email || '')
        .trim()
        .toLowerCase();

      const guidename = String(student.guidename || '').trim();

      const guideemail = String(student.guideemail || '')
        .trim()
        .toLowerCase();

      // NAME
      if (!name) {
        errors.push('Name is required');
      } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters');
      }

      // EMAIL
      if (!email) {
        errors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Enter a valid email');
      }

      // GUIDE NAME
      if (!guidename) {
        errors.push('Guide name is required');
      }

      // GUIDE EMAIL
      if (!guideemail) {
        errors.push('Guide email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guideemail)) {
        errors.push('Enter a valid guide email');
      }

      return {
        rowNumber: index + 2,
        name,
        email,
        guidename,
        guideemail,
        errors,
        isValid: errors.length === 0,
      };
    });
  };

  // =========================================================
  // 4. MENTOR VALIDATION
  // =========================================================

  const validateMentors = (data) => {
    const departments = ['Information Technology', 'Management', 'Engineering'];

    const designations = [
      'assistant_professor',
      'HOD',
      'Dean',
      'Director',
      'Engineer',
    ];

    return data.map((mentor, index) => {
      const errors = [];

      const name = String(mentor.name || '').trim();

      const email = String(mentor.email || '')
        .trim()
        .toLowerCase();

      const mobileNumber = String(mentor.mobileNumber || '').trim();

      const department = String(mentor.department || '').trim();

      const designation = String(mentor.designation || '').trim();

      // =====================================================
      // NAME
      // =====================================================

      if (!name) {
        errors.push('Name is required');
      } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters');
      }

      // =====================================================
      // EMAIL
      // =====================================================

      if (!email) {
        errors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Enter a valid email');
      }

      // =====================================================
      // MOBILE NUMBER
      // =====================================================

      if (!mobileNumber) {
        errors.push('Mobile number is required');
      } else if (!/^[6-9][0-9]{9}$/.test(mobileNumber)) {
        errors.push('Enter a valid 10-digit mobile number');
      }

      // =====================================================
      // DEPARTMENT
      // =====================================================

      if (!department) {
        errors.push('Department is required');
      } else if (!departments.includes(department)) {
        errors.push('Invalid department');
      }

      // =====================================================
      // DESIGNATION
      // =====================================================

      if (!designation) {
        errors.push('Designation is required');
      } else if (!designations.includes(designation)) {
        errors.push('Invalid designation');
      }

      return {
        rowNumber: index + 2,
        name,
        email,
        mobileNumber,
        department,
        designation,
        errors,
        isValid: errors.length === 0,
      };
    });
  };

  // =========================================================
  // 5. EDIT VALIDATION ROW
  // =========================================================

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];

    // -------------------------------------------------------
    // MOBILE NUMBER
    // Only allow digits and maximum 10 characters
    // -------------------------------------------------------

    if (isMentor && field === 'mobileNumber') {
      value = String(value).replace(/\D/g, '').slice(0, 10);
    }

    updatedRows[index][field] = value;

    // -------------------------------------------------------
    // REVALIDATE ALL ROWS
    // -------------------------------------------------------

    const validated = isMentor
      ? validateMentors(
          updatedRows.map((row) => ({
            name: row.name,
            email: row.email,
            mobileNumber: row.mobileNumber,
            department: row.department,
            designation: row.designation,
          })),
        )
      : validateStudents(
          updatedRows.map((row) => ({
            name: row.name,
            email: row.email,
            guidename: row.guidename,
            guideemail: row.guideemail,
          })),
        );

    setRows(validated);
  };

  // =========================================================
  // 6. CONTINUE TO PREVIEW
  // =========================================================

  const goToPreview = () => {
    const invalidRows = rows.filter((row) => !row.isValid);

    if (invalidRows.length > 0) {
      toast.error('Please fix all validation errors first.');
      return;
    }

    setStep(3);
  };

  // =========================================================
  // 7. FINAL UPLOAD
  // =========================================================

  const handleUpload = async () => {
    try {
      setLoading(true);

      const payload = rows.map((row) =>
        isMentor
          ? {
              name: row.name,
              email: row.email,
              mobileNumber: row.mobileNumber,
              department: row.department,
              designation: row.designation,
            }
          : {
              name: row.name,
              email: row.email,
              guidename: row.guidename,
              guideemail: row.guideemail,
            },
      );

      const response = await fetch('/api/admin/bulkImport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students: payload,
          role: role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      toast.success(
        isMentor
          ? 'Mentors imported successfully'
          : 'Students imported successfully',
      );

      setRows([]);
      setFile(null);
      setStep(1);
    } catch (error) {
      console.error('BULK_IMPORT_ERROR:', error);

      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // COUNTS
  // =========================================================

  const invalidCount = rows.filter((row) => !row.isValid).length;

  const validCount = rows.filter((row) => row.isValid).length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="w-full">
      <div className="mx-auto w-full rounded-xl border border-slate-200 bg-white p-6">
        {/* STEP INDICATOR */}

        <ImportSteps step={step} />

        {/* ================================================= */}
        {/* STEP 1 - UPLOAD */}
        {/* ================================================= */}

        {step === 1 && (
          <UploadStep
            role={role}
            handleFileParse={handleFileParse}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            downloadTemplate={downloadTemplate}
          />
        )}

        {/* ================================================= */}
        {/* STEP 2 - VALIDATION */}
        {/* ================================================= */}

        {step === 2 && (
          <ValidationStep
            role={role}
            validatedRows={rows}
            validCount={validCount}
            invalidCount={invalidCount}
            fileName={file?.name || ''}
            handleChange={handleChange}
            setStep={setStep}
            setRows={setRows}
          />
        )}

        {/* ================================================= */}
        {/* STEP 3 - PREVIEW */}
        {/* ================================================= */}

        {step === 3 && (
          <PreviewStep
            role={role}
            validatedRows={rows}
            isUploading={loading}
            handleFinalUpload={handleUpload}
            setStep={setStep}
          />
        )}
      </div>
    </div>
  );
}
