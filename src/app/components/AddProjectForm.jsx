"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Link as LinkIcon, Code2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddProjectForm({ mode = "create", project = null }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [projectType, setProjectType] = useState("individual");

  const [techStack, setTechStack] = useState(["React", "Node.js", "MongoDB"]);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    githubLink: "",
    liveDemoLink: "",
    semester: "",
    mentor: "",
  });

  useEffect(() => {
    if (!project || !isEdit) return;

    setFormData({
      projectName: project.title || "",
      description: project.description || "",
      githubLink: project.githubLink || "",
      liveDemoLink: project.liveLink || "",
      semester: project.semester || "",
      mentor: project.mentor || "",
    });

    setProjectType(project.projectType || "individual");

    setTechStack(project.techStack || []);

    setTeamMembers(
      project.teamMembers?.length
        ? project.teamMembers
        : [
            {
              name: "",
              enrollment: "",
              email: "",
              role: "",
            },
          ],
    );
  }, [project, isEdit]);

  const [presentationFile, setPresentationFile] = useState(null);
  const [synopsisFile, setSynopsisFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([
    {
      name: "",
      enrollment: "",
      email: "",
      role: "",
    },
  ]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const projectData = {
        projectName: formData.projectName,

        description: formData.description,

        techStack,

        githubLink: formData.githubLink,

        liveDemoLink: formData.liveDemoLink,

        projectType,

        teamMembers: projectType === "team" ? teamMembers : [],

        semester: formData.semester,

        mentor: formData.mentor,
      };

      const url = isEdit ? `/api/projects/${project._id}` : "/api/projects";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(projectData),
      });

      const result = await response.json();
         if (response.status === 401) {//need to be 
        alert("no authenticated");
      router.push("/login");
        return;
      }
      if (!response.ok) {
        throw new Error(result.message || "Failed to save project");
      }

      alert(
        isEdit
          ? "Project updated successfully."
          : "Project submitted for approval successfully.",
      );

      if (isEdit) {
        router.push(`/student/projects/${project._id}`);
      } else {
        router.push("/student");
      }
    } catch (error) {
      console.error("PROJECT SAVE ERROR:", error);

      alert(error.message || "Something went wrong.");
    }
  };

  const addTechnology = () => {
    const technology = window.prompt("Enter technology");

    if (
      technology &&
      technology.trim() &&
      !techStack.includes(technology.trim())
    ) {
      setTechStack((prev) => [...prev, technology.trim()]);
    }
  };

  const removeTechnology = (technology) => {
    setTechStack((prev) => prev.filter((item) => item !== technology));
  };

  const addTeamMember = () => {
    setTeamMembers((prev) => [
      ...prev,
      {
        name: "",
        enrollment: "",
        email: "",
        role: "",
      },
    ]);
  };

  const removeTeamMember = (index) => {
    setTeamMembers((prev) =>
      prev.filter((_, memberIndex) => memberIndex !== index),
    );
  };

  const updateTeamMember = (index, field, value) => {
    setTeamMembers((prev) =>
      prev.map((member, memberIndex) =>
        memberIndex === index
          ? {
              ...member,
              [field]: value,
            }
          : member,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/student"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-blue-900">Add Project</h1>

          <p className="mt-1 text-sm text-slate-500">
            Submit your project details for academic review or portfolio
            showcase..
          </p>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-slate-300 bg-white p-5 shadow-sm"
        >
          {/* ================= BASIC INFORMATION ================= */}

          <section>
            <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
              <span className="border-b-2 border-orange-500 pb-2">
                Basic Information
              </span>
            </h2>

            <div className="mt-4 space-y-4">
              {/* Project Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Project Name <span className="text-orange-500">*</span>
                </label>

                <Input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  required
                  className="h-10 bg-slate-50 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Description <span className="text-orange-500">*</span>
                </label>

                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed overview of your project, its objectives, and outcomes."
                  required
                  className="min-h-[100px] resize-none bg-slate-50 text-sm"
                />
              </div>
            </div>
          </section>

          {/* ================= TECHNICAL DETAILS ================= */}

          <section className="mt-6">
            <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
              <span className="border-b-2 border-orange-500 pb-2">
                Technical Details
              </span>
            </h2>

            {/* Tech Stack */}
            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-slate-700">
                Tech Stack
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs text-slate-600"
                  >
                    {tech}

                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-1 text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={addTechnology}
                  className="text-xs text-slate-400 hover:text-orange-500"
                >
                  + Add tech...
                </button>
              </div>
            </div>

            {/* GitHub / Live Demo */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* GitHub */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  GitHub Link
                </label>

                <div className="relative">
                  <Code2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="h-10 bg-slate-50 pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Live Demo */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Live Demo Link
                </label>

                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    name="liveDemoLink"
                    value={formData.liveDemoLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="h-10 bg-slate-50 pl-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================= COLLABORATION ================= */}

          <section className="mt-6">
            <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
              <span className="border-b-2 border-orange-500 pb-2">
                Collaboration
              </span>
            </h2>

            {/* Project Type */}
            {/* Project Type */}
            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-slate-700">
                Project Type
              </label>

              <div className="flex gap-5">
                {/* Individual */}
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="radio"
                    name="projectType"
                    value="individual"
                    checked={projectType === "individual"}
                    onChange={() => setProjectType("individual")}
                    className="accent-orange-500"
                  />
                  Individual
                </label>

                {/* Team */}
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="radio"
                    name="projectType"
                    value="team"
                    checked={projectType === "team"}
                    onChange={() => setProjectType("team")}
                    className="accent-orange-500"
                  />
                  Team
                </label>
              </div>
            </div>

            {/* ================= TEAM MEMBERS ================= */}

            {projectType === "team" && (
              <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">
                      Team Members
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Add the students who are working on this project.
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {teamMembers.length}{" "}
                    {teamMembers.length === 1 ? "Member" : "Members"}
                  </span>
                </div>

                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="rounded-md border border-slate-200 bg-white p-4"
                    >
                      {/* Member Header */}
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-700">
                          Team Member {index + 1}
                        </h4>

                        {teamMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Name + Enrollment */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Name */}
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            Member Name{" "}
                            <span className="text-orange-500">*</span>
                          </label>

                          <Input
                            value={member.name}
                            onChange={(e) =>
                              updateTeamMember(index, "name", e.target.value)
                            }
                            placeholder="Enter member name"
                            required={projectType === "team"}
                            className="h-10 bg-white text-sm"
                          />
                        </div>

                        {/* Enrollment */}
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            Enrollment / Student ID{" "}
                            <span className="text-orange-500">*</span>
                          </label>

                          <Input
                            value={member.enrollment}
                            onChange={(e) =>
                              updateTeamMember(
                                index,
                                "enrollment",
                                e.target.value,
                              )
                            }
                            placeholder="Enter enrollment number"
                            required={projectType === "team"}
                            className="h-10 bg-white text-sm"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            Email
                          </label>

                          <Input
                            type="email"
                            value={member.email}
                            onChange={(e) =>
                              updateTeamMember(index, "email", e.target.value)
                            }
                            placeholder="member@example.com"
                            className="h-10 bg-white text-sm"
                          />
                        </div>

                        {/* Role */}
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            Role / Contribution
                          </label>

                          <Input
                            value={member.role}
                            onChange={(e) =>
                              updateTeamMember(index, "role", e.target.value)
                            }
                            placeholder="e.g. Frontend Developer"
                            className="h-10 bg-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Member */}
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                  <span className="text-lg leading-none">+</span>
                  Add Team Member
                </button>
              </div>
            )}

            {/* Semester / Mentor */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Semester */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Semester <span className="text-orange-500">*</span>
                </label>

                <Select
                  value={formData.semester}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      semester: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-10 bg-slate-50 text-sm">
                    <SelectValue placeholder="Select semester..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                    <SelectItem value="8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mentor */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Assigned Mentor{" "}
                  <span className="text-slate-400">(Optional)</span>
                </label>

                <Select
                  value={formData.mentor}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      mentor: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-10 bg-slate-50 text-sm">
                    <SelectValue placeholder="Select a faculty mentor..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="mentor1">
                      Dr. Faculty Mentor 1
                    </SelectItem>

                    <SelectItem value="mentor2">
                      Dr. Faculty Mentor 2
                    </SelectItem>

                    <SelectItem value="mentor3">
                      Prof. Faculty Mentor 3
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* ================= MEDIA ================= */}

          <section className="mt-6">
            <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
              <span className="border-b-2 border-orange-500 pb-2">
                Media & Documents
              </span>
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <FileUpload
                title="PPT Presentation"
                description="PPTX up to 10MB"
                file={presentationFile}
                setFile={setPresentationFile}
                accept=".ppt,.pptx"
              />

              <FileUpload
                title="Project Synopsis"
                description="PDF up to 5MB"
                file={synopsisFile}
                setFile={setSynopsisFile}
                accept=".pdf"
              />

              <FileUpload
                title="Final Project Report"
                description="PDF up to 20MB"
                file={reportFile}
                setFile={setReportFile}
                accept=".pdf"
              />
            </div>
          </section>

          {/* ================= BUTTONS ================= */}

          <div className="mt-7 flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Link href="/dashboard">
              <Button
                type="button"
                variant="outline"
                className="border-slate-400"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
              onClick={() => {
                console.log("Save draft");
              }}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {isEdit ? "Save Changes" : "Send for Approval"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   FILE UPLOAD
========================================================= */

function FileUpload({ title, description, file, setFile, accept }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-orange-400 hover:bg-orange-50">
      <Upload className="mb-2 h-4 w-4 text-orange-500" />

      <span className="text-xs font-medium text-slate-700">
        {file ? file.name : title}
      </span>

      <span className="mt-1 text-[10px] text-slate-400">
        {file ? "Click to replace" : description}
      </span>

      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
        }}
      />
    </label>
  );
}
