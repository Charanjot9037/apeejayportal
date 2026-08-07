import {
  Users,
  ClipboardCheck,
  LayoutGrid,
  UserCircle2,
  FileText,
  GraduationCap,
  Briefcase,
  Settings,
  CheckCircle2,
} from 'lucide-react';
export const cards = [
  {
    title: 'Assigned Students',
    value: 24,
    subtitle: '+2 this semester',
    icon: Users,
    border: 'border-gray-200',
    iconColor: 'text-[#1E3A5F]',
    textColor: 'text-[#1E3A5F]',
  },
  {
    title: 'Pending Approvals',
    value: 7,
    subtitle: 'Needs your attention',
    icon: ClipboardCheck,
    border: 'border-orange-500',
    iconColor: 'text-orange-500',
    textColor: 'text-orange-500',
  },
  {
    title: 'Approved Profiles',
    value: 15,
    subtitle: 'Ready for placement',
    icon: CheckCircle2,
    border: 'border-gray-200',
    iconColor: 'text-[#1E3A5F]',
    textColor: 'text-[#1E3A5F]',
  },
];

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
