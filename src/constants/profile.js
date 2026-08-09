export const demoProfile = {
  id: "1",

  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@example.com",
  phone: "+91 98765 43210",

  gender: "Male",
  dateOfBirth: "12/05/2002",
  nationality: "Indian",
  address: "Chennai, Tamil Nadu, India",

  college: "Computer Science College",
  course: "Computer Science Engineering",
  specialization: "Computer Systems",
  yearOfGraduation: "2025",
  cgpa: "8.42",

  skills: [
    "Java",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "Git",
  ],

  interests: [
    "Machine Learning",
    "Cloud",
    "Web Development",
  ],

  profiles: [
    {
      name: "GitHub",
      url: "https://github.com/",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/",
    },
    {
      name: "Portfolio",
      url: "https://example.com/",
    },
  ],

  resume: {
    name: "Alex_Johnson_Resume.pdf",
    url: "#",
  },
};

export const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  gender: "",
  dateOfBirth: "",
  nationality: "",
  address: "",

  college: "",
  course: "",
  specialization: "",
  yearOfGraduation: "",
  cgpa: "",

  skills: [],
  interests: [],

  profiles: [],

  resume: null,
};