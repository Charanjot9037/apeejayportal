export const studentValidationSchema = (students) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailCount = {};

  students.forEach((student) => {
    const email = student.email?.toString().trim().toLowerCase();

    if (email) {
      emailCount[email] = (emailCount[email] || 0) + 1;
    }
  });

  return students.map((student) => {
    const name = student.name?.toString().trim() || '';
    const email = student.email?.toString().trim().toLowerCase() || '';

    const errors = [];

    if (!name) {
      errors.push('Name is required');
    }

    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Invalid email');
    }

    if (email && emailCount[email] > 1) {
      errors.push('Duplicate email');
    }

    return {
      name,
      email,
      errors,
      isValid: errors.length === 0,
    };
  });
};
