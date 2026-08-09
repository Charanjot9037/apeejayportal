import AdminSidebar from '@/app/components/admin/adminSidebar';
import DashboardHeader from '@/app/components/admin/dashboardHeader';
import StatCards from '@/app/components/admin/statCard';
import StudentRoster from '@/app/components/admin/studentRoster';
import MentorRoster from '@/app/components/admin/mentorRoster';
export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 px-8 py-8">
        <DashboardHeader />

        <StatCards />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <StudentRoster />
          <MentorRoster />
        </div>
      </main>
    </div>
  );
}
