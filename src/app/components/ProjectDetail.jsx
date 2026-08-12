"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Pencil,
  Trash2,
  ExternalLink,
  Users,
  FileText,
  Eye,
  Download,
  Code2,
  CalendarDays,
  UserRound,
  Image as ImageIcon,
 
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles = {
  "Pending Approval":
    "bg-yellow-100 text-yellow-700",

  Approved:
    "bg-green-100 text-green-700",

  Rejected:
    "bg-red-100 text-red-700",

  Draft:
    "bg-slate-100 text-slate-600",
};

/* =========================================================
   PROJECT DETAIL
========================================================= */

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);

  /* =======================================================
     FETCH PROJECT
  ======================================================= */

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `/api/projects/${params.id}`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch project"
          );
        }

        setProject(result.project);
      } catch (error) {
        console.error(
          "PROJECT_FETCH_ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  /* =======================================================
     DELETE PROJECT
  ======================================================= */

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${project.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/projects/${project._id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete project"
        );
      }

      alert(
        "Project deleted successfully."
      );

      router.push("/student");
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading project...
        </p>
      </div>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!project) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-slate-500">
          Project not found.
        </p>

        <Button
          onClick={() =>
            router.push("/student")
          }
          variant="outline"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-full bg-[#f8f7f4] px-4 py-5 md:px-6 lg:px-8">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

        <div>
          {/* Semester */}
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
            {project.semester ||
              "Academic Project"}
          </p>

          {/* Project Title */}
          <h1 className="text-xl font-semibold tracking-tight text-blue-900 md:text-2xl">
            {project.title}
          </h1>

          {/* Status + project type */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2">

            <Badge
              className={`rounded-full px-2.5 py-0.5 text-[10px] ${
                statusStyles[
                  project.status
                ] ||
                "bg-slate-100 text-slate-600"
              }`}
            >
              <span className="mr-1">
                ●
              </span>

              {project.status}
            </Badge>

            <span className="text-[9px] text-slate-400">
              {project.projectType ===
              "team"
                ? `Team Project • ${
                    project.teamMembers
                      ?.length || 0
                  } Members`
                : "Individual Project"}
            </span>
          </div>
        </div>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="flex items-center gap-2">

          <Link
            href={`/student/projects/${project._id}/edit`}
          >
            <Button
              className="h-9 bg-orange-500 px-4 text-xs text-white hover:bg-orange-600"
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Update Details
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="h-9 border-red-200 px-4 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />

            {deleting
              ? "Deleting..."
              : "Delete"}
          </Button>
        </div>
      </div>

      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="space-y-4">

          {/* =================================================
              OVERVIEW
          ================================================= */}

          <DetailCard
            title="Overview"
            icon={<FileText />}
          >
            <div className="space-y-4">

              <p className="text-xs leading-6 text-slate-600 md:text-[13px]">
                {project.description ||
                  "No description provided."}
              </p>

              {/* Project links */}
              {(project.githubLink ||
                project.liveLink) && (
                <div className="flex flex-wrap gap-2 pt-1">

                  {project.githubLink && (
                    <a
                      href={
                        project.githubLink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="h-8 text-xs"
                      >
                        
                        GitHub
                      </Button>
                    </a>
                  )}

                  {project.liveLink && (
                    <a
                      href={
                        project.liveLink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="h-8 text-xs"
                      >
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        Live Demo
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </div>
          </DetailCard>

          {/* =================================================
              TECHNOLOGIES
          ================================================= */}

          <DetailCard
            title="Technologies Used"
            icon={<Code2 />}
          >
            {project.techStack?.length ? (
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(
                  (tech, index) => (
                    <span
                      key={index}
                      className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-700"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No technologies added.
              </p>
            )}
          </DetailCard>

          {/* =================================================
              PROJECT GALLERY
          ================================================= */}

          <DetailCard
            title="Project Gallery"
            icon={<ImageIcon />}
          >
            {project.projectImages?.length ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                {project.projectImages.map(
                  (image, index) => (
                    <div
                      key={
                        image.publicId ||
                        index
                      }
                      className="overflow-hidden rounded border border-slate-200 bg-white"
                    >
                      <div className="group relative aspect-video overflow-hidden bg-slate-100">

                        <img
                          src={image.url}
                          alt={
                            image.originalName ||
                            `Project image ${
                              index + 1
                            }`
                          }
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* View button */}
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2 top-2 rounded-md bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      <div className="px-2.5 py-2">
                        <p className="truncate text-[10px] font-medium text-slate-700">
                          {image.originalName ||
                            `Project Image ${
                              index + 1
                            }`}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex min-h-[130px] items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-2 h-6 w-6 text-slate-300" />

                  <p className="text-xs text-slate-400">
                    No project images uploaded.
                  </p>
                </div>
              </div>
            )}
          </DetailCard>

          {/* =================================================
              DOCUMENTS
          ================================================= */}

          <DetailCard
            title="Documents & Deliverables"
            icon={<FileText />}
          >
            <div className="space-y-2">

              <DocumentItem
                label="Project Synopsis"
                file={
                  project.synopsisFile
                }
              />

              <DocumentItem
                label="Project Report"
                file={
                  project.reportFile
                }
              />

              <DocumentItem
                label="Final Presentation"
                file={
                  project.presentationFile
                }
              />

              {!project.synopsisFile &&
                !project.reportFile &&
                !project.presentationFile && (
                  <div className="rounded border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <FileText className="mx-auto mb-2 h-6 w-6 text-slate-300" />

                    <p className="text-xs text-slate-400">
                      No documents uploaded.
                    </p>
                  </div>
                )}
            </div>
          </DetailCard>
        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="space-y-4">

          {/* =================================================
              TEAM MEMBERS
          ================================================= */}

          {project.projectType ===
            "team" && (
            <SideCard title="Team Members">

              <div className="space-y-3">

                {project.teamMembers
                  ?.length ? (
                  project.teamMembers.map(
                    (
                      member,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5"
                      >
                        {/* Avatar */}
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                          <UserRound className="h-3.5 w-3.5 text-slate-500" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-medium text-slate-800">
                            {member.name}
                          </p>

                          <p className="truncate text-[8px] text-slate-400">
                            {member.role ||
                              "Team Member"}
                          </p>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-xs text-slate-400">
                    No team members.
                  </p>
                )}
              </div>
            </SideCard>
          )}

          {/* =================================================
              MENTOR
          ================================================= */}

          <SideCard title="Assigned Mentor">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
                <UserRound className="h-4 w-4 text-orange-500" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-800">
                  {project.mentor ||
                    "Not assigned"}
                </p>

                <p className="mt-0.5 text-[8px] text-slate-400">
                  Project Mentor
                </p>
              </div>
            </div>

            {project.mentor && (
              <Button
                className="mt-4 h-8 w-full bg-orange-500 text-[10px] text-white hover:bg-orange-600"
                onClick={() =>
                  alert(
                    "Mentor contact functionality can be added here."
                  )
                }
              >
                Contact Mentor
              </Button>
            )}
          </SideCard>

          {/* =================================================
              PROJECT INFORMATION
          ================================================= */}

          <SideCard title="Project Information">

            <div className="space-y-3">

              <SmallInfo
                icon={
                  <Code2 className="h-3.5 w-3.5" />
                }
                label="Project Type"
                value={
                  project.projectType ===
                  "team"
                    ? "Team Project"
                    : "Individual Project"
                }
              />

              <SmallInfo
                icon={
                  <CalendarDays className="h-3.5 w-3.5" />
                }
                label="Semester"
                value={
                  project.semester ||
                  "Not provided"
                }
              />

              <SmallInfo
                icon={
                  <FileText className="h-3.5 w-3.5" />
                }
                label="Status"
                value={
                  project.status ||
                  "Not provided"
                }
              />

              <SmallInfo
                icon={
                  <CalendarDays className="h-3.5 w-3.5" />
                }
                label="Created"
                value={
                  project.createdAt
                    ? formatDate(
                        project.createdAt
                      )
                    : "Not available"
                }
              />
            </div>
          </SideCard>

          {/* =================================================
              APPROVAL HISTORY
          ================================================= */}

          <SideCard title="Approval History">

            <div className="relative ml-1 border-l border-slate-200 pl-4">

              <div className="relative pb-4">

                <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-blue-600" />

                <p className="text-[9px] font-medium text-slate-700">
                  Project Submitted
                </p>

                <p className="mt-0.5 text-[8px] text-slate-400">
                  {project.createdAt
                    ? formatDate(
                        project.createdAt
                      )
                    : "Date unavailable"}
                </p>
              </div>

              {project.status ===
                "Approved" && (
                <div className="relative">

                  <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-green-500" />

                  <p className="text-[9px] font-medium text-slate-700">
                    Project Approved
                  </p>

                  <p className="mt-0.5 text-[8px] text-slate-400">
                    Current Status
                  </p>
                </div>
              )}

              {project.status ===
                "Rejected" && (
                <div className="relative">

                  <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-red-500" />

                  <p className="text-[9px] font-medium text-slate-700">
                    Project Rejected
                  </p>

                  <p className="mt-0.5 text-[8px] text-slate-400">
                    Current Status
                  </p>
                </div>
              )}

              {project.status ===
                "Pending Approval" && (
                <div className="relative">

                  <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-yellow-500" />

                  <p className="text-[9px] font-medium text-slate-700">
                    Awaiting Approval
                  </p>

                  <p className="mt-0.5 text-[8px] text-slate-400">
                    Placement Cell
                  </p>
                </div>
              )}
            </div>
          </SideCard>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL CARD
========================================================= */

function DetailCard({
  title,
  icon,
  children,
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4 md:p-5">

        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">

          <div className="h-4 w-0.5 bg-orange-500" />

          <div className="text-blue-700">
            {icon}
          </div>

          <h2 className="text-sm font-semibold text-blue-900">
            {title}
          </h2>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}

/* =========================================================
   SIDE CARD
========================================================= */

function SideCard({
  title,
  children,
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-3">

        <h3 className="mb-3 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-wide text-blue-800">
          {title}
        </h3>

        {children}
      </CardContent>
    </Card>
  );
}

/* =========================================================
   SMALL INFORMATION ITEM
========================================================= */

function SmallInfo({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-2">

      <div className="mt-0.5 text-orange-500">
        {icon}
      </div>

      <div>
        <p className="text-[8px] uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-[10px] font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DOCUMENT ITEM
========================================================= */

function DocumentItem({
  label,
  file,
}) {
  if (!file) {
    return null;
  }

  const fileUrl =
    typeof file === "string"
      ? file
      : file?.url;

  const fileName =
    typeof file === "string"
      ? label
      : file?.originalName || label;

  if (!fileUrl) {
    return null;
  }

  /*
   * Cloudinary download URL
   *
   * Adds fl_attachment so Cloudinary sends
   * the file with the original filename.
   */
  const downloadUrl =
    fileUrl.includes("/upload/")
      ? fileUrl.replace(
          "/upload/",
          `/upload/fl_attachment:${encodeURIComponent(
            fileName
          )}/`
        )
      : fileUrl;
console.log("download ural",downloadUrl)
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-white p-3">

      {/* FILE INFO */}

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-orange-50">
          <FileText className="h-4 w-4 text-orange-500" />
        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-medium text-slate-700">
            {label}
          </p>

          <p className="max-w-[220px] truncate text-[8px] text-slate-400">
            {fileName}
          </p>

        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex shrink-0 items-center gap-1">

        {/* VIEW */}

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View"
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
        >
          <Eye className="h-3.5 w-3.5" />
        </a>

        {/* DOWNLOAD */}

        <a
          href={fileUrl}
          download
          title={`Download ${fileName}`}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-orange-600"
        >
          <Download className="h-3.5 w-3.5" />
        </a>

      </div>
    </div>
  );
}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {
  if (!date) {
    return "Not available";
  }

  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "Not available";
  }
}

/* =========================================================
   ICON HELPER
========================================================= */

