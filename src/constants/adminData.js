import { LayoutGrid, FileText, Users } from 'lucide-react';

export const adminDashboardData = {
  title: 'Admin Portal',

  subtitle: 'Academic Year 2024-25',

  profileUrl: '/profile.png',

  placementReadiness: 85,

  navItems: [
    {
      label: 'Dashboard',
      icon: LayoutGrid,
      href: '/admin-dashboard',
    },
    {
      label: 'Students',
      icon: Users,
      href: '/admin-dashboard/student',
    },
    {
      label: 'Mentor',
      icon: FileText,
      href: '/mentor-dashboard/applications',
    },
    {
      label: 'Tools',
      icon: FileText,
      href: '/admin-dashboard/tools',
    },
  ],
};
export const STAT_CARDS = [
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

export const STUDENTS = [
  {
    id: 'STU001',
    name: 'Rahul Sharma',
    department: 'Computer Science',
    status: 'Placed',
  },
  {
    id: 'STU002',
    name: 'Priya Singh',
    department: 'Information Technology',
    status: 'Looking',
  },
  {
    id: 'STU003',
    name: 'Aman Kumar',
    department: 'Computer Science',
    status: 'Placed',
  },
];
export const STUDENT_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'department',
    label: 'Department',
  },
  {
    key: 'status',
    label: 'Status',
  },
];
export const MENTOR_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'specialization',
    label: 'Specialization',
  },

  {
    key: 'mentees',
    label: 'Mentees',
  },
];

export const MENTORS = [
  {
    id: 'MEN001',
    name: 'Dr. A.K. Singh',
    specialization: 'AI & ML',
    mentees: '12 / 15',
  },
  {
    id: 'MEN002',
    name: 'Ms. Neha Gupta',
    specialization: 'Cloud Computing',
    mentees: '8 / 10',
    highlight: true,
  },
  {
    id: 'MEN004',
    name: 'Ms. Anjali Mehta',

    specialization: 'Data Science',
    mentees: '7 / 10',
  },
];

export const designationOptions = [
  {
    value: 'Assistant Professor',
    label: 'Assistant Professor',
  },
  {
    value: 'HOD',
    label: 'HOD',
  },
  {
    value: 'Dean',
    label: 'Dean',
  },
  {
    value: 'TPO',
    label: 'TPO',
  },
];
export const ADMIN_DASHBOARD_HEADER = {
  title: 'Admin Dashboard',
  description: 'Overview of institutional metrics and student management.',
  actionLabel: '12 Pending Approvals',
};
