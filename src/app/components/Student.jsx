import React from "react";
import { TrendingUp, CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardCards from '@/app/components/dashboardCards';
import {
  projects,
  events,
  statusStyles,
  dashboardStats,
} from "@/constants/studentdashboard";
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}



export default function DashboardContent() {
  return (
    <div className="min-h-screen w-full bg-[#F7F5F0] p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-blue-900">
            Welcome back, {dashboardStats.userName}.{" "}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here is your academic and placement overview for today.
          </p>
        </div>
        <DashboardCards />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left column */}
        

          {/* Right column */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Card className="border-none bg-blue-950">
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {dashboardStats.resume.status}{" "}
                    </p>
                    <p className="text-sm text-blue-200">
                      {dashboardStats.resume.description}
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
                {dashboardStats.mentorFeedback.message}
                <footer className="mt-2 text-xs font-medium not-italic text-orange-500">
                  — {dashboardStats.mentorFeedback.mentor}{" "}
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
                          : "bg-slate-100 text-slate-600",
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
                      <p className="text-xs text-slate-500">{event.subtitle}</p>
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
