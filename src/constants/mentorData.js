import { Users, Calendar, LayoutDashboard } from "lucide-react";

export const mentorDashboardData = {
  title: "Mentor Portal",

  profileUrl: "/profile.png",

  navItems: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/mentor-dashboard",
    },
    {
      label: "Students",
      icon: Users,
      href: "/mentor-dashboard/my-students",
    },
  ],
};

export const MENTOR_STAT_CARDS = [
  {
    id: "projects",
    title: "Total Projects",
    icon: "FolderKanban",
    description: "Uploaded Projects",
  },
  {
    id: "approved",
    title: "Approved",
    icon: "CheckCircle",
    description: "Approved Projects",
  },
  {
    id: "pending",
    title: "Pending",
    icon: "CalendarClock",
    description: "Pending Projects",
  },
  {
    id: "inReview",
    title: "In Review",
    icon: "Eye",
    description: "Under review",
  },
];
export const MENTOR_STUDENT_COLUMNS = [
  {
    key: "projectTitle",
    label: "Project Name",
  },
  {
    key: "name",
    label: "Student Name",
  },
  {
    key: "program",
    label: "Program",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "semester",
    label: "Semester",
  },
  {
    key: "status",
    label: "Status",
  },
];

export const MENTOR_STUDENTS = [
  {
    id: "STU001",
    name: "Rahul Sharma",
    major: "Computer Science",
    projectName: "AI Resume Analyzer",
    status: "On Track",
  },
  {
    id: "STU002",
    name: "Priya Singh",
    major: "Information Technology",
    projectName: "Smart Campus Portal",
    status: "Needs Attention",
  },
  {
    id: "STU003",
    name: "Aman Kumar",
    major: "Computer Science",
    projectName: "Healthcare Management System",
    status: "Completed",
  },
];

export const MENTOR_DASHBOARD_HEADER = {
  title: "Mentor Dashboard",
  description:
    "Overview of your mentees, academic progress, and mentoring activities.",
  actionLabel: "5 Pending Reviews",
};
export const MENTORTO_DASHBOARD_HEADER = {
  title: "Mentor Dashboard",
  description: "Overview of your mentees, project progress.",
};

export const MENTOR_STUDENTS_COLUMNS = [
  {
    key: "name",
    label: "Student Name",
  },
  {
    key: "program",
    label: "Program",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "specialization",
    label: "Specialization",
  },
  {
    key: "academicYear",
    label: "Academic Year",
  },
  {
    key: "lastYear",
    label: "Last Year",
  },
  {
    key: "rollNumber",
    label: "Roll No.",
  },
];
