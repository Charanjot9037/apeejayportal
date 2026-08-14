import {
  Users,
  ClipboardCheck,
  LayoutGrid,
  UserCircle2,
  FileText,
  GraduationCap,
  Briefcase,
  Settings,
  BadgeCheck,
  BookOpen,
  Calendar,
  HelpCircle,
  LayoutDashboard,
} from 'lucide-react';

export const mentorDashboardData = {
  title: 'Mentor Portal',

  subtitle: 'Academic Year 2024-25',

  profileUrl: '/profile.png',

  // placementReadiness: 85,

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

export const studentSidebarData = {
  title: 'Mentor Portal',
  subtitle: 'Academic Year 2024-25',

  profileUrl: '/profile.png',

  navItems: [
    {
      label: 'Dashboard',
      href: '/mentor/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: LayoutDashboard,
    },
    {
      label: 'Students',
      href: '/mentor/students',
      icon: Users,
    },
    {
      label: 'Sessions',
      href: '/mentor/sessions',
      icon: Calendar,
    },
    {
      label: 'Resources',
      href: '/mentor/resources',
      icon: BookOpen,
    },
  ],

  footer: {
    readiness: 85,

    items: [
      {
        label: 'Help Center',
        href: '/mentor/help',
        icon: HelpCircle,
      },
    ],
  },
};

export const students = [
  {
    id: 1,
    name: 'Alex Mercer',
    project: 'proj1',
    email: 'alex.m@student.edu',
    major: 'Computer Science',
    status: 'Pending Review',
    initials: 'AM',
    action: 'Review Profile',
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    project: 'E-Commerce',
    email: 'sarah.j@student.edu',
    major: 'Business Administration',
    status: 'Pending Review',
    initials: 'SJ',
    action: 'Review Resume',
  },
  {
    id: 3,
    name: 'David Chen',
    project: 'Hospital Management',
    email: 'david.c@student.edu',
    major: 'Engineering',
    status: 'Approved',
    initials: 'DC',
    action: 'View',
  },
];

export const navItems = [
  {
    label: 'Dashboard',
    href: '#',
    icon: LayoutGrid,
    active: true,
  },
  {
    label: 'Portfolio',
    href: '#',
    icon: UserCircle2,
  },
  {
    label: 'Applications',
    href: '#',
    icon: FileText,
  },
  {
    label: 'Mentorship',
    href: '#',
    icon: GraduationCap,
  },
  {
    label: 'Placements',
    href: '#',
    icon: Briefcase,
  },
  {
    label: 'Settings',
    href: '#',
    icon: Settings,
  },
];

export const MENTOR_STAT_CARDS = [
  {
    id: 'assigned-students',
    title: 'Assigned Students',
    value: '24',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#00509d]',
    description: '+2 this semester',
    descriptionColor: 'text-slate-500',
  },

  {
    id: 'pending-approvals',
    title: 'Pending Approvals',
    value: '7',
    icon: ClipboardCheck,
    iconBg: 'bg-orange-50',
    iconColor: 'text-[#f2792a]',
    description: 'Needs your attention',
    descriptionColor: 'text-[#f2792a]',
    highlighted: true,
  },

  {
    id: 'approved-profiles',
    title: 'Approved Profiles',
    value: '15',
    icon: BadgeCheck,
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#00509d]',
    description: 'Ready for placement',
    descriptionColor: 'text-slate-500',
  },
];

import Avatar from '@/app/components/elements/avatar';

export const MENTOR_STUDENTS = [
  {
    id: 'STU001',
    name: 'Alex Mercer',
    email: 'alex.m@student.edu',
    major: 'Computer Science',
    status: 'Pending Review',
    action: 'Review Profile',
  },
  {
    id: 'STU002',
    name: 'Sarah Jenkins',
    email: 'sarah.j@student.edu',
    major: 'Business Admin',
    status: 'Pending Review',
    action: 'Review Resume',
  },
  {
    id: 'STU003',
    name: 'David Chen',
    email: 'david.c@student.edu',
    major: 'Engineering',
    status: 'Approved',
    action: 'View',
  },
];

export const MENTOR_STUDENT_COLUMNS = [
  {
    key: 'student',
    label: 'Student',

    render: (student) => (
      <div className="flex items-center gap-3">
        <Avatar name={student.name} />

        <div>
          <p className="font-semibold text-slate-700">{student.name}</p>

          <p className="text-xs text-slate-400">{student.email}</p>
        </div>
      </div>
    ),
  },

  {
    key: 'major',
    label: 'Major',
  },

  {
    key: 'status',
    label: 'Status',

    render: (student) => (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          student.status === 'Approved'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-orange-500 text-white'
        }`}
      >
        {student.status}
      </span>
    ),
  },

  {
    key: 'action',
    label: 'Actions',

    render: (student) => (
      <button
        type="button"
        className={
          student.status === 'Approved'
            ? 'text-sm font-medium text-blue-600 hover:underline'
            : 'rounded-md border border-primary-orange px-3 py-1.5 text-xs font-medium text-primary-orange hover:bg-orange-50'
        }
      >
        {student.action}
      </button>
    ),
  },
];
