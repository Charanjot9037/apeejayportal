
"use client";

import { useEffect, useState } from "react";
import { hodDashboardData } from "@/constants/hodData";
import { Sidebar } from "../components/elements";

export default function MentorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [hod, setHod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHODData = async () => {
      try {
        const response = await fetch("/api/hod/dashboard", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          // No filters for sidebar
          body: JSON.stringify({}),
        });

        // Safely read JSON
        const text = await response.text();

        if (!text) {
          throw new Error(
            "Empty response received from HOD dashboard API"
          );
        }

        let result;

        try {
          result = JSON.parse(text);
        } catch (jsonError) {
          console.error(
            "HOD SIDEBAR NON-JSON RESPONSE:",
            text
          );

          throw new Error(
            "Invalid JSON response from HOD dashboard API"
          );
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch HOD data"
          );
        }

        console.log(
          "HOD SIDEBAR DATA:",
          result.hod
        );

        setHod(result.hod);
      } catch (error) {
        console.error(
          "HOD SIDEBAR ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHODData();
  }, []);

  // ==========================================
  // REAL-TIME SIDEBAR DATA
  // ==========================================

  const sidebarData = {
    ...hodDashboardData,

    // Keep existing navigation
    navItems: hodDashboardData.navItems,

    // Keep HOD data available
    ...(hod && {
      hod,
    }),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        sidebarData={sidebarData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
