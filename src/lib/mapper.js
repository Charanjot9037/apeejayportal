export function mapStudentToProfile(student) {
  if (!student) {
    return null;
  }
  const complete = calculateProfileCompletion(student);
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
      completion: complete,
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

export function calculateProfileCompletion(student) {
  if (!student) {
    return 0;
  }

  const fields = [
    // Personal Information
    student.fullName,
    student.profileImage,
    student.department,
    student.academicBatch,
    student.lastYear,
    student.phone,
    student.gender,
    student.email,
    student.address,

    // Skills & Interests
    student.skills?.length > 0,
    student.interests?.length > 0,

    // Academic Information
    student.program,
    student.rollNumber,
    student.specialization,

    // Online Profiles
    student.linkedin,
    student.github,
    student.portfolio,

    // Resume
    student.resume,
    student.resumeName,
  ];

  const completedFields = fields.filter((field) => {
    if (Array.isArray(field)) {
      return field.length > 0;
    }

    if (typeof field === "boolean") {
      return field;
    }

    return field !== null && field !== undefined && String(field).trim() !== "";
  }).length;

  const completion = Math.round((completedFields / fields.length) * 100);

  return Math.min(100, Math.max(0, completion));
}
