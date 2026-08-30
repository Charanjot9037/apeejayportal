export const classes = [
  {
    label: "Select your class",
    value: "",
  },
  {
    label: "B.Tech",
    value: "btech",
  },
  {
    label: "MCA",
    value: "mca",
  },
  {
    label: "BCA",
    value: "bca",
  },
  {
    label: "MBA",
    value: "mba",
  },
];
export const categories = [
  {
    label: "Select your category",
    value: "",
  },
  {
    id: 1,
    value: "it",
    label: "Information Technology",
  },
  {
    id: 2,
    value: "engineering",
    label: "Engineering",
  },
  {
    id: 3,
    value: "management",
    label: "Management",
  },
];

export const specializationOptions = {
  ENGINEERING: [
    {
      value: "CSE",
      label: "Computer Science & Engineering",
    },
    {
      value: "AI_ML",
      label: "Artificial Intelligence & Machine learning",
    },
    {
      value: "CS_IOT",
      label: "Cyber Security & IOT",
    },
  ],

  MANAGEMENT: [],

  IT: [],
};
export const programOptions = {
  ENGINEERING: [
    {
      value: "BTECH",
      label: "B.Tech",
    },
  ],

  IT: [
    {
      value: "MCA",
      label: "MCA",
    },
    {
      value: "BCA",
      label: "BCA",
    },
  ],

  MANAGEMENT: [
    {
      value: "MBA",
      label: "MBA",
    },
    {
      value: "BBA",
      label: "BBA",
    },
    {
      value: "BCOM",
      label: "B.Com(H)",
    },
  ],
};
export const semesterOptions = {
  BTECH: Array.from({ length: 8 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  BCA: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  BBA: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  BCOM: Array.from({ length: 6 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  MCA: Array.from({ length: 4 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),

  MBA: Array.from({ length: 4 }, (_, index) => ({
    value: String(index + 1),
    label: String(index + 1),
  })),
};

export const generateAcademicYears = (startYear = 2025) => {
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => currentYear - index,
  ).map((year) => ({
    label: String(year),
    value: String(year),
  }));
};
