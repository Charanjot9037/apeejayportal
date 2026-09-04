"use client";

import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function getAcademicYear(student) {
  const startYear = student?.academicBatch;
  const endYear = student?.lastYear;

  if (startYear && endYear) {
    return `${startYear} – ${endYear}`;
  }

  if (startYear) {
    return String(startYear);
  }

  if (endYear) {
    return String(endYear);
  }

  return null;
}

function getValidImageUrl(value) {
  if (typeof value !== "string") {
    return null;
  }

  const url = value.trim();

  if (!url) {
    return null;
  }

  if (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return null;
}

function getProjectImage(project) {
  if (!Array.isArray(project?.projectImages)) {
    return null;
  }

  const firstImage = project.projectImages[0];

  if (typeof firstImage === "string") {
    return getValidImageUrl(firstImage);
  }

  if (firstImage && typeof firstImage === "object") {
    return getValidImageUrl(firstImage.url);
  }

  return null;
}

function getSafeExternalLink(value) {
  if (typeof value !== "string") {
    return "";
  }

  const url = value.trim();

  if (!url) {
    return "";
  }

  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }

  return `https://${url}`;
}

function SectionTitle({ symbol, children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 from-blue-50 to-blue-100/70 text-sm font-bold text-[#07518a] shadow-sm">
        {symbol}
      </div>

      <CardTitle className="text-[15px] font-bold tracking-tight text-slate-800">
        {children}
      </CardTitle>
    </div>
  );
}

function SkillGroup({ title, skills }) {
  const validSkills = Array.isArray(skills)
    ? skills.filter(
        (skill) =>
          skill !== null &&
          skill !== undefined &&
          typeof skill !== "object" &&
          String(skill).trim() !== "",
      )
    : [];

  if (validSkills.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[1.4px] text-slate-400">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {validSkills.map((skill, index) => (
          <Badge
            key={`${String(skill)}-${index}`}
            variant="outline"
            className="rounded-lg border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50 px-3 py-1.5 text-[11px] font-semibold text-[#07518a] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            {String(skill).trim()}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function SocialLink({ symbol, name, href }) {
  const formattedHref = getSafeExternalLink(href);

  if (!formattedHref) {
    return null;
  }

  return (
    <a
      href={formattedHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/60 hover:shadow-sm"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white text-[10px] font-bold text-[#07518a] shadow-sm">
        {symbol}
      </div>

      <span className="ml-3 flex-1 text-[12px] font-semibold text-slate-600 transition-colors group-hover:text-[#07518a]">
        {name}
      </span>

      <span className="text-sm text-slate-300 transition group-hover:text-[#f97316]">
        ↗
      </span>
    </a>
  );
}

function ProjectStatus({ status }) {
  if (status === "Approved") {
    return (
      <Badge className="gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[9px] font-bold text-emerald-700 shadow-sm hover:bg-emerald-50">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Approved
      </Badge>
    );
  }

  if (status === "Rejected") {
    return (
      <Badge className="gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[9px] font-bold text-red-600 shadow-sm hover:bg-red-50">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Rejected
      </Badge>
    );
  }

  return (
    <Badge className="gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-[9px] font-bold text-orange-600 shadow-sm hover:bg-orange-50">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
      {status || "Pending Approval"}
    </Badge>
  );
}

function ProjectCard({ project }) {
  const image = getProjectImage(project);

  const githubLink = getSafeExternalLink(project?.githubLink);

  const deployedLink = getSafeExternalLink(project?.deployedLink);

  const validTechStack = Array.isArray(project?.techStack)
    ? project.techStack.filter(
        (tech) =>
          tech !== null &&
          tech !== undefined &&
          typeof tech !== "object" &&
          String(tech).trim() !== "",
      )
    : [];

  return (
    <Card className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_5px_18px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_14px_32px_rgba(249,115,22,0.12)]">
      <div className="relative h-[190px] overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={project?.title || "Project"}
            fill
            sizes="(max-width: 1280px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-white text-lg font-bold text-[#07518a] shadow-sm">
              &lt;/&gt;
            </div>

            <span className="mt-2 text-xs font-medium text-slate-400">
              No project image
            </span>
          </div>
        )}

        {image && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        )}

        <div className="absolute left-4 top-4">
          {project?.status === "Approved" && (
            <Badge className="border-0 bg-emerald-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-md hover:bg-emerald-500">
              ✓ Approved
            </Badge>
          )}

          {project?.status === "Rejected" && (
            <Badge className="border-0 bg-red-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-md hover:bg-red-500">
              Rejected
            </Badge>
          )}

          {!["Approved", "Rejected"].includes(project?.status) && (
            <Badge className="border-0 bg-orange-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-md hover:bg-orange-500">
              Pending
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-bold text-slate-800 transition-colors group-hover:text-[#07518a]">
              {project?.title || "Untitled Project"}
            </h3>

            {project?.subtitle && (
              <p className="mt-1 text-[11px] font-semibold text-orange-500">
                {project.subtitle}
              </p>
            )}
          </div>

          {project?.semester && (
            <Badge
              variant="secondary"
              className="shrink-0 rounded-lg border border-slate-100 bg-slate-100 px-2.5 py-1.5 text-[9px] font-semibold text-slate-500"
            >
              Sem {project.semester}
            </Badge>
          )}
        </div>

        <p className="mt-3 min-h-[54px] line-clamp-3 text-[12px] leading-[1.7] text-slate-500">
          {project?.description || "No project description available."}
        </p>

        {validTechStack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {validTechStack.slice(0, 5).map((tech, index) => (
              <Badge
                key={`${String(tech)}-${index}`}
                variant="secondary"
                className="rounded-md border border-slate-100 bg-slate-100 px-2.5 py-1 text-[9px] font-medium text-slate-600 transition-colors hover:border-orange-100 hover:bg-orange-50 hover:text-orange-600"
              >
                {String(tech).trim()}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="my-5 bg-slate-100" />

        <div className="flex items-center">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Project Type
            </p>

            <p className="mt-1 text-[10px] font-semibold text-slate-600">
              {project?.projectType || "Individual"}
            </p>
          </div>

          {(githubLink || deployedLink) && (
            <div className="ml-auto flex items-center gap-2">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 transition-all hover:border-[#07518a] hover:bg-blue-50 hover:text-[#07518a]"
                >
                  GitHub
                </a>
              )}

              {deployedLink && (
                <a
                  href={deployedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-[#07518a] px-3 text-[10px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#063f6b] hover:shadow-md"
                >
                  Live Demo →
                </a>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectOverviewRow({ project }) {
  return (
    <div className="group rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50/40 via-white to-white px-4 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_5px_18px_rgba(249,115,22,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-slate-700 transition-colors group-hover:text-[#07518a]">
            {project?.title || "Untitled Project"}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {project?.projectType || "Individual"}
            {project?.semester ? ` • Semester ${project.semester}` : ""}
          </p>
        </div>

        <ProjectStatus status={project?.status} />
      </div>
    </div>
  );
}

function AcademicDetail({ label, value }) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-[9px] font-semibold uppercase tracking-[0.8px] text-slate-400">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-[11px] font-semibold text-slate-700">
        {String(value)}
      </span>
    </div>
  );
}

export default function StudentData({ student, projects = [] }) {
  if (!student) {
    return null;
  }

  const profileImage = getValidImageUrl(student?.profileImage);

  const skills = Array.isArray(student.skills)
    ? student.skills.filter(
        (skill) =>
          skill !== null &&
          skill !== undefined &&
          typeof skill !== "object" &&
          String(skill).trim() !== "",
      )
    : [];

  const interests = Array.isArray(student.interests)
    ? student.interests.filter(
        (interest) =>
          interest !== null &&
          interest !== undefined &&
          typeof interest !== "object" &&
          String(interest).trim() !== "",
      )
    : [];

  const academicYear = getAcademicYear(student);

  const email = typeof student.email === "string" ? student.email.trim() : "";

  const resume = getSafeExternalLink(student.resume);

  const github = getSafeExternalLink(student.github);

  const linkedin = getSafeExternalLink(student.linkedin);

  const portfolio = getSafeExternalLink(student.portfolio);

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-100">
      <Card className="relativeoverflow-hidden rounded-2xl mx-auto max-w-7xl border border-blue-800">
        <div className="pointer-events-none absolute -bottom-24 left-[35%] h-48 w-48 rounded-full bg-orange-50/70 blur-3xl" />

        <CardContent className="relative border mx-auto w-full px-5 py-5 sm:px-6 lg:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="relative mx-auto shrink-0 lg:mx-0">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                <div className="absolute -inset-2 rounded-full bg-orange-100/80 blur-[1px]" />

                <div className="relative h-full w-full  overflow-hidden rounded-full border-1 border-slate-100 ">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={student.fullName || "Student"}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                      {student.fullName?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                  )}
                </div>

                <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 shadow-md">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-[28px]">
                {student.fullName || "Student"}
              </h1>

              {student.program && (
                <p className="mt-1 text-[12px] font-bold text-[#07518a]">
                  {student.program}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px] text-slate-500 lg:justify-start">
                {student.department && (
                  <span className="font-semibold text-slate-600">
                    {student.department}
                  </span>
                )}

                {academicYear && (
                  <>
                    <span className="text-orange-300">•</span>

                    <span>
                      Academic Year{" "}
                      <span className="font-semibold text-slate-700">
                        {academicYear}
                      </span>
                    </span>
                  </>
                )}

                {student.rollNumber && (
                  <>
                    <span className="text-orange-300">•</span>

                    <span>
                      Roll No.{" "}
                      <span className="font-semibold text-slate-700">
                        {student.rollNumber}
                      </span>
                    </span>
                  </>
                )}
              </div>

              {(email || resume) && (
                <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#07518a] px-3.5 text-[10px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#063f6b] hover:shadow-md"
                    >
                      <span>✉</span>
                      Contact Student
                    </a>
                  )}

                  {resume && (
                    <a
                      href={resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3.5 text-[10px] font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f97316] hover:bg-orange-50 hover:text-[#07518a]"
                    >
                      <span>↓</span>
                      View Resume
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="grid w-full shrink-0 grid-cols-2 gap-2.5 sm:w-[190px]">
              <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white px-3 py-3.5 text-center shadow-sm">
                <p className="text-xl font-bold text-[#f97316]">
                  {Array.isArray(projects) ? projects.length : 0}
                </p>

                <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[1px] text-slate-400">
                  Projects
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white px-3 py-3.5 text-center shadow-sm">
                <p className="text-xl font-bold text-[#07518a]">
                  {skills.length}
                </p>

                <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[1px] text-slate-400">
                  Skills
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <main className="mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-9">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <Card className="rounded-2xl border border-orange-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_10px_28px_rgba(249,115,22,0.09)]">
              <CardHeader className="rounded-t-2xl bg-gradient-to-r from-orange-50/70 via-white to-white p-5 pb-4">
                <SectionTitle symbol="i">About</SectionTitle>
              </CardHeader>

              <CardContent className="p-5 pt-4">
                <p className="text-[12px] leading-[1.8] text-slate-500">
                  {interests.length > 0
                    ? `Interested in ${interests.join(", ")}.`
                    : "No additional information has been provided by the student."}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-orange-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_10px_28px_rgba(249,115,22,0.09)]">
              <CardHeader className="rounded-t-2xl bg-gradient-to-r from-orange-50/70 via-white to-white p-5 pb-4">
                <SectionTitle symbol="<>">Skills &amp; Expertise</SectionTitle>
              </CardHeader>

              <CardContent className="space-y-6 p-5">
                <SkillGroup title="Technical Skills" skills={skills} />

                <SkillGroup title="Interests" skills={interests} />

                {skills.length === 0 && interests.length === 0 && (
                  <p className="text-xs text-slate-400">No skills added yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-orange-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_10px_28px_rgba(249,115,22,0.09)]">
              <CardHeader className="rounded-t-2xl bg-gradient-to-r from-orange-50/70 via-white to-white p-5 pb-4">
                <SectionTitle symbol="A">Academic Information</SectionTitle>
              </CardHeader>

              <CardContent className="p-5 pt-3">
                <AcademicDetail label="Program" value={student.program} />

                <AcademicDetail label="Department" value={student.department} />

                <AcademicDetail
                  label="Starting Year"
                  value={student.academicBatch}
                />

                <AcademicDetail label="Ending Year" value={student.lastYear} />

                <AcademicDetail label="Academic Year" value={academicYear} />

                <AcademicDetail
                  label="Roll Number"
                  value={student.rollNumber}
                />

                <AcademicDetail
                  label="Specialization"
                  value={student.specialization}
                />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-orange-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_10px_28px_rgba(249,115,22,0.09)]">
              <CardHeader className="rounded-t-2xl bg-gradient-to-r from-orange-50/70 via-white to-white p-5 pb-4">
                <SectionTitle symbol="↗">Online Presence</SectionTitle>
              </CardHeader>

              <CardContent className="space-y-2.5 p-5">
                <SocialLink symbol="GH" name="GitHub" href={github} />

                <SocialLink symbol="in" name="LinkedIn" href={linkedin} />

                <SocialLink
                  symbol="WWW"
                  name="Personal Portfolio"
                  href={portfolio}
                />

                {!github && !linkedin && !portfolio && (
                  <p className="text-xs text-slate-400">
                    No online profiles added.
                  </p>
                )}
              </CardContent>
            </Card>
          </aside>

          <section className="min-w-0">
            {Array.isArray(projects) && projects.length > 0 && (
              <Card className="mb-7 rounded-2xl border border-orange-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.045)] transition-all duration-300 hover:border-orange-300 hover:shadow-[0_10px_28px_rgba(249,115,22,0.09)]">
                <CardHeader className="rounded-t-2xl bg-gradient-to-r from-orange-50/70 via-white to-white p-5 pb-4">
                  <SectionTitle symbol="✓">Project Overview</SectionTitle>
                </CardHeader>

                <CardContent className="space-y-3 p-5">
                  {projects.map((project, index) => (
                    <ProjectOverviewRow
                      key={project?._id || `project-overview-${index}`}
                      project={project}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-orange-300 hover:shadow-[0_12px_32px_rgba(249,115,22,0.09)]">
              <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-orange-100 bg-gradient-to-r from-orange-50/70 via-white to-white px-6 py-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.45)]" />

                    <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-orange-500">
                      Student Work
                    </p>
                  </div>

                  <CardTitle className="mt-1.5 text-[23px] font-bold tracking-tight text-slate-800">
                    Project Portfolio
                  </CardTitle>

                  <p className="mt-1 text-[11px] text-slate-400">
                    A collection of projects and academic work
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="shrink-0 rounded-xl border-orange-200 bg-orange-50/60 px-4 py-2.5 text-center shadow-sm"
                >
                  <span className="text-[15px] font-bold text-[#07518a]">
                    {Array.isArray(projects) ? projects.length : 0}
                  </span>

                  <span className="ml-1 text-[8px] font-bold uppercase tracking-[1px] text-slate-400">
                    {projects.length === 1 ? "Project" : "Projects"}
                  </span>
                </Badge>
              </CardHeader>

              <CardContent className="p-5 sm:p-6">
                {Array.isArray(projects) && projects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {projects.map((project, index) => (
                      <ProjectCard
                        key={project?._id || `portfolio-${index}`}
                        project={project}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 px-6 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-xl font-bold text-[#07518a] shadow-sm">
                      &lt;/&gt;
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      No projects available
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      This student has not added any projects yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
