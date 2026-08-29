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
  actionLabel: 'Export Report',
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

export const PROJECT_COLUMNS = [
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
    key: "program",
    label: "Program",
  },
  {
    key: "specialization",
    label: "Specialization",
  },
  {
    key: "academicBatch",
    label: "Academic Batch",
  },
  {
    key: "currentSemester",
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
export const HOD_PROJECT_FILTERS = [
  {
    key: "specialization",
    label: "Stream",
    placeholder: "All Streams",

    optionsByDepartment: {
      MANAGEMENT: [
        "BBA",
        "MBA",
      ],

      ENGINEERING: [
        "B.Tech CSE",
        "B.Tech AI & ML",
        "B.Tech CS-IOT"
      ],


      IT: [
        "BCA",
        "BCOM"
      ],
    },
  },

  {
    key: "academicBatch",
    label: "Academic Batch",
    placeholder: "All Batches",

    options: [
      "2023",
      "2024",
      "2025",
      "2026",
      "2027",
      "2028",
    ],
  },
];
export const HOD_STUDENT_FILTERS = [
  {
    key: 'department',
    label: 'Department',
    options: [
      {
        value: 'ENGINEERING',
        label: 'Engineering',
      },
      {
        value: 'MANAGEMENT',
        label: 'Management',
      },
      {
        value: 'IT',
        label: 'IT',
      },
    ],
  },

  {
    key: 'program',
    label: 'Program / Degree',
    dependsOn: 'department',

    options: {
      ENGINEERING: [
        {
          value: 'BTECH',
          label: 'B.Tech',
        },
      ],

      MANAGEMENT: [
        {
          value: 'MBA',
          label: 'MBA',
        },
        {
          value: 'BBA',
          label: 'BBA',
        },
        {
          value: 'BCOM',
          label: 'B.Com',
        },
      ],

      IT: [
        {
          value: 'MCA',
          label: 'MCA',
        },
        {
          value: 'BCA',
          label: 'BCA',
        },
      ],
    },
  },

  {
    key: 'specialization',
    label: 'Specialization',
    dependsOn: 'department',

    options: {
      ENGINEERING: [
        {
          value: 'CSE',
          label: 'Computer Science & Engineering',
        },
        {
          value: 'IOT',
          label: 'Internet of Things',
        },
        {
          value: 'AI_ML',
          label: 'Artificial Intelligence & Machine Learning',
        },
      ],

      MANAGEMENT: [
        {
          value: 'FINANCE',
          label: 'Finance',
        },
        {
          value: 'MARKETING',
          label: 'Marketing',
        },
        {
          value: 'HR',
          label: 'Human Resource Management',
        },
        {
          value: 'BUSINESS_ANALYTICS',
          label: 'Business Analytics',
        },
      ],

      IT: [
        {
          value: 'SOFTWARE_DEVELOPMENT',
          label: 'Software Development',
        },
        {
          value: 'DATA_SCIENCE',
          label: 'Data Science',
        },
        {
          value: 'AI_ML',
          label: 'Artificial Intelligence & Machine Learning',
        },
        {
          value: 'CYBER_SECURITY',
          label: 'Cyber Security',
        },
        {
          value: 'CLOUD_COMPUTING',
          label: 'Cloud Computing',
        },
      ],
    },
  },

  {
    key: 'academicBatch',
    label: 'Academic Batch',

    options: [
      {
        value: '2023',
        label: '2023',
      },
      {
        value: '2024',
        label: '2024',
      },
      {
        value: '2025',
        label: '2025',
      },
      {
        value: '2026',
        label: '2026',
      },
    ],
  },
];
