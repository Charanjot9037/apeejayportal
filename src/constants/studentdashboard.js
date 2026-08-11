// src/constants/dashboardData.js
import {
  GraduationCap,
  UserRound,
  CalendarClock,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { FolderKanban, Clock3, Send } from "lucide-react";
export const projects = [
  {
    title: 'AI-Powered Supply Chain Optimizer',
    subtitle: 'Capstone Project • Python, TensorFlow, React',
    status: 'Approved',
  },
  {
    title: 'E-Commerce Microservices Architecture',
    subtitle: 'Cloud Computing Lab • Docker, Kubernetes, Node.js',
    status: 'Changes Requested',
  },
  {
    title: 'Campus Nav AR App',
    subtitle: 'Hackathon 2024 • Unity, ARCore',
    status: 'Draft',
  },
];

export const statusStyles = {
  Approved: 'bg-amber-100 text-amber-800',
  'Changes Requested': 'bg-rose-100 text-rose-700',
  Draft: 'bg-slate-100 text-slate-600',
};

export const events = [
  {
    day: '12',
    month: 'OCT',
    title: 'Mock Interview Drive',
    subtitle: 'TCS & Infosys Panel • Main Auditorium',
    highlighted: true,
  },
  {
    day: '15',
    month: 'OCT',
    title: 'Resume Building Workshop',
    subtitle: 'Placement Cell • Online Webinar',
    highlighted: false,
  },
];

export const dashboardStats = {
  userName: 'Alex',
  profileStrength: 85,
  cgpa: 8.42,
  mentorFeedback: {
    message:
      'Your technical skills on the supply chain project are solid. Focus on improving the abstract summary in your report to better highlight the business impact.',
    mentor: 'Dr. Sharma, Industry Mentor',
  },
  resume: {
    status: 'Resume Approved',
    description: 'Your master resume has been vetted by the placement cell.',
  },
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

export const STD_CARDS = [
  {
    id: "projects",
    title: "Total Projetcs",
    value: "4,250",
    icon: FolderKanban,
    iconBg: "bg-[#1c3a5e]",
    iconColor: "text-white",
    description: "+12% this year",
    descriptionColor: "text-emerald-600",
    trendIcon: ArrowUpRight,
  },

  {
    id: "Pending Projects",
    title: "Pending Projects",
    value: "185",
    icon: Clock3,
    iconBg: "bg-orange-100",
    iconColor: "text-[#f2792a]",
    description: "Across 15 departments",
    descriptionColor: "text-slate-400",
  },

  {
    id: "Under Review",
    title: "Under Review",
    value: "342",
    icon: CalendarClock,
    iconBg: "bg-slate-200",
    iconColor: "text-slate-600",
    description: "45 new this month",
    descriptionColor: "text-emerald-600",
    trendIcon: Plus,
  },

  {
    id: "Submitted",
    title: "submitted",
    value: "2",
    icon: Send,
    iconBg: "bg-green-100",
    progressColor: "bg-[#f2792a]",
    description: "Uploaded on website",
    descriptionColor: "text-emerald-600",
    target: "Target: 95%",
  },
];