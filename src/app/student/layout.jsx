"use client";

import { useState } from "react";
import MentorSidebar from "../components/mentorSidebar";
import {studentSidebarData} from "@/constants/studentslidebar";
export default function MentorLayout({ children }) {
 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full bg-[#f7f6f4]">
    {/* <StudentProfileCard strength={dashboardStats.profileStrength} /> */}
      <MentorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarData={studentSidebarData}
      />
  <main className="flex-1 overflow-y-auto p-5">{children}</main>
    </div>
  );
}
