import { Users, Calendar, LayoutDashboard } from 'lucide-react';

export const mentorDashboardData = {
  title: 'Mentor Portal',

  subtitle: 'Academic Year 2024-25',

  profileUrl: '/profile.png',

  navItems: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/mentor-dashboard',
    },
    {
      label: 'Students',
      icon: Users,
      href: '/mentor-dashboard/addStudent',
    },
    {
      label: 'Tools',
      icon: Calendar,
      href: '/mentor/sessions',
    },
  ],
};

export const MENTOR_STAT_CARDS = [
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

export const MENTOR_STUDENT_COLUMNS = [
  {
    key: 'name',
    label: 'Student Name',
  },
  {
    key: 'major',
    label: 'Major',
  },
  {
    key: 'projectName',
    label: 'Project Name',
  },
  {
    key: 'status',
    label: 'Status',
  },
];

export const MENTOR_STUDENTS = [
  {
    id: 'STU001',
    name: 'Rahul Sharma',
    major: 'Computer Science',
    projectName: 'AI Resume Analyzer',
    status: 'On Track',
  },
  {
    id: 'STU002',
    name: 'Priya Singh',
    major: 'Information Technology',
    projectName: 'Smart Campus Portal',
    status: 'Needs Attention',
  },
  {
    id: 'STU003',
    name: 'Aman Kumar',
    major: 'Computer Science',
    projectName: 'Healthcare Management System',
    status: 'Completed',
  },
];

export const MENTOR_DASHBOARD_HEADER = {
  title: 'Mentor Dashboard',
  description:
    'Overview of your mentees, academic progress, and mentoring activities.',
  actionLabel: '5 Pending Reviews',
};
