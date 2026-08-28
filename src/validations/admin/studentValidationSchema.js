export const studentValidationSchema = (students) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailCount = {};

  // Count duplicate student emails ONLY
  students.forEach((student) => {
    const email = student.email?.toString().trim().toLowerCase();

    if (email) {
      emailCount[email] = (emailCount[email] || 0) + 1;
    }
  });

  return students.map((student) => {
    const name = student.name?.toString().trim() || "";
    const email = student.email?.toString().trim().toLowerCase() || "";
    const guidename = student.guidename?.toString().trim() || "";
    const guideemail =
      student.guideemail?.toString().trim().toLowerCase() || "";

    const errors = [];

    // -------------------------
    // Student Name
    // -------------------------
    if (!name) {
      errors.push("Name is required");
    }

    // -------------------------
    // Student Email
    // -------------------------
    if (!email) {
      errors.push("Email is required");
    } else if (!emailRegex.test(email)) {
      errors.push("Invalid student email");
    }

    // Duplicate student email IS an error
    if (email && emailCount[email] > 1) {
      errors.push("Duplicate student email");
    }

    // -------------------------
    // Guide Name
    // -------------------------
    if (!guidename) {
      errors.push("Guide name is required");
    }

    // -------------------------
    // Guide Email
    // -------------------------
    if (!guideemail) {
      errors.push("Guide email is required");
    } else if (!emailRegex.test(guideemail)) {
      errors.push("Invalid guide email");
    }

    // ❌ DO NOT check duplicate guide email
    // Multiple students can have the same mentor.

    return {
      name,
      email,
      guidename,
      guideemail,
      errors,
      isValid: errors.length === 0,
    };
  });
};
