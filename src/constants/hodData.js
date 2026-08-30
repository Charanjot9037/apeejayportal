import { LayoutGrid, FileText, Users } from 'lucide-react';

export const hodDashboardData = {
  title: 'HOD Portal',

  subtitle: 'Academic Year 2024-25',

  profileUrl: '/profile.png',

  placementReadiness: 85,

  navItems: [
    {
      label: 'Dashboard',
      icon: LayoutGrid,
      href: '/hod-dashboard',
    },
    {
      label: 'Department Projects',
      icon: Users,
      href: '/hod-dashboard/department-projects',
    },
    {
      label: 'All Students',
      icon: Users,
      href: '/hod-dashboard/all-students',
    },
     {
      label: 'My Students',
      icon: Users,
      href: '/hod-dashboard/my-students',
    },
    {
      label: 'Mentors',
      icon: Users,
      href: '/hod-dashboard/mentors',
    },
  ],
};
export const HOD_DASHBOARD_HEADER = {
  title: 'HOD Dashboard',
  description: 'Overview of department performance and project status.',
};
export const DEPARTEMENT_DASHBOARD_HEADER = {
  title: 'Department',
  description: 'Overview of department performance and project status.',
};
export const PROJECTS = [
  {
    id: 1,
    projectTitle: 'AI-Based Crop Disease Detection',
    student: 'Rahul Sharma',
    rollNo: '24CS001',
    mentor: 'Dr. A. Gupta',
    status: 'Verified',
    approvalDate: '12 Oct 2023',
  },
  {
    id: 2,
    projectTitle: 'Blockchain Supply Chain',
    student: 'Priya Singh',
    rollNo: '24CS015',
    mentor: 'Prof. V. Kumar',
    status: 'Pending',
    approvalDate: '-',
  },
  {
    id: 3,
    projectTitle: 'Smart Campus IoT Network',
    student: 'Amit Patel',
    rollNo: '24IT042',
    mentor: 'Dr. S. Reddy',
    status: 'Changes Required',
    approvalDate: '10 Oct 2023',
  },
  {
    id: 4,
    projectTitle: 'AI Powered Healthcare Assistant',
    student: 'Simar Kaur',
    rollNo: '24CS023',
    mentor: 'Dr. Neha Sharma',
    status: 'Verified',
    approvalDate: '08 Oct 2023',
  },
  {
    id: 5,
    projectTitle: 'E-Commerce Recommendation System',
    student: 'Arjun Mehta',
    rollNo: '24CS031',
    mentor: 'Dr. R. Kapoor',
    status: 'Pending',
    approvalDate: '-',
  },
  {
    id: 6,
    projectTitle: 'Face Recognition Attendance System',
    student: 'Ananya Verma',
    rollNo: '24CS037',
    mentor: 'Prof. M. Singh',
    status: 'Verified',
    approvalDate: '06 Oct 2023',
  },
  {
    id: 7,
    projectTitle: 'Smart Traffic Management System',
    student: 'Karan Malhotra',
    rollNo: '24IT018',
    mentor: 'Dr. P. Sharma',
    status: 'Changes Required',
    approvalDate: '05 Oct 2023',
  },
  {
    id: 8,
    projectTitle: 'Online Learning Management System',
    student: 'Mehak Gupta',
    rollNo: '24CS044',
    mentor: 'Dr. S. Bhatia',
    status: 'Verified',
    approvalDate: '04 Oct 2023',
  },
  {
    id: 9,
    projectTitle: 'AI Chatbot for Student Support',
    student: 'Harshdeep Singh',
    rollNo: '24CS052',
    mentor: 'Prof. R. Arora',
    status: 'Pending',
    approvalDate: '-',
  },
  {
    id: 10,
    projectTitle: 'Weather Forecasting Using Machine Learning',
    student: 'Isha Sharma',
    rollNo: '24CS061',
    mentor: 'Dr. N. Verma',
    status: 'Verified',
    approvalDate: '02 Oct 2023',
  },
  {
    id: 11,
    projectTitle: 'Secure Online Voting System',
    student: 'Manav Khanna',
    rollNo: '24CS073',
    mentor: 'Dr. A. Mehta',
    status: 'Changes Required',
    approvalDate: '01 Oct 2023',
  },
  {
    id: 12,
    projectTitle: 'Hospital Management System',
    student: 'Simran Kaur',
    rollNo: '24CS081',
    mentor: 'Prof. K. Sharma',
    status: 'Verified',
    approvalDate: '29 Sep 2023',
  },
  {
    id: 13,
    projectTitle: 'Cybersecurity Threat Detection',
    student: 'Rohan Kumar',
    rollNo: '24CS094',
    mentor: 'Dr. V. Arora',
    status: 'Pending',
    approvalDate: '-',
  },
  {
    id: 14,
    projectTitle: 'Smart Waste Management System',
    student: 'Nikita Joshi',
    rollNo: '24IT107',
    mentor: 'Dr. P. Gupta',
    status: 'Verified',
    approvalDate: '27 Sep 2023',
  },
  {
    id: 15,
    projectTitle: 'Personalized Fitness Recommendation App',
    student: 'Yash Thakur',
    rollNo: '24CS119',
    mentor: 'Prof. D. Sharma',
    status: 'Changes Required',
    approvalDate: '25 Sep 2023',
  },
];

// =========================================================
// HOD PROJECT DEFAULT FILTERS
// =========================================================

export const DEFAULT_PROJECT_FILTERS = {
  program: "BTech",
  semester: "1",
  specialization: "CSE",
  status: "",
  mentor: "",
};
export const HOD_PROJECT_FILTERS = [
  {
    key: "program",
    label: "Program",
    options: [
      {
        label: "B.Tech",
        value: "BTech",
      },
      {
        label: "BBA",
        value: "BBA",
      },
      {
        label: "MBA",
        value: "MBA",
      },
    ],
  },

  {
    key: "semester",
    label: "Semester",
    options: [
      {
        label: "1st Semester",
        value: "1",
      },
      {
        label: "2nd Semester",
        value: "2",
      },
      {
        label: "3rd Semester",
        value: "3",
      },
      {
        label: "4th Semester",
        value: "4",
      },
      {
        label: "5th Semester",
        value: "5",
      },
      {
        label: "6th Semester",
        value: "6",
      },
      {
        label: "7th Semester",
        value: "7",
      },
      {
        label: "8th Semester",
        value: "8",
      },
    ],
  },

  {
    key: "specialization",
    label: "Specialization",
    options: [
      {
        label: "CSE",
        value: "CSE",
      },
      {
        label: "ECE",
        value: "ECE",
      },
      {
        label: "ME",
        value: "ME",
      },
    ],
  },

  {
    key: "status",
    label: "Status",
    options: [
      {
        label: "All Status",
        value: "",
      },
      {
        label: "Pending Approval",
        value: "Pending Approval",
      },
      {
        label: "In Review",
        value: "In Review",
      },
      {
        label: "Approved",
        value: "Approved",
      },
      {
        label: "Rejected",
        value: "Rejected",
      },
    ],
  },
];

// =========================================================
// HOD PROJECT COLUMNS
// =========================================================

export const projectColumns = [
  {
    key: "projectTitle",
    label: "Project",
  },
  {
    key: "student",
    label: "Student",
  },
  {
    key: "mentor",
    label: "Mentor",
  },
  {
    key: "semester",
    label: "Semester",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "approvalDate",
    label: "Approval Date",
  },
];

export const mapProjectToRoster = (project) => ({
  _id: project._id,
  id: project.id,

  projectTitle:
    project.projectTitle ||
    "-",

  title:
    project.title ||
    "-",

  subtitle:
    project.subtitle || "",

  student:
    project.student ||
    "Unknown Student",

  studentEmail:
    project.studentEmail ||
    "",

  mentor:
    project.mentor ||
    "Not Assigned",


  semester:
    project.semester ||
    "",

  status:
    project.status ||
    "-",

  approvalDate:
    project.approvalDate ||
    "-",

  mentorReviewedAt:
    project.mentorReviewedAt ||
    null,
});

export const HOD_STAT_CARDS = [
  {
    id: "students",
    title: "Total Students",
    value: 0,
    description: "Students in your department",
    icon: "GraduationCap",
  },
  {
    id: "mentors",
    title: "Total Mentors",
    value: 0,
    description: "Mentors in your department",
    icon: "UserRound",
  },
  {
    id: "projects",
    title: "Total Projects",
    value: 0,
    description: "Projects in your department",
    icon: "FolderKanban",
  },
  {
    id: "pending",
    title: "Pending Approvals",
    value: 0,
    description: "Projects awaiting approval",
    icon: "Clock3",
  },
];