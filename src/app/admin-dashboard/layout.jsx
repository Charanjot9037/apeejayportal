"use client";

import { useState } from "react";
import { adminDashboardData } from "@/constants/adminData";
import { Sidebar } from "../components/elements";

export default function MentorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        sidebarData={adminDashboardData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto pt-[68px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}
