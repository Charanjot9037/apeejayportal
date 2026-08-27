"use client";
import { useState, useEffect } from "react";
import { Plus, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { StatCards } from "./elements";
import { DashboardHeader } from "./elements";

import Link from "next/link";

import { useSelector } from "react-redux";
import {
  projects as initialProjects,
  events,
  statusStyles,
  STD_CARDS,
  STUDENT_DASHBOARD_HEADER,
  dashboardStats,
} from "@/constants/studentdashboard";
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
import { useRouter } from "next/navigation";
export default function DashboardContent() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          credentials: "include", // ensures session cookie is sent
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch projects");
        }

        setProjects(
          result.projects.map((project) => ({
            ...project,
            id: project._id,
            title: project.title,
            subtitle: project.subtitle,
            status: project.status,
          })),
        );
      } catch (error) {
        console.error("FETCH_PROJECTS_ERROR:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const pendingProjects = projects.filter(
    (project) => project.status == "Pending Approval",
  ).length;
  const approvedProjects = projects.filter(
    (project) => project.status == "Approved",
  ).length;
  const inReviewProjects = projects.filter(
    (project) => project.status == "In Review",
  ).length;
  const studentStatCards = STD_CARDS.map((card) => {
    const values = {
      approved: approvedProjects, // put your student count here
      totalprojects: projects.length,
      pending: pendingProjects,
      inReview: inReviewProjects,
    };

    return {
      ...card,
      value: values[card.id],
    };
  });
  return (
    <div className="min-h-screen w-full  ">
      <div className=" ">
        <DashboardHeader
          {...STUDENT_DASHBOARD_HEADER}
          onAction={() => {
            router.push("/profile");
          }}
        />
        {/* <DashboardCards /> */}
        <StatCards cards={studentStatCards} />

        <div className="grid grid-cols-1 mt-4 gap-5 lg:grid-cols-3">
          {/* Left column */}

          {/* Right column */}
          <div className="flex flex-col  gap-5 lg:col-span-4">
            <Card className="flex-1">
              <CardContent>
                <div className=" flex border-b-2 p-1 items-center justify-between">
                  <h2 className="text-base font-semibold text-primary">
                    Featured Projects Portfolio
                  </h2>
                  <Link href="/student/projects/add">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 text-sm font-medium bg-primary-orange text-white hover:text-orange-600"
                    >
                      Add Now
                      <Plus className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {loadingProjects ? (
                    <div className="py-6 text-center text-sm text-slate-400">
                      Loading projects...
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="py-6 text-center text-sm text-slate-400">
                      No projects added yet.
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project._id || project.id || project.title}
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

                        <div className="flex items-center gap-3">
                          <Badge
                            className={
                              statusStyles[project.status] ||
                              "bg-slate-100 text-slate-600"
                            }
                          >
                            {project.status}
                          </Badge>

                          <Link href={`/student/projects/${project._id}`}>
                            <Button
                              variant="ghost"
                              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-orange-500"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom row: Mentor Feedback / Upcoming Events */}
        {/* <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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
        </div> */}
      </div>
    </div>
  );
}
