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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `/api/projects/${params.id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch project"
          );
        }

        setProject(result.project);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/projects/${project._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete project"
        );
      }

      router.push("/student");

    } catch (error) {
      console.error("DELETE ERROR:", error);

      alert(
        error.message ||
          "Failed to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading project...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-slate-500">
          Project not found.
        </p>

        <Button
          onClick={() => router.push("/student")}
          variant="outline"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <Link href="/student">
            <Button
              variant="outline"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-xl font-semibold text-blue-950">
              Project Details
            </h1>

            <p className="text-sm text-slate-500">
              View your project information
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <Link
            href={`/student/projects/${project._id}/edit`}
          >
            <Button className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600">
              <Pencil className="h-4 w-4" />
              Update
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />

            {deleting
              ? "Deleting..."
              : "Delete"}
          </Button>

        </div>

      </div>

      {/* Project Header */}
      <Card>
        <CardContent className="p-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {project.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {project.subtitle}
              </p>
            </div>

            <Badge
              className={
                statusStyles[project.status] ||
                "bg-slate-100 text-slate-600"
              }
            >
              {project.status}
            </Badge>

          </div>

        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardContent className="p-6">

          <h3 className="mb-3 text-base font-semibold text-blue-900">
            Project Description
          </h3>

          <p className="text-sm leading-7 text-slate-600">
            {project.description ||
              "No description provided."}
          </p>

        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardContent className="p-6">

          <h3 className="mb-4 text-base font-semibold text-blue-900">
            Project Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <InfoItem
              label="Project Type"
              value={project.projectType}
              capitalize
            />

            <InfoItem
              label="Semester"
              value={project.semester}
            />

            <InfoItem
              label="Mentor"
              value={project.mentor}
            />

            <InfoItem
              label="Status"
              value={project.status}
            />

          </div>

        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardContent className="p-6">

          <h3 className="mb-4 text-base font-semibold text-blue-900">
            Technology Stack
          </h3>

          <div className="flex flex-wrap gap-2">

            {project.techStack?.length ? (
              project.techStack.map(
                (tech, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    {tech}
                  </span>
                )
              )
            ) : (
              <p className="text-sm text-slate-400">
                No technologies added.
              </p>
            )}

          </div>

        </CardContent>
      </Card>

      {/* Team */}
      {project.projectType === "team" && (
        <Card>
          <CardContent className="p-6">

            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />

              <h3 className="text-base font-semibold text-blue-900">
                Team Members
              </h3>
            </div>

            <div className="space-y-3">

              {project.teamMembers?.map(
                (member, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 p-4"
                  >

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {member.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Enrollment:{" "}
                          {member.enrollment}
                        </p>

                        {member.email && (
                          <p className="mt-1 text-xs text-slate-500">
                            {member.email}
                          </p>
                        )}
                      </div>

                      {member.role && (
                        <Badge variant="outline">
                          {member.role}
                        </Badge>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

          </CardContent>
        </Card>
      )}

      {/* Links */}
      <Card>
        <CardContent className="p-6">

          <h3 className="mb-4 text-base font-semibold text-blue-900">
            Project Links
          </h3>

          <div className="flex flex-wrap gap-3">

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  
                  GitHub
                </Button>
              </a>
            )}

            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </Button>
              </a>
            )}

          </div>

        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardContent className="p-6">

          <h3 className="mb-4 text-base font-semibold text-blue-900">
            Documents
          </h3>

          <div className="space-y-3">

            <DocumentItem
              label="Synopsis"
              file={project.synopsisFile}
            />

            <DocumentItem
              label="Report"
              file={project.reportFile}
            />

            <DocumentItem
              label="Presentation"
              file={project.presentationFile}
            />

          </div>

        </CardContent>
      </Card>

    </div>
  );
}

function InfoItem({
  label,
  value,
  capitalize = false,
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-medium text-slate-800 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "Not provided"}
      </p>
    </div>
  );
}

function DocumentItem({ label, file }) {
  if (!file) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
      <FileText className="h-5 w-5 text-orange-500" />

      <div>
        <p className="text-sm font-medium text-slate-700">
          {label}
        </p>

        <p className="text-xs text-slate-400">
          {file}
        </p>
      </div>
    </div>
  );
}