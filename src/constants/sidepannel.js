// constants/mentorSidebarData.js

import {

  
  BookOpen,
  Calendar,
  Trophy,
  
  HelpCircle,
  LayoutDashboard,
  Users,
  
  
  LogOut,
} from "lucide-react";

export const mentorSidebarData = {
  title: "Mentor Portal",

  navItems: [
    {
      label: "Dashboard",
      href: "/mentor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Students",
      href: "/mentor/students",
      icon: Users,
    },
    {
      label: "Sessions",
      href: "/mentor/sessions",
      icon: Calendar,
    },
    {
      label: "Resources",
      href: "/mentor/resources",
      icon: BookOpen,
    },
  ],

  footer: {
    readiness: 85,

    items: [
      {
        label: "Help Center",
        href: "/mentor/help",
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



export const studentSidebarData = {
  title: "Mentor Portal",

  navItems: [
    {
      label: "Dashboard",
      href: "/mentor/dashboard",
      icon: LayoutDashboard,
    },
      {
      label: "Profile",
      href: "/profile",
      icon: LayoutDashboard,
    },
    {
      label: "Students",
      href: "/mentor/students",
      icon: Users,
    },
    {
      label: "Sessions",
      href: "/mentor/sessions",
      icon: Calendar,
    },
    {
      label: "Resources",
      href: "/mentor/resources",
      icon: BookOpen,
    },
  ],

  footer: {
    readiness: 85,

    items: [
      {
        label: "Help Center",
        href: "/mentor/help",
        icon: HelpCircle,
      },
    
    ],
  },
};




