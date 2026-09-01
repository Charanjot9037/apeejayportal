"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { StatCards, Roster, DashboardHeader } from "@/app/components/elements";

import {
  MENTOR_STAT_CARDS,
  MENTOR_STUDENT_COLUMNS,
  MENTOR_DASHBOARD_HEADER,
} from "@/constants/mentorData";

import { mapMentorProjectToRoster } from "@/mappers/mentor";
import { apiRequest } from "@/lib/apiRequest";
import AuthGuardModal from "../../AuthGuardModal";
import { HOD_DASHBOARD_HEADER } from "@/constants/hodData";

export default function Hod() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authModal, setAuthModal] = useState({
    open: false,
    type: null,
    message: "",
  });

  useEffect(() => {
    const fetchHodProjects = async () => {
      try {
        const result = await apiRequest("/api/projects/mentor", {
          method: "GET",
        });

        console.log("HOD PROJECT RESULT:", result);

        // =========================
        // NOT AUTHENTICATED
        // =========================

        if (result.status === 401) {
          setAuthModal({
            open: true,
            type: "authentication",
            message:
              result.message || "Your session has expired. Please login again.",
          });

          return;
        }

        // =========================
        // NOT AUTHORIZED
        // =========================

        if (result.status === 403) {
          setAuthModal({
            open: true,
            type: "unauthorized",
            message:
              result.message ||
              "You are not authorized to access the HOD dashboard.",
          });

          return;
        }

        // =========================
        // SUCCESS
        // =========================

        const hodProjects = result?.data?.projects || [];

        setProjects(hodProjects);
      } catch (err) {
        console.error("HOD_PROJECT_ERROR:", err);

        setError(
          err.message || "Something went wrong while fetching projects.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHodProjects();
  }, []);

  // =========================
  // ROSTER DATA
  // =========================

  const rosterData = projects.map(mapMentorProjectToRoster);

  // =========================
  // PROJECT COUNTS
  // =========================

  const totalProjects = projects.length;

  const pendingProjects = projects.filter(
    (project) => project.status === "Pending Approval",
  ).length;

  const approvedProjects = projects.filter(
    (project) => project.status === "Approved",
  ).length;

  const inReviewProjects = projects.filter(
    (project) => project.status === "In Review",
  ).length;

  // =========================
  // VIEW PROJECT
  // =========================

  const handleViewProject = (item) => {
    router.push(`/hod-dashboard/projects/${item.id}`);
  };

  // =========================
  // STAT CARDS
  // =========================

  const hodStatCards = MENTOR_STAT_CARDS.map((card) => {
    const values = {
      approved: approvedProjects,
      projects: totalProjects,
      pending: pendingProjects,
      inReview: inReviewProjects,
    };

    return {
      ...card,
      value: values[card.id] ?? 0,
    };
  });

  // =========================
  // DASHBOARD HEADER
  // =========================

  const hodDashboardHeader = {
    ...HOD_DASHBOARD_HEADER,
    actionLabel: `${pendingProjects} Pending Reviews`,
  };

  return (
    <div className="flex h-full">
      <main className="flex-1">
        <DashboardHeader {...hodDashboardHeader} />

        <StatCards cards={hodStatCards} />

        {loading && <p>Loading projects...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <Roster
            title="Project Roster"
            data={rosterData}
            columns={MENTOR_STUDENT_COLUMNS}
            searchPlaceholder="Search students..."
            onRowClick={handleViewProject}
            onViewAll={() => console.log("View all projects")}
            viewAllLabel="View All Projects"
          />
        )}
      </main>

      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() =>
          setAuthModal({
            open: false,
            type: null,
            message: "",
          })
        }
        onLogin={() => router.push("/login")}
        onBack={() => router.back()}
      />
    </div>
  );
}
