import {
  HelpCircle,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Trophy,
  User,
  LogOut,
} from "lucide-react";
import StudentProfileCard from "../app/components/elements/StudentProfileCard";
const dashboardStats = {
  profileStrength: 85,
  // ...
};
export const studentSidebarData = {
  title: "Student Portal",
  role: "student",
  navItems: [
    {
      label: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      href: "/profile",
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
        label: "Help Center",
        href: "/student/help",
        icon: HelpCircle,
      },
    ],
  },
};
