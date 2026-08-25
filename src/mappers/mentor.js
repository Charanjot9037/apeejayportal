export const mapMentorProjectToRoster = (project) => {
  return {
    id: project._id,
    projectTitle: project.title || '-',
    name: project.student?.name || '-',
    program:project.student?.program||'-',
    department: project.student?.department || '-',
    semester: project.semester || '-',
    projectType: project.projectType || '-',
    specialization: project.specialization || [],
    status: project.status || '-',
    lastReviewed: project.mentorReviewedAt || null,
  };
};