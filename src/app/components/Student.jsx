'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle2, Plus, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { STD_CARDS } from "@/constants/studentdashboard";
import { StatCards } from './elements';
import { DashboardHeader } from './elements';
import { ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

import { useSelector } from 'react-redux';
import {
  projects as initialProjects,
  events,
  statusStyles,
  dashboardStats,
} from '@/constants/studentdashboard';
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardContent() {
  const auth = useSelector((state) => state.auth);
  const [projects, setProjects] = useState(initialProjects);
  const [loadingProjects, setLoadingProjects] = useState(true);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const studentId = auth?.user?._id || auth?.user?.id;

        if (!studentId) {
          setLoadingProjects(false);
          return;
        }

        const response = await fetch(`/api/projects?studentId=${studentId}`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch projects');
        }

        setProjects([
          ...result.projects.map((project) => ({
            ...project,

            // MongoDB uses _id
            id: project._id,

            // Keep compatibility with your existing UI
            title: project.title,

            subtitle: project.subtitle,

            status: project.status,
          })),

          ...initialProjects,
        ]);
      } catch (error) {
        console.error('FETCH_PROJECTS_ERROR:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [auth?.user?._id, auth?.user?.id]);
  console.log('AUTH:', auth);
  console.log('USER:', auth?.user);

  // const handleAddProject = async (formData, values) => {
  //   const newProject = {
  //     title: values.title,
  //     subtitle: values.subtitle,
  //     description: values.description,
  //     techStack: values.techStack,
  //     status: values.status,
  //     githubLink: values.githubLink,
  //     liveLink: values.liveLink,
  //     synopsisFile: values.synopsisFile,
  //     reportFile: values.reportFile,
  //   };

  //   setProjects((prev) => [newProject, ...prev]);
  // };

  return (
    <div className="min-h-screen w-full  ">
      <div className=" ">
        {/* Header */}
        <DashboardHeader
          title="Student Dashboard"
          description="Overview of institutional metrics and student management."
          actionLabel="12 Pending Approvals"
          actionIcon={ClipboardCheck}
          onAction={() => console.log("Pending Approvals")}
        />
        {/* <DashboardCards /> */}
        <StatCards cards={STD_CARDS} />

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
