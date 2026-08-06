// src/constants/dashboardData.js

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
  Approved: "bg-amber-100 text-amber-800",
  "Changes Requested": "bg-rose-100 text-rose-700",
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
    description:
      "Your master resume has been vetted by the placement cell.",
  },
};