import React from "react";
import { TrendingUp, CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------
// Circular progress ring for "Profile Strength"
// ---------------------------------------------------------------------

function CircularProgress({ value = 85, size = 132, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FDE7D3"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F2903F"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-semibold text-slate-800">{value}%</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Data (swap for real data from your API)
// ---------------------------------------------------------------------

const projects = [
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

const statusStyles = {
  Approved: "bg-amber-100 text-amber-800",
  "Changes Requested": "bg-rose-100 text-rose-700",
  Draft: "bg-slate-100 text-slate-600",
};

const events = [
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

// ---------------------------------------------------------------------
// Main content (drop this into the ~70% area beside your existing
// left-nav component)
// ---------------------------------------------------------------------

export default function DashboardContent() {
  return (
    <div className="min-h-screen w-full bg-[#F7F5F0] p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-blue-900">
            Welcome back, Alex.
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here is your academic and placement overview for today.
          </p>
        </div>

        {/* Top grid: left column (Profile Strength + CGPA) / right column (Resume + Projects) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <h2 className="mb-4 self-start text-base font-semibold text-blue-900">
                  Profile Strength
                </h2>
                <CircularProgress value={85} />
                <p className="mt-4 text-sm text-slate-500">
                  Your profile is almost ready for top recruiters. Complete
                  your project portfolio.
                </p>
                <Button className="mt-4 w-full bg-orange-500 text-white hover:bg-orange-600">
                  Complete Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Current CGPA</p>
                  <p className="mt-2 text-3xl font-semibold text-orange-500">
                    8.42
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Card className="border-none bg-blue-950">
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Resume Approved
                    </p>
                    <p className="text-sm text-blue-200">
                      Your master resume has been vetted by the placement
                      cell.
                    </p>
                  </div>
                </div>
                <Button className="shrink-0 bg-orange-500 text-white hover:bg-orange-600">
                  View Resume
                </Button>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardContent>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-blue-900">
                    Featured Projects Portfolio
                  </h2>
                  <button className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600">
                    Add Now <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {projects.map((project) => (
                    <div
                      key={project.title}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {project.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {project.subtitle}
                        </p>
                      </div>
                      <Badge className={statusStyles[project.status]}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom row: Mentor Feedback / Upcoming Events */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="mb-3 text-base font-semibold text-blue-900">
                Mentor Feedback
              </h2>
              <blockquote className="rounded-lg border-l-4 border-orange-400 bg-slate-50 p-4 text-sm italic text-slate-600">
                "Your technical skills on the supply chain project are solid.
                Focus on improving the abstract summary in your report to
                better highlight the business impact."
                <footer className="mt-2 text-xs font-medium not-italic text-orange-500">
                  — Dr. Sharma, Industry Mentor
                </footer>
              </blockquote>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="mb-3 text-base font-semibold text-blue-900">
                Upcoming Events
              </h2>
              <div className="flex flex-col gap-3">
                {events.map((event) => (
                  <div key={event.title} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 flex-col items-center justify-center rounded-lg text-xs font-semibold",
                        event.highlighted
                          ? "bg-orange-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      <span className="text-[10px] uppercase">
                        {event.month}
                      </span>
                      <span className="text-base leading-none">
                        {event.day}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {event.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}