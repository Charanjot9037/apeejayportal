"use client";

import { useState } from "react";
import { hodDashboardData } from "@/constants/hodData";
import { Sidebar } from "../components/elements";

export default function MentorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        sidebarData={hodDashboardData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto ">{children}</main>
    </div>
  );
}
