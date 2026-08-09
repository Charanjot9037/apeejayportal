import {
  BookOpen,
  Calendar,
  Trophy,
  HelpCircle,
  LayoutDashboard,
  Users,
  LogOut,
} from 'lucide-react';

export const MENTOR_SIDEBAR_DATA = {
  title: 'Mentor Portal',

  subtitle: 'Academic Year 2024-25',

  profileUrl: '/profile.png',

  placementReadiness: 85,

  navItems: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/mentor/dashboard',
    },
    {
      label: 'Students',
      icon: Users,
      href: '/mentor/students',
    },
    {
      label: 'Sessions',
      icon: Calendar,
      href: '/mentor/sessions',
    },
    {
      label: 'Resources',
      icon: BookOpen,
      href: '/mentor/resources',
    },
  ],
};

export const studentSidebarData = {
  title: 'Mentor Portal',

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
