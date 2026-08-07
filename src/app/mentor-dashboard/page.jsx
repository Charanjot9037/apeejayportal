import DashboardHeader from '@/app/components/dashboardHeader';
import DashboardCards from '@/app/components/dashboardCards';
import StudentTable from '@/app/components/studentTable';

export default function MentorDashboard() {
  return (
    <div className="p-8">
      <DashboardHeader />
      <DashboardCards />
      <StudentTable />
    </div>
  );
}
