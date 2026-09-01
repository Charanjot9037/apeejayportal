// mappers/project.js

export const mapVerifiedProjectToCard = (project) => {
  return {
    id: project?._id?.toString() || "",

    // Basic project information
    title: project?.title || "Untitled Project",
    subtitle: project?.subtitle || "",
    description: project?.description || "",

    // Project type
    projectType: project?.projectType || "",

    // Semester
    semester: project?.semester || "",

    // Technology
    techStack: Array.isArray(project?.techStack)
      ? project.techStack.filter(Boolean)
      : [],

    // Links
    githubLink: project?.githubLink || null,
    liveLink: project?.liveLink || null,

    // Images
    projectImages: Array.isArray(project?.projectImages)
      ? project.projectImages.filter(Boolean)
      : [],

    // Status
    status: project?.status || "",

    // Mentor/student IDs
    mentor: project?.mentor?.toString?.() || null,
    student: project?.student?.toString?.() || null,

    // Files
    synopsisFile: project?.synopsisFile || null,
    reportFile: project?.reportFile || null,
    presentationFile: project?.presentationFile || null,

    // Dates
    createdAt: project?.createdAt || null,
    updatedAt: project?.updatedAt || null,
    mentorReviewedAt: project?.mentorReviewedAt || null,
  };
};