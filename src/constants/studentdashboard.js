export const projects = [
  {
    title: "AI-Powered Supply Chain Optimizer",
    subtitle: "Capstone Project • Python, TensorFlow, React",
    status: "Approved",
  },
  {
    title: "E-Commerce Microservices Architecture",
    subtitle: "Cloud Computing Lab • Docker, Kubernetes, Node.js",
    status: "Changes Requested",
  },
  {
    title: "Campus Nav AR App",
    subtitle: "Hackathon 2024 • Unity, ARCore",
    status: "Draft",
  },
];

export const statusStyles = {
  "Pending Approval": "bg-yellow-100 text-yellow-700",

  Approved: "bg-green-100 text-green-700",

  Rejected: "bg-red-100 text-red-700",

  Draft: "bg-slate-100 text-slate-600",

};

export const events = [
  {
    day: "12",
    month: "OCT",
    title: "Mock Interview Drive",
    subtitle: "TCS & Infosys Panel • Main Auditorium",
    highlighted: true,
  },
  {
    day: "15",
    month: "OCT",
    title: "Resume Building Workshop",
    subtitle: "Placement Cell • Online Webinar",
    highlighted: false,
  },
];

export const dashboardStats = {
  userName: "Alex",
  profileStrength: 85,
  cgpa: 8.42,
  mentorFeedback: {
    message:
      "Your technical skills on the supply chain project are solid. Focus on improving the abstract summary in your report to better highlight the business impact.",
    mentor: "Dr. Sharma, Industry Mentor",
  },
  resume: {
    status: "Resume Approved",
    description: "Your master resume has been vetted by the placement cell.",
  },
};
export const STD_CARDS = [
  {
    id: "totalprojects",
    title: "Total Projects",
    icon: "FolderKanban",
    description: "Total uploaded projects",
  },
  {
    id: "inReview",
    title: "Under Review",
    icon: "FileSearch",
    description: "Projects under review",
  },
  {
    id: "approved",
    title: "Approved",
    icon: "CircleCheck",
    description: "Approved projects",
  },
  {
    id: "pending",
    title: "Pending",
    icon: "Clock3",
    description: "Pending projects",
  },
];
export const STUDENT_DASHBOARD_HEADER = {
  title: "Student Dashboard",
  description: "Track your academic progress, projects, and career journey.",
  actionLabel: "View My Profile",
};
