import { resume } from "react-dom/server";

export function mapStudentToProfile(student) {
  if (!student) {
    return null;
  }

  return {
    // =========================
    // PERSONAL INFORMATION
    // =========================
    profile: {
      fullName: student.fullName || "",
      profileImage: student.profileImage || "",
      department: student.department || "",
      academicBatch: student.academicBatch || "",
      lastYear: student.lastYear || "",
    },
    personal: {
      fullName: student.fullName || "",
      phone: student.phone || "",
      gender: student.gender || "",
      email: student.email || " ",
      address: student.address || "",
    },

    // =========================
    // SKILLS & INTERESTS
    // =========================
    skills: {
      skills:
        student.skills?.flatMap((item) =>
          item
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        ) || [],

      interests:
        student.interests?.flatMap((item) =>
          item
            .split(",")
            .map((interest) => interest.trim())
            .filter(Boolean),
        ) || [],
    },

    // =========================
    // ACADEMIC INFORMATION
    // =========================
    academic: {
      department: student.department || "",
      program: student.program || "",
      currentSemester: student.currentSemester || "",
      rollNumber: student.rollNumber || "",
      academicBatch: student.academicBatch || "",
      lastYear: student.lastYear || "",
      specialization: student.specialization || "",
    },

    // =========================
    // ONLINE PROFILES
    // =========================
    profiles: {
      linkedin: student.linkedin || "",
      github: student.github || "",
      portfolio: student.portfolio || "",
      resume: student.resume || "",
    },

    document: {
      resume: student.resume || " ",
      resumeName: student.resumeName || " ",
    },
  };
}
