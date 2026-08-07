import {
  HelpCircle,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Trophy,
  LogOut,
} from 'lucide-react';
import StudentProfileCard from '../app/components/elements/StudentProfileCard';
 const dashboardStats = {
  profileStrength: 85,
  // ...
};
export const studentSidebarData = {
  title: "Student Portal",

  navItems: [
    {
      label: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Courses",
      href: "/student/courses",
      icon: BookOpen,
    },
    {
      label: "Schedule",
      href: "/student/schedule",
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
      {
        label: "Logout",
        href: "/logout",
        icon: LogOut,
      },
    ],
  },
};