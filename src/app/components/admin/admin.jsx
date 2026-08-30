"use client";
import { StatCards, DashboardHeader } from "@/app/components/elements";
import AdminStats from "./adminStats";

import { useEffect, useState } from "react";

import { ADMIN_DASHBOARD_HEADER } from "@/constants/adminData";

export default function Admin() {
  const [stats, setStats] = useState({
    students: 0,
    mentors: 0,
    projects: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch statistics");
        }

        setStats(result.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dynamicStatCards = [
    {
      id: "students",
      title: "Total Students",
      value: stats.students.toLocaleString(),
      icon: "GraduationCap",
      description: "Total registered students",
    },
    {
      id: "mentors",
      title: "Total Mentors",
      value: stats.mentors.toLocaleString(),
      icon: "UserRound",
      description: "Total registered mentors",
    },
    {
      id: "projects",
      title: "Total Projects",
      value: stats.projects.toLocaleString(),
      icon: "FolderKanban",
      description: "Total projects",
    },
  ];

  return (
    <div className="flex h-full">
      <main className="flex-1 sm:pd-6 lg:p-3">
        <DashboardHeader
          {...ADMIN_DASHBOARD_HEADER}
          onAction={() => console.log("Pending Approvals")}
        />

        {loading ? (
          <div className="mt-6">Loading statistics...</div>
        ) : (
          <StatCards cards={dynamicStatCards} />
        )}

        <AdminStats />
      </main>
    </div>
  );
}
