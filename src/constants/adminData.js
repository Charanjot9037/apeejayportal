import {
  LayoutGrid,
  User,
  FileText,
  Users,
  Briefcase,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: LayoutGrid,
    active: true,
  },
  {
    label: 'Portfolio',
    icon: User,
    active: false,
  },
  {
    label: 'Applications',
    icon: FileText,
    active: false,
  },
  {
    label: 'Mentorship',
    icon: Users,
    active: false,
  },
  {
    label: 'Placements',
    icon: Briefcase,
    active: false,
  },
  {
    label: 'Settings',
    icon: Settings,
    active: false,
  },
];

export const STUDENTS = [
  {
    name: 'Rahul Sharma',
    id: 'CS2021045',
    department: 'CSE',
    status: 'Placed',
  },
  {
    name: 'Priya Patel',
    id: 'EE2021112',
    department: 'Electrical',
    status: 'Available',
  },
];

export const STUDENT_STATUS_STYLES = {
  Placed: 'bg-orange-50 text-[#f2792a]',
  Available: 'bg-slate-100 text-slate-500',
};

export const MENTORS = [
  {
    name: 'Dr. A.K. Singh',
    role: 'Prof. CSE',
    specialization: 'AI & ML',
    mentees: '12 / 15',
  },
  {
    name: 'Ms. Neha Gupta',
    role: 'Industry Expert',
    specialization: 'Cloud Computing',
    mentees: '8 / 10',
    highlight: true,
  },
];
