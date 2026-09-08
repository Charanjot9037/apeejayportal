"use client";

/* =========================================================
   SECTION CARD
   ========================================================= */

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   SECTION TITLE
   ========================================================= */

function SectionTitle({ symbol, children }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-50 text-[14px] font-bold text-orange-500">
        {symbol}
      </div>

      <h2 className="text-[16px] font-bold tracking-tight text-[#07518a]">
        {children}
      </h2>
    </div>
  );
}

/* =========================================================
   SKILL GROUP
   ========================================================= */

function SkillGroup({ title, skills }) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-2 text-[14px] font-bold uppercase tracking-[1.2px] text-slate-400">
        {title}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-orange-100 bg-orange-50 px-3 py-1.5 text-[15px] font-semibold text-orange-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SOCIAL LINK
   ========================================================= */

function SocialLink({ symbol, name, href }) {
  if (!href) {
    return null;
  }

  const formattedHref =
    href.startsWith("http://") || href.startsWith("https://")
      ? href
      : `https://${href}`;

  return (
    <a
      href={formattedHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-blue-200 hover:bg-blue-50/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-50 text-[14px] font-bold text-[#07518a]">
        {symbol}
      </div>

      <span className="ml-2.5 flex-1 text-[16px] font-semibold text-slate-600">
        {name}
      </span>

      <span className="text-xs text-slate-300 transition group-hover:text-[#07518a]">
        ↗
      </span>
    </a>
  );
}

/* =========================================================
   PROJECT CARD
   ========================================================= */

function ProjectCard({ project }) {
  const image =
    project.projectImages?.length > 0 ? project.projectImages[0]?.url : null;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-[0_8px_24px_rgba(7,81,138,0.10)]">
      {/* IMAGE */}
      <div className="relative h-[220px] overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={project.title || "Project"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">
            <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-base font-bold text-[#07518a]">
              &lt;/&gt;
            </div>

            <span className="text-[16px] font-medium text-slate-400">
              No project image
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* STATUS */}
        {project.status === "Approved" && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-orange-500 px-3 py-1.5 text-[14px] font-bold text-white shadow-sm">
            ✓ Approved
          </span>
        )}

        {project.status === "Rejected" && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-red-500 px-3 py-1.5 text-[14px] font-bold text-white shadow-sm">
            Rejected
          </span>
        )}

        {!["Approved", "Rejected"].includes(project.status) && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-orange-500 px-3 py-1.5 text-[14px] font-bold text-white shadow-sm">
            Pending
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold text-slate-800 transition group-hover:text-[#07518a]">
              {project.title}
            </h3>

            {project.subtitle && (
              <p className="mt-0.5 truncate text-[14px] font-semibold text-orange-500">
                {project.subtitle}
              </p>
            )}
          </div>

          {project.semester && (
            <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-1 text-[14px] font-semibold text-slate-500">
              Sem {project.semester}
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 min-h-[32px] text-[15px] leading-[1.55] text-slate-500">
          {project.description || "No project description available."}
        </p>

        {/* TECH STACK */}
        {project.techStack?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded bg-blue-50 px-1.5 py-1 text-[16px] font-semibold text-[#07518a]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-5 flex items-center border-t border-slate-100 pt-2.5">
          <div className="text-[14px] font-medium text-slate-400">
            {project.projectType || "Individual"} Project
          </div>

          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 rounded-md bg-orange-500 px-3 py-1.5.5 text-[14px] font-bold text-white transition hover:bg-orange-600"
            >
              View Project
              <span>→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function StudentData({ student, projects = [] }) {
  if (!student) {
    return null;
  }

  const skills = student.skills || [];
  const interests = student.interests || [];

  return (
    <div className="min-h-screen bg-[#f7f7f6] text-slate-800">
      {/* TOP ACCENT */}
      <div className="h-1 w-full bg-orange-500" />

      {/* =====================================================
          PROFILE HEADER
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* PROFILE IMAGE */}
            <div className="relative shrink-0">
              <div className="h-[96px] w-[96px] overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
                {student.profileImage ? (
                  <img
                    src={student.profileImage}
                    alt={student.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-[#07518a]">
                    {student.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            {/* STUDENT INFO */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#07518a] sm:text-4xl">
                  {student.fullName}
                </h1>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[16px] font-bold text-[#07518a]">
                  ✓ Available for Hire
                </span>
              </div>

              {student.program && (
                <p className="mt-1 text-[16px] font-medium text-slate-500">
                  {student.program}
                  {student.lastYear ? ` • ${student.lastYear}th Year` : ""}
                  {student.academicBatch
                    ? ` • ${student.academicBatch}`
                    : ""}
                </p>
              )}

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-slate-400">
                {student.department && (
                  <span className="font-medium text-slate-500">
                    {student.department}
                  </span>
                )}

                {student.rollNumber && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>Roll No. {student.rollNumber}</span>
                  </>
                )}
              </div>

              {/* BUTTONS */}
              <div className="mt-5 flex flex-wrap gap-2">
                {student.phone && (
                  <a
                    href={`tel:${student.phone}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md bg-orange-500 px-3 text-[14px] font-bold text-white transition hover:bg-orange-600"
                  >
                    <span>✆</span>
                    Contact Student
                  </a>
                )}

                {student.resume && (
                  <a
                    href={student.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-[14px] font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#07518a]"
                  >
                    <span>↓</span>
                    View Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* LEFT COLUMN */}
        <aside className="space-y-6">
          {/* ABOUT */}
          <SectionCard className="p-6">
            <SectionTitle symbol="♙">About</SectionTitle>

            <p className="mt-5 text-[15px] leading-[1.65] text-slate-500">
              {interests.length > 0
                ? `Interested in ${interests.join(", ")}.`
                : "No additional information has been provided by the student."}
            </p>
          </SectionCard>

          {/* SKILLS */}
          <SectionCard className="p-6">
            <SectionTitle symbol="<>">Skills &amp; Expertise</SectionTitle>

            <div className="mt-5 space-y-6">
              <SkillGroup title="Technical Skills" skills={skills} />

              {interests.length > 0 && (
                <SkillGroup title="Interests" skills={interests} />
              )}

              {skills.length === 0 && interests.length === 0 && (
                <p className="text-[15px] text-slate-400">
                  No skills added yet.
                </p>
              )}
            </div>
          </SectionCard>

          {/* ACADEMIC INFORMATION */}
          <SectionCard className="p-6">
            <SectionTitle symbol="A">Academic Information</SectionTitle>

            <div className="mt-5 space-y-2.5">
              {[
                ["Program", student.program],
                ["Department", student.department],
                ["Roll Number", student.rollNumber],
                ["Batch", student.academicBatch],
                ["Year", student.lastYear],
                ["Specialization", student.specialization],
              ].map(([label, value]) =>
                value ? (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0"
                  >
                    <span className="text-[14px] font-medium uppercase tracking-wide text-slate-400">
                      {label}
                    </span>

                    <span className="text-right text-[15px] font-semibold text-slate-700">
                      {value}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </SectionCard>

          {/* ONLINE PRESENCE */}
          <SectionCard className="p-6">
            <SectionTitle symbol="↗">Online Presence</SectionTitle>

            <div className="mt-5 space-y-2.5">
              <SocialLink
                symbol="GH"
                name="GitHub"
                href={student.github}
              />

              <SocialLink
                symbol="in"
                name="LinkedIn"
                href={student.linkedin}
              />

              <SocialLink
                symbol="WWW"
                name="Personal Portfolio"
                href={student.portfolio}
              />

              {!student.github &&
                !student.linkedin &&
                !student.portfolio && (
                  <div className="rounded-xl bg-slate-50 px-3 py-4 text-center">
                    <p className="text-[15px] text-slate-400">
                      No online profiles added.
                    </p>
                  </div>
                )}
            </div>
          </SectionCard>
        </aside>

        {/* RIGHT COLUMN */}
        <section className="min-w-0">
          {/* CURRENT STANDING */}
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-[#07518a] px-4 py-3.5 text-white">
            <div className="absolute -right-10 -top-14 h-32 w-32 rounded-full border border-white/10" />
            <div className="absolute -right-2 -bottom-16 h-28 w-28 rounded-full border border-orange-400/10" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[16px] font-bold uppercase tracking-[1.5px] text-blue-200">
                  Current Standing
                </p>

                <h2 className="mt-0.5 text-base font-bold">
                  {student.department || "Department not specified"}
                </h2>

                <p className="mt-0.5 text-[14px] text-blue-100">
                  {student.program || "Program not specified"}
                </p>
              </div>

              <div className="flex gap-6">
                <div>
                  <p className="text-3xl font-bold text-orange-400">
                    {student.lastYear || "-"}
                  </p>

                  <p className="mt-0.5 text-[16px] font-bold uppercase tracking-wide text-blue-200">
                    Year
                  </p>
                </div>

                <div className="border-l border-white/15 pl-6">
                  <p className="text-3xl font-bold text-white">
                    {student.academicBatch || "-"}
                  </p>

                  <p className="mt-0.5 text-[16px] font-bold uppercase tracking-wide text-blue-200">
                    Batch
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PROJECT PORTFOLIO */}
          <div className="mb-5">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />

                  <p className="text-[14px] font-bold uppercase tracking-[1.3px] text-orange-500">
                    Student Work
                  </p>
                </div>

                <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-[#07518a]">
                  Project Portfolio
                </h2>
              </div>

              <span className="rounded-md bg-white px-3 py-1.5 text-[14px] font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
                {projects.length}{" "}
                {projects.length === 1 ? "Project" : "Projects"}
              </span>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-base font-bold text-[#07518a]">
                  &lt;/&gt;
                </div>

                <p className="mt-5 text-[14px] font-bold text-slate-700">
                  No projects available
                </p>

                <p className="mt-1 text-[15px] text-slate-400">
                  This student has not added any projects yet.
                </p>
              </div>
            )}
          </div>

          {/* PROJECT OVERVIEW */}
          {projects.length > 0 && (
            <SectionCard className="p-6">
              <SectionTitle symbol="✓">Project Overview</SectionTitle>

              <div className="mt-5 space-y-2.5">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="group rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-blue-100 hover:bg-blue-50/30"
                  >
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold text-slate-700 transition group-hover:text-[#07518a]">
                          {project.title}
                        </p>

                        <p className="mt-0.5 text-[14px] text-slate-400">
                          {project.projectType || "Individual"}
                          {project.semester
                            ? ` • Semester ${project.semester}`
                            : ""}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-[16px] font-bold ${
                          project.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : project.status === "Rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {project.status || "Pending Approval"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </section>
      </main>
    </div>
  );
}
