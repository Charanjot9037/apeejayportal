export const projects = [
  {
    title: 'AI-Powered Supply Chain Optimizer',
    subtitle: 'Capstone Project • Python, TensorFlow, React',
    status: 'Approved',
  },
  {
    title: 'E-Commerce Microservices Architecture',
    subtitle: 'Cloud Computing Lab • Docker, Kubernetes, Node.js',
    status: 'Changes Requested',
  },
  {
    title: 'Campus Nav AR App',
    subtitle: 'Hackathon 2024 • Unity, ARCore',
    status: 'Draft',
  },
];

export const statusStyles = {
  Approved: 'bg-amber-100 text-amber-800',
  'Changes Requested': 'bg-rose-100 text-rose-700',
  Draft: 'bg-slate-100 text-slate-600',
};

export const events = [
  {
    day: '12',
    month: 'OCT',
    title: 'Mock Interview Drive',
    subtitle: 'TCS & Infosys Panel • Main Auditorium',
    highlighted: true,
  },
  {
    day: '15',
    month: 'OCT',
    title: 'Resume Building Workshop',
    subtitle: 'Placement Cell • Online Webinar',
    highlighted: false,
  },
];

export const dashboardStats = {
  userName: 'Alex',
  profileStrength: 85,
  cgpa: 8.42,
  mentorFeedback: {
    message:
      'Your technical skills on the supply chain project are solid. Focus on improving the abstract summary in your report to better highlight the business impact.',
    mentor: 'Dr. Sharma, Industry Mentor',
  },
  resume: {
    status: 'Resume Approved',
    description: 'Your master resume has been vetted by the placement cell.',
  },
};

export const STD_CARDS = [
  {
    id: 'students',
    title: 'Total Students',
    value: '4,250',
    icon: 'GraduationCap',
    description: '+12% this year',
  },

  {
    id: 'mentors',
    title: 'Total Mentors',
    value: '185',
    icon: 'UserRound',
    description: 'Across 15 departments',
  },

  {
    id: 'recruiters',
    title: 'Active Recruiters',
    value: '342',
    icon: 'CalendarClock',
    description: '45 new this month',
  },

  {
    id: 'placement-rate',
    title: 'Placement Rate',
    value: '88%',
    icon: null,
    description: 'Target: 95%',
  },
];
export const STUDENT_DASHBOARD_HEADER = {
  title: 'Student Dashboard',
  description: 'Track your academic progress, projects, and career journey.',
  actionLabel: 'View My Profile',
};
