'use client';

import { ClipboardCheck } from 'lucide-react';

import Dashboard from '@/app/components/elements/dashboard';
import StatCards from '@/app/components/elements/statCard';
import { useDispatch } from "react-redux";

import {logout} from "@/redux/authSlice";
import DashboardHeader from '@/app/components/elements/dashboardHeader';
import { NAV_ITEMS } from '@/constants/adminData';
import { STAT_CARDS } from '@/constants/adminData';
import { STUDENTS } from '@/constants/adminData';
import { MENTORS } from '@/constants/adminData';
import Roster from '@/app/components/elements/roaster';
import { useRouter } from 'next/navigation';
import RosterTable from '@/app/components/elements/roaster';
import { MENTOR_COLUMNS } from '@/constants/adminData';
import { MENTOR_COLUMNS, STUDENT_COLUMNS } from '@/constants/adminData';
export default function AdminDashboardPage() {
const dispatch=useDispatch();
const router=useRouter();
  const handleLogout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        });
  
        dispatch(logout());
  
      router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Dashboard
        title="Admin Portal"
        subtitle="Academic Year 2024-25"
        profileUrl="/images/admin.png"
        navItems={NAV_ITEMS}
        placementReadiness={85}
        onHelp={() => console.log('Help')}
        onLogout={handleLogout}
      />

      <main className="flex-1 px-8 py-8">
        <DashboardHeader
          title="Admin Dashboard"
          description="Overview of institutional metrics and student management."
          actionLabel="12 Pending Approvals"
          actionIcon={ClipboardCheck}
          onAction={() => console.log('Pending Approvals')}
        />
        <StatCards cards={STAT_CARDS} />
        <div className="grid grid-cols-1 mt-4 gap-6 xl:grid-cols-2">
          <Roster
            title="Student Roster"
            data={STUDENTS}
            columns={STUDENT_COLUMNS}
            searchPlaceholder="Search students by name or ID..."
            onRowClick={(student) => {
              console.log('Student:', student);
            }}
            onViewAll={() => {
              console.log('View all students');
            }}
            viewAllLabel="View All Students"
          />
          <Roster
            title="Mentor Roster"
            data={MENTORS}
            columns={MENTOR_COLUMNS}
            searchPlaceholder="Search mentors..."
            onRowClick={(mentor) => {
              console.log('Mentor:', mentor);
            }}
            onViewAll={() => {
              console.log('View all mentors');
            }}
            viewAllLabel="View All Mentors"
          />
        </div>
      </main>
    </div>
  );
}
