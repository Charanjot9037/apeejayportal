import { LayoutGrid, FileText, Users } from "lucide-react";

export const adminDashboardData = {
  title: "Admin Portal",

  placementReadiness: 85,

  navItems: [
    {
      label: "Dashboard",
      icon: LayoutGrid,
      href: "/admin-dashboard",
    },
    {
      label: "Students",
      icon: Users,
      href: "/admin-dashboard/student",
    },
    {
      label: "Mentor",
      icon: FileText,
      href: "/admin-dashboard/mentor",
    },
    {
      label: "Tools",
      icon: FileText,
      href: "/admin-dashboard/tools",
    },
  ],
};
export const STAT_CARDS = [
  {
    id: "students",
    title: "Total Students",
    value: "4,250",
    icon: "GraduationCap",
    description: "+12% this year",
  },

  {
    id: "mentors",
    title: "Total Mentors",
    value: "185",
    icon: "UserRound",
    description: "Across 15 departments",
  },

  {
    id: "recruiters",
    title: "Active Recruiters",
    value: "342",
    icon: "CalendarClock",
    description: "45 new this month",
  },

  {
    id: "placement-rate",
    title: "Placement Rate",
    value: "88%",
    icon: null,
    description: "Target: 95%",
  },
];

export const STUDENTS = [
  {
    id: "STU001",
    name: "Rahul Sharma",
    department: "Computer Science",
    status: "Placed",
  },
  {
    id: "STU002",
    name: "Priya Singh",
    department: "Information Technology",
    status: "Looking",
  },
  {
    id: "STU003",
    name: "Aman Kumar",
    department: "Computer Science",
    status: "Placed",
  },
];
export const STUDENT_COLUMNS = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "status",
    label: "Status",
  },
];
export const MENTOR_COLUMNS = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "specialization",
    label: "Specialization",
  },

  {
    key: "mentees",
    label: "Mentees",
  },
];

export const MENTORS = [
  {
    id: "MEN001",
    name: "Dr. A.K. Singh",
    specialization: "AI & ML",
    mentees: "12 / 15",
  },
  {
    id: "MEN002",
    name: "Ms. Neha Gupta",
    specialization: "Cloud Computing",
    mentees: "8 / 10",
    highlight: true,
  },
  {
    id: "MEN004",
    name: "Ms. Anjali Mehta",

    specialization: "Data Science",
    mentees: "7 / 10",
  },
];

export const designationOptions = [
  {
    value: "Assistant Professor",
    label: "Assistant Professor",
  },
  {
    value: "HOD",
    label: "HOD",
  },
  {
    value: "Dean",
    label: "Dean",
  },
  {
    value: "TPO",
    label: "TPO",
  },
];
export const ADMIN_DASHBOARD_HEADER = {
  title: "Admin Dashboard",
  description: "Overview of institutional metrics and student management.",
  actionLabel: "12 Pending Approvals",
};

export const studentColumns = [
  {
    key: "name",
    label: "Student Name",
  },
  {
    key: "rollNumber",
    label: "Roll Number",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "program",
    label: "Course",
  },
  {
    key: "academicBatch",
    label: "Batch",
  },
  {
    key: "specialization",
    label: "Specialization",
  },
  {
    key: "status",
    label: "status",
  },
  {
    key: "mentor",
    label: "Mentor",
  },
];

export const DEFAULT_FILTERS = {
  department: "ENGINEERING",
  program: "BTECH",
  academicBatch: "2023",
  specialization: "",
};

export const STUDENT_FILTERS = [
  {
    key: "department",
    label: "Department",
    options: [
      { value: "ENGINEERING", label: "Engineering" },
      { value: "MANAGEMENT", label: "Management" },
      { value: "IT", label: "IT" },
    ],
  },

  {
    key: "program",
    label: "Program / Degree",
    dependsOn: "department",
    options: {
      ENGINEERING: [{ value: "BTECH", label: "B.Tech" }],

      MANAGEMENT: [
        { value: "MBA", label: "MBA" },
        { value: "BBA", label: "BBA" },
        { value: "BCOM", label: "B.Com" },
      ],

      IT: [
        { value: "MCA", label: "MCA" },
        { value: "BCA", label: "BCA" },
      ],
    },
  },

  {
    key: "specialization",
    label: "Specialization",
    dependsOn: "department",
    options: {
      ENGINEERING: [
        { value: "CSE", label: "Computer Science & Engineering" },
        { value: "ECE", label: "Electronics & Communication Engineering" },
        { value: "ME", label: "Mechanical Engineering" },
        { value: "CIVIL", label: "Civil Engineering" },
        { value: "EEE", label: "Electrical & Electronics Engineering" },
      ],

      MANAGEMENT: [
        { value: "FINANCE", label: "Finance" },
        { value: "MARKETING", label: "Marketing" },
        { value: "HR", label: "Human Resource Management" },
        {
          value: "BUSINESS_ANALYTICS",
          label: "Business Analytics",
        },
      ],

      IT: [
        {
          value: "SOFTWARE_DEVELOPMENT",
          label: "Software Development",
        },
        { value: "DATA_SCIENCE", label: "Data Science" },
        {
          value: "AI_ML",
          label: "Artificial Intelligence & Machine Learning",
        },
        {
          value: "CYBER_SECURITY",
          label: "Cyber Security",
        },
        {
          value: "CLOUD_COMPUTING",
          label: "Cloud Computing",
        },
      ],
    },
  },

  {
    key: "academicBatch",
    label: "Academic Batch",
    options: [
      { value: "2023", label: "2023" },
      { value: "2024", label: "2024" },
      { value: "2025", label: "2025" },
      { value: "2026", label: "2026" },
    ],
  },
];

export const mapStudentToRoster = (student) => {
  return {
    _id: student?._id,

    name: student?.userId?.name || student?.name || "-",
    status: student?.userId?.status || "-",
    email: student?.userId?.email || student?.email || "-",
    rollNumber: student?.rollNumber || "-",
    phone: student?.phone || "-",

    department: student?.department || "-",

    program: student?.program || "-",

    academicBatch: student?.academicBatch || "-",

    specialization: student?.specialization || "-",

    mentor: student?.mentor?.userId?.name || student?.mentor?.name || "-",

    mentorId:
      student?.mentor?.userId?._id ||
      student?.mentorId ||
      student?.userId?.mentorId ||
      "-",
  };
};
export const MENTOR_ROSTER_COLUMNS = [
  {
    key: "name",
    label: "Mentor Name",
  },
  {
    key: "mobile",
    label: "Mobile",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "designation",
    label: "Designation",
  },
];

export const MENTOR_DEFAULT_FILTERS = {
  department: "Engineering",
};

export const MENTOR_FILTER_CONFIG = [
  {
    key: "department",
    label: "Department",
    options: [
      {
        value: "Engineering",
        label: "Engineering",
      },
      {
        value: "Management",
        label: "Management",
      },
      {
        value: "Information Technology",
        label: "Information Technology",
      },
    ],
  },
];

export const mapMentorToRoster = (mentor) => {
  return {
    id: mentor._id,
    status: mentor.userId?.status || " empty",
    email: mentor?.userId?.email || "-",
    name: mentor.userId?.name || "-",
    mobile: mentor.mobileNumber || "-",
    department: mentor.department || "-",
    designation: mentor.designation || "-",
  };
};
export const newmapMentorToRoster = (mentor) => {
  return {
    _id: mentor?._id?.toString() || "",

    id: mentor?._id?.toString() || "",

    userId: mentor?.userId?._id?.toString() || "",

    name: mentor?.userId?.name || mentor?.name || "-",

    email: mentor?.userId?.email || mentor?.email || "-",

    status: mentor?.userId?.status || mentor?.status || "-",

    mobileNumber: mentor?.mobileNumber || "-",

    contact: mentor?.mobileNumber || "-",

    department: mentor?.department || "-",

    designation: mentor?.designation || "-",
  };
};
