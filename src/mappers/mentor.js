export const mapMentorProjectToRoster = (project) => {
  return {
    id: project._id,
    projectTitle: project.title || "-",
    name: project.student?.name || "-",
    program: project.student?.program || "-",
    department: project.student?.department || "-",
    semester: project.semester || "-",
    projectType: project.projectType || "-",
    specialization: project.student.specialization || [],
    status: project.status || "-",
    lastReviewed: project.mentorReviewedAt || null,
  };
};
export const mapStudentsToRoster = (student) => {
  return {
    id: student._id,

    name: student.fullName || "-",
    program: student.program || "-",
    department: student.department || "-",
    specialization: student.specialization || "-",

    academicBatch: student.academicBatch || "-",
    lastYear: student.lastYear || "-",
    rollNumber: student.rollNumber || "-",

    phone: student.phone || "-",
  };
};
