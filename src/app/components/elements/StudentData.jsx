'use client';

import Image from 'next/image';

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

function SectionCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ symbol, children }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-[#07518a]">
        {symbol}
      </div>

      <h2 className="text-[15px] font-bold tracking-tight text-slate-800">
        {children}
      </h2>
    </div>
  );
}

function SkillGroup({ title, skills }) {
  const validSkills = Array.isArray(skills)
    ? skills.filter(
        (skill) =>
          skill !== null &&
          skill !== undefined &&
          typeof skill !== 'object' &&
          String(skill).trim() !== '',
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
          <span
            key={`${String(skill)}-${index}`}
            className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-[#07518a] transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            {String(skill).trim()}
          </span>
        ))}
      </div>
    </div>
  );
}

function SocialLink({ symbol, name, href }) {
  if (!href) {
    return null;
  }

  const formattedHref =
    href.startsWith('http://') || href.startsWith('https://')
      ? href
      : `https://${href}`;

  return (
    <a
      href={formattedHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-[#07518a] shadow-sm">
        {symbol}
      </div>

      <span className="ml-3 flex-1 text-[12px] font-semibold text-slate-600">
        {name}
      </span>

      <span className="text-sm text-slate-300 transition group-hover:text-[#07518a]">
        ↗
      </span>
    </a>
  );
}

function ProjectStatus({ status }) {
  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Approved
      </span>
    );
  }

  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-[9px] font-bold text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-[9px] font-bold text-orange-600">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
      {status || 'Pending Approval'}
    </span>
  );
}

function ProjectCard({ project }) {
  const image =
    project.projectImages?.length > 0 ? project.projectImages[0]?.url : null;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_10px_28px_rgba(15,23,42,0.09)]">
      <div className="relative h-[190px] overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={project.title || 'Project'}
            fill
            sizes="(max-width: 1280px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#07518a] shadow-sm">
              &lt;/&gt;
            </div>

            <span className="mt-2 text-xs font-medium text-slate-400">
              No project image
            </span>
          </div>
        )}

        {image && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        )}

        <div className="absolute left-4 top-4">
          {project.status === 'Approved' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-sm">
              ✓ Approved
            </span>
          )}

          {project.status === 'Rejected' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-sm">
              Rejected
            </span>
          )}

          {!['Approved', 'Rejected'].includes(project.status) && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-sm">
              Pending
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-bold text-slate-800 transition-colors group-hover:text-[#07518a]">
              {project.title || 'Untitled Project'}
            </h3>

            {project.subtitle && (
              <p className="mt-1 text-[11px] font-semibold text-orange-500">
                {project.subtitle}
              </p>
            )}
          </div>

          {project.semester && (
            <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[9px] font-semibold text-slate-500">
              Sem {project.semester}
            </span>
          )}
        </div>

        <p className="mt-3 min-h-[54px] line-clamp-3 text-[12px] leading-[1.7] text-slate-500">
          {project.description || 'No project description available.'}
        </p>

        {project.techStack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 5).map((tech, index) => (
              <span
                key={`${tech}-${index}`}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-[9px] font-medium text-slate-600"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center border-t border-slate-100 pt-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Project Type
            </p>

            <p className="mt-1 text-[10px] font-semibold text-slate-600">
              {project.projectType || 'Individual'}
            </p>
          </div>

          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[#07518a] px-3.5 py-2 text-[10px] font-bold text-white transition-colors hover:bg-[#063f6b]"
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

function ProjectOverviewRow({ project }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 transition-all hover:border-blue-100 hover:bg-blue-50/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-slate-700">
            {project.title || 'Untitled Project'}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {project.projectType || 'Individual'}
            {project.semester ? ` • Semester ${project.semester}` : ''}
          </p>
        </div>

        <ProjectStatus status={project.status} />
      </div>
    </div>
  );
}

function AcademicDetail({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-[9px] font-semibold uppercase tracking-[0.8px] text-slate-400">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-[11px] font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}

export default function StudentData({ student, projects = [] }) {
  if (!student) {
    return null;
  }

  const skills = Array.isArray(student.skills)
    ? student.skills.filter((skill) => String(skill).trim() !== '')
    : [];

  const interests = Array.isArray(student.interests)
    ? student.interests.filter((interest) => String(interest).trim() !== '')
    : [];
  const academicYear = getAcademicYear(student);

  return (
    <div className="min-h-screen  text-slate-800">
      <section className="relative mx-5 mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f97316] via-[#f97316] to-[#ea580c] shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:mx-8 lg:mx-16 xl:mx-24">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute bottom-[-100px] right-[18%] h-64 w-64 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="pointer-events-none absolute left-[35%] top-[-120px] h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-7 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center">
            <div className="relative mx-auto shrink-0 lg:mx-0">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                <div className="absolute -inset-2 rounded-full bg-white/20 blur-sm" />

                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-[#21428f] shadow-xl">
                  {student.profileImage ? (
                    <Image
                      src={student.profileImage}
                      alt={student.fullName || 'Student'}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                      {student.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>

                <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#f97316] bg-emerald-500 shadow-md">
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
                  {student.fullName || 'Student'}
                </h1>
              </div>

              {student.program && (
                <p className="mt-2 text-[14px] font-semibold text-white">
                  {student.program}
                </p>
              )}

              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-white/90 lg:justify-start">
                {student.department && (
                  <span className="font-semibold text-white">
                    {student.department}
                  </span>
                )}

                {academicYear && (
                  <>
                    <span className="text-white/50">•</span>

                    <span>
                      Academic Year{' '}
                      <span className="font-semibold text-white">
                        {academicYear}
                      </span>
                    </span>
                  </>
                )}

                {student.rollNumber && (
                  <>
                    <span className="text-white/50">•</span>

                    <span>
                      Roll No.{' '}
                      <span className="font-semibold text-white">
                        {student.rollNumber}
                      </span>
                    </span>
                  </>
                )}
              </div>

              {(student.email || student.resume) && (
                <div className="mt-5 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                  {student.email && (
                    <a
                      href={`mailto:${student.email}`}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#07518a] px-4 text-[11px] font-bold text-white shadow-md transition-all hover:bg-[#063f6b] hover:shadow-lg"
                    >
                      <span>✉</span>
                      Contact Student
                    </a>
                  )}

                  {student.resume && (
                    <a
                      href={student.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 text-[11px] font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#07518a]"
                    >
                      <span>↓</span>
                      View Resume
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="grid w-full shrink-0 grid-cols-2 gap-3 sm:w-[230px]">
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-center backdrop-blur-md">
                <p className="text-2xl font-bold text-white">
                  {projects.length}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[1.2px] text-white/75">
                  Projects
                </p>
              </div>

              <div className="rounded-xl border border-white/20 bg-[#07518a]/25 px-4 py-4 text-center backdrop-blur-md">
                <p className="text-2xl font-bold text-white">{skills.length}</p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[1.2px] text-white/75">
                  Skills
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-9">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <SectionCard className="p-5">
              <SectionTitle symbol="i">About</SectionTitle>

              <p className="mt-5 text-[12px] leading-[1.8] text-slate-500">
                {interests.length > 0
                  ? `Interested in ${interests.join(', ')}.`
                  : 'No additional information has been provided by the student.'}
              </p>
            </SectionCard>

            <SectionCard className="p-5">
              <SectionTitle symbol="<>">Skills &amp; Expertise</SectionTitle>

              <div className="mt-5 space-y-6">
                <SkillGroup title="Technical Skills" skills={skills} />

                <SkillGroup title="Interests" skills={interests} />

                {skills.length === 0 && interests.length === 0 && (
                  <p className="text-xs text-slate-400">No skills added yet.</p>
                )}
              </div>
            </SectionCard>

            <SectionCard className="p-5">
              <SectionTitle symbol="A">Academic Information</SectionTitle>

              <div className="mt-3">
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
              </div>
            </SectionCard>

            <SectionCard className="p-5">
              <SectionTitle symbol="↗">Online Presence</SectionTitle>

              <div className="mt-5 space-y-2.5">
                <SocialLink symbol="GH" name="GitHub" href={student.github} />

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

                {!student.github && !student.linkedin && !student.portfolio && (
                  <p className="text-xs text-slate-400">
                    No online profiles added.
                  </p>
                )}
              </div>
            </SectionCard>
          </aside>

          <section className="min-w-0">
            {projects.length > 0 && (
              <SectionCard className="mb-7 p-5">
                <SectionTitle symbol="✓">Project Overview</SectionTitle>

                <div className="mt-5 space-y-3">
                  {projects.map((project, index) => (
                    <ProjectOverviewRow
                      key={project._id || `project-overview-${index}`}
                      project={project}
                    />
                  ))}
                </div>
              </SectionCard>
            )}

            <SectionCard className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                    <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-orange-500">
                      Student Work
                    </p>
                  </div>

                  <h2 className="mt-1.5 text-[23px] font-bold tracking-tight text-slate-800">
                    Project Portfolio
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-400">
                    A collection of projects and academic work
                  </p>
                </div>

                <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center">
                  <p className="text-[15px] font-bold text-[#07518a]">
                    {projects.length}
                  </p>

                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[1px] text-slate-400">
                    {projects.length === 1 ? 'Project' : 'Projects'}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {projects.map((project, index) => (
                      <ProjectCard
                        key={project._id || `portfolio-${index}`}
                        project={project}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-[#07518a]">
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
              </div>
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
}
