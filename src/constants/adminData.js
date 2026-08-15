import {
  LayoutGrid,
  FileText,
  Users,
  Settings,
  GraduationCap,
  UserRound,
  CalendarClock,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

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
    icon: GraduationCap,
    iconBg: 'bg-[#1c3a5e]',
    iconColor: 'text-white',
    description: '+12% this year',
    descriptionColor: 'text-emerald-600',
    trendIcon: ArrowUpRight,
  },

  {
    id: 'mentors',
    title: 'Total Mentors',
    value: '185',
    icon: UserRound,
    iconBg: 'bg-orange-100',
    iconColor: 'text-[#f2792a]',
    description: 'Across 15 departments',
    descriptionColor: 'text-slate-400',
  },

  {
    id: 'recruiters',
    title: 'Active Recruiters',
    value: '342',
    icon: CalendarClock,
    iconBg: 'bg-slate-200',
    iconColor: 'text-slate-600',
    description: '45 new this month',
    descriptionColor: 'text-emerald-600',
    trendIcon: Plus,
  },

  {
    id: 'placement-rate',
    title: 'Placement Rate',
    value: '88%',
    progress: 88,
    progressColor: 'bg-[#f2792a]',
    target: 'Target: 95%',
  },
];

export const STUDENT_STATUS_STYLES = {
  Placed: 'bg-emerald-50 text-emerald-600',
  Looking: 'bg-orange-50 text-[#f2792a]',
  Pending: 'bg-slate-100 text-slate-600',
};

import Avatar from '../app/components/elements/avatar';

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

export const MENTORS = [
  {
    id: 'MEN001',
    name: 'Dr. A.K. Singh',
    role: 'Prof. CSE',
    specialization: 'AI & ML',
    mentees: '12 / 15',
  },
  {
    id: 'MEN002',
    name: 'Ms. Neha Gupta',
    role: 'Industry Expert',
    specialization: 'Cloud Computing',
    mentees: '8 / 10',
    highlight: true,
  },

  {
    id: 'MEN004',
    name: 'Ms. Anjali Mehta',
    role: 'Industry Expert',
    specialization: 'Data Science',
    mentees: '7 / 10',
  },
];

export const STUDENT_COLUMNS = [
  {
    key: 'name',
    label: 'Name',

    render: (student) => (
      <div className="flex items-center gap-3">
        <Avatar name={student.name} />

        <div>
          <p className="font-semibold text-slate-700">{student.name}</p>

          <p className="text-xs text-slate-400">{student.id}</p>
        </div>
      </div>
    ),
  },

  {
    key: 'department',
    label: 'Department',
  },

  {
    key: 'status',
    label: 'Status',

    render: (student) => (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          student.status === 'Placed'
            ? 'bg-emerald-50 text-emerald-600'
            : student.status === 'Looking'
              ? 'bg-orange-50 text-[#f2792a]'
              : 'bg-slate-100 text-slate-600'
        }`}
      >
        {student.status}
      </span>
    ),
  },
];

export const MENTOR_COLUMNS = [
  {
    key: 'name',
    label: 'Name',

    render: (mentor) => (
      <div className="flex items-center gap-3">
        <Avatar name={mentor.name} />

        <div>
          <p className="font-semibold text-slate-700">{mentor.name}</p>

          <p className="text-xs text-slate-400">{mentor.role}</p>
        </div>
      </div>
    ),
  },

  {
    key: 'specialization',
    label: 'Specialization',
  },

  {
    key: 'mentees',
    label: 'Mentees',

    render: (mentor) => (
      <span
        className={
          mentor.highlight ? 'font-semibold text-[#f2792a]' : 'text-slate-600'
        }
      >
        {mentor.mentees}
      </span>
    ),
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
