import {
  HelpCircle,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Trophy,
  User,
  LogOut,
} from 'lucide-react';
import StudentProfileCard from '../app/components/elements/StudentProfileCard';
const dashboardStats = {
  profileStrength: 85,
  // ...
};
export const studentSidebarData = {
  title: 'Student Portal',
  subtitle: 'Academic Year 2024-25',

  profileUrl: '/profile.png',

  navItems: [
    {
      label: 'Dashboard',
      href: '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Courses',
      href: '/student/courses',
      icon: BookOpen,
    },
    {
      label: 'Schedule',
      href: '/student/schedule',
      icon: Calendar,
    },
    {
      label: 'Achievements',
      href: '/student/achievements',
      icon: Trophy,
    },
    {
      label: 'profile',
      href: '/student/profile',
      icon: User,
    },
  ],
  customComponent: (
    <StudentProfileCard strength={dashboardStats.profileStrength} />
  ),

  footer: {
    readiness: 65,

    items: [
      {
        label: 'Help Center',
        href: '/student/help',
        icon: HelpCircle,
      },
    ],
  },
};
