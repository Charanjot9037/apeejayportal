"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UploadCloud, X, FileText, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const STATUS_OPTIONS = ["In Progress", "Completed", "Under Review"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const emptyValues = {
  title: "",
  subtitle: "",
  description: "",
  techStack: "",
  status: "In Progress",
  githubLink: "",
  liveLink: "",
};

// Yup schema — covers every plain text field. File fields are validated
// separately below since Formik doesn't track <input type="file"> values
// well; their errors are surfaced the same way as any other field.
const ProjectSchema = Yup.object().shape({
  title: Yup.string().trim().required("Project title is required"),
  subtitle: Yup.string().trim().max(120, "Keep the subtitle under 120 characters"),
  description: Yup.string().trim().max(500, "Keep the description under 500 characters"),
  techStack: Yup.string().trim(),
  status: Yup.string()
    .oneOf(STATUS_OPTIONS, "Select a valid status")
    .required("Status is required"),
  githubLink: Yup.string().trim().url("Enter a valid URL (https://...)"),
  liveLink: Yup.string().trim().url("Enter a valid URL (https://...)"),
});

function validateFile(file) {
  if (!file) return null;
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return "Only PDF or Word documents are allowed.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File must be smaller than 10MB.";
  }
  return null;
}

function FileField({ label, file, onChange, error }) {
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </Label>

      {!file ? (
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-4 text-sm transition ${
            error
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-slate-300 bg-slate-50 text-slate-500 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          }`}
        >
          <UploadCloud className="h-4 w-4" />
          Click to upload {label.toLowerCase()}
        </label>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-orange-500" />
            <span className="truncate text-sm text-slate-700">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="shrink-0 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        id={inputId}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function AddProjectModal({ open, onOpenChange, onSubmit }) {
  const [synopsisFile, setSynopsisFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [synopsisError, setSynopsisError] = useState("");
  const [reportError, setReportError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const resetFiles = () => {
    setSynopsisFile(null);
    setReportFile(null);
    setSynopsisError("");
    setReportError("");
    setSubmitError("");
  };

  const formik = useFormik({
    initialValues: emptyValues,
    validationSchema: ProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Run the file validations alongside Formik's own field validation.
      const sError = validateFile(synopsisFile);
      const rError = validateFile(reportFile);
      setSynopsisError(sError || "");
      setReportError(rError || "");
      if (sError || rError) {
        setSubmitting(false);
        return;
      }

      setSubmitError("");
      try {
        const payload = new FormData();
        Object.entries(values).forEach(([key, value]) => payload.append(key, value));
        if (synopsisFile) payload.append("synopsis", synopsisFile);
        if (reportFile) payload.append("report", reportFile);

        // onSubmit is left to the caller so this modal stays storage-agnostic.
        await onSubmit?.(payload, { ...values, synopsisFile, reportFile });

        resetForm();
        resetFiles();
        onOpenChange(false);
      } catch (err) {
        setSubmitError(err?.message || "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const closeModal = () => {
    if (formik.isSubmitting) return;
    formik.resetForm();
    resetFiles();
    onOpenChange(false);
  };

  // Small helper so every field shows its Yup error the same way.
  const fieldError = (name) =>
    formik.touched[name] && formik.errors[name] ? formik.errors[name] : null;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : closeModal())}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-900">
            Add a New Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Project Title <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. AI Resume Screener"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={fieldError("title") ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {fieldError("title") && <p className="text-xs text-red-500">{fieldError("title")}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subtitle" className="text-sm font-medium text-slate-700">
              Subtitle
            </Label>
            <Input
              id="subtitle"
              name="subtitle"
              placeholder="e.g. Capstone Project · Final Year"
              value={formik.values.subtitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={fieldError("subtitle") ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {fieldError("subtitle") && (
              <p className="text-xs text-red-500">{fieldError("subtitle")}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Briefly describe what the project does..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={fieldError("description") ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {fieldError("description") && (
              <p className="text-xs text-red-500">{fieldError("description")}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="techStack" className="text-sm font-medium text-slate-700">
                Tech Stack
              </Label>
              <Input
                id="techStack"
                name="techStack"
                placeholder="React, Node.js, MongoDB"
                value={formik.values.techStack}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Status <span className="text-orange-500">*</span>
              </Label>
              <Select
                value={formik.values.status}
                onValueChange={(value) => formik.setFieldValue("status", value)}
              >
                <SelectTrigger
                  className={fieldError("status") ? "border-red-400 focus-visible:ring-red-300" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("status") && (
                <p className="text-xs text-red-500">{fieldError("status")}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="githubLink" className="text-sm font-medium text-slate-700">
                GitHub Link
              </Label>
              <Input
                id="githubLink"
                name="githubLink"
                placeholder="https://github.com/..."
                value={formik.values.githubLink}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={fieldError("githubLink") ? "border-red-400 focus-visible:ring-red-300" : ""}
              />
              {fieldError("githubLink") && (
                <p className="text-xs text-red-500">{fieldError("githubLink")}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="liveLink" className="text-sm font-medium text-slate-700">
                Live Demo Link
              </Label>
              <Input
                id="liveLink"
                name="liveLink"
                placeholder="https://..."
                value={formik.values.liveLink}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={fieldError("liveLink") ? "border-red-400 focus-visible:ring-red-300" : ""}
              />
              {fieldError("liveLink") && (
                <p className="text-xs text-red-500">{fieldError("liveLink")}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FileField
              label="Synopsis File"
              file={synopsisFile}
              onChange={(f) => {
                setSynopsisFile(f);
                setSynopsisError(validateFile(f) || "");
              }}
              error={synopsisError}
            />
            <FileField
              label="Report File"
              file={reportFile}
              onChange={(f) => {
                setReportFile(f);
                setReportError(validateFile(f) || "");
              }}
              error={reportError}
            />
          </div>

          {submitError && <p className="text-sm text-red-500">{submitError}</p>}

          <DialogFooter className="mt-2 gap-2">
            <Button type="button" variant="outline" onClick={closeModal} disabled={formik.isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-600"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}