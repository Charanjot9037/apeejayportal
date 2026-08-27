"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  ImportSteps,
  UploadStep,
  ValidationStep,
  PreviewStep,
} from "./bulkImport/index";
import { apiRequest } from "@/lib/apiRequest";
import AuthGuardModal from "../AuthGuardModal";
import { studentValidationSchema } from "@/validations/admin/studentValidationSchema";
import { useRouter } from "next/navigation";
const validationSchema = Yup.object({
  file: Yup.mixed()
    .required("Please select a file")
    .test("fileType", "Only CSV or XLSX files are allowed", (value) => {
      if (!value) return false;

      const fileName = value.name?.toLowerCase();

      return fileName.endsWith(".csv") || fileName.endsWith(".xlsx");
    }),
});

const downloadTemplate = () => {
  const csvContent =
    "name,email,guidename,guideemail\n" +
    "xyz,xyz@example.com,xyz,xyz@example.com";

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "student-import-template.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export default function BulkImport() {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [validatedStudents, setValidatedStudents] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [authModal, setAuthModal] = useState({
    open: false,
    type: "authentication",
    message: "",
  });
  const router = useRouter();
  const handleFileParse = (file) => {
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target.result;

        const workbook = XLSX.read(data, {
          type: "array",
        });

        if (!workbook.SheetNames.length) {
          setValidatedStudents([]);
          return;
        }

        const firstSheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[firstSheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet);
        console.log("Excel rows:", rows);
        const validatedRows = studentValidationSchema(rows);

        setValidatedStudents(validatedRows);
        console.log(validatedRows);
        setStep(2);
      } catch (error) {
        console.error("Error reading file:", error);

        setValidatedStudents([]);

        toast.error("Unable to read the selected file.");
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

    const revalidatedStudents = studentValidationSchema(
      updatedStudents.map((student) => ({
        name: student.name,
        email: student.email,
        guidename: student.guidename,
        guideemail: student.guideemail,
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
          guidename: student.guidename,
          guideemail: student.guideemail,
        }));

      if (validStudents.length === 0) {
        toast.error("No valid students to import.");
        return;
      }

      setIsUploading(true);

      const BATCH_SIZE = 50;

      let totalImported = 0;
      let totalAlreadyExists = 0;
      const handleAuthError = (response, data) => {
        if (response.status === 401) {
          setAuthModal({
            open: true,
            type: "authentication",
            message:
              data.message || "Your session has expired. Please log in again.",
          });

          return true;
        }

        if (response.status === 403) {
          setAuthModal({
            open: true,
            type: "unauthorized",
            message:
              data.message || "You are not authorized to perform this action.",
          });

          return true;
        }

        return false;
      };
      for (let i = 0; i < validStudents.length; i += BATCH_SIZE) {
        const batch = validStudents.slice(i, i + BATCH_SIZE);

        const response = await fetch("/api/admin/bulkImport", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            students: batch,
          }),
        });

        const data = await response.json();
        if (handleAuthError(response, data)) {
          return;
        }
        if (!response.ok) {
          toast.error(data.message || "Failed to import students.");
          return;
        }

        totalImported += data.summary?.imported || 0;

        totalAlreadyExists += data.summary?.alreadyExists || 0;
      }

      toast.success(
        `Import successful! Imported: ${totalImported}, Already Exists: ${totalAlreadyExists}`,
      );
    } catch (error) {
      console.error("Bulk import error:", error);

      toast.error("Something went wrong while importing students.");
    } finally {
      setIsUploading(false);
    }
  };

  const invalidCount = validatedStudents.filter(
    (student) => !student.isValid,
  ).length;

  const validCount = validatedStudents.filter(
    (student) => student.isValid,
  ).length;

  return (
    <div>
      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() => {
          if (authModal.type === "unauthorized") {
            router.back();
          } else {
            setAuthModal((prev) => ({
              ...prev,
              open: false,
            }));
          }
        }}
        onLogin={() => {
          router.push("/login");
        }}
      />{" "}
      <Formik
        initialValues={{
          file: null,
        }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ setFieldValue }) => (
          <Form className="py-4">
            <div className="mx-auto w-full rounded-xl border border-slate-200 bg-white p-6">
              <ImportSteps step={step} />

              {step === 1 && (
                <UploadStep
                  setFieldValue={setFieldValue}
                  handleFileParse={handleFileParse}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  downloadTemplate={downloadTemplate}
                />
              )}

              {step === 2 && (
                <ValidationStep
                  validatedStudents={validatedStudents}
                  validCount={validCount}
                  invalidCount={invalidCount}
                  fileName={fileName}
                  handleStudentChange={handleStudentChange}
                  setStep={setStep}
                  setValidatedStudents={setValidatedStudents}
                />
              )}

              {step === 3 && (
                <PreviewStep
                  validatedStudents={validatedStudents}
                  isUploading={isUploading}
                  handleFinalUpload={handleFinalUpload}
                  setStep={setStep}
                />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
