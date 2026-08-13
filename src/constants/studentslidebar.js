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
  title: "Student Portal",
  subtitle: "Academic Year 2024-25",

  profileUrl: "/profile.png",

  navItems: [
    {
      label: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: BookOpen,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      label: "Resume",
      href: "/student/resume",
      icon: Calendar,
    },
    {
      label: "Achievements",
      href: "/student/achievements",
      icon: Trophy,
    },
  ],
  customComponent: (
    <StudentProfileCard strength={dashboardStats.profileStrength} />
  ),

  footer: {
    readiness: 65,

    items: [
      {
        label: "Help Center",
        href: "/student/help",
        icon: HelpCircle,
      },
    ],
  },
};
