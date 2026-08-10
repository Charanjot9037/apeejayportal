'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HelpCircle, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import SidebarOverlay from '@/app/components/elements/sidebarOverlay';

export default function Sidebar({ sidebarData, sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      alert('going to log out');

      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      dispatch(logout());

      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  function handleHelp() {
    // Implement your help logic here
    console.log('Help clicked');
  }
  const {
    title,
    subtitle,
    profileUrl,
    navItems = [],
    placementReadiness,
  } = sidebarData;

  return (
    <>
      <SidebarOverlay
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col border-r border-slate-100 bg-white p-5 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex flex-col items-center">
          <div className=" flex  items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={`${title} profile`}
                width={67}
                height={68}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-100" />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-bold text-[#1c3a5e]">{title}</p>

            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive =
              pathname === href ||
              (href !== '/' && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-orange   text-white shadow-sm'
                    : 'text-slate-600 hover:bg-primary-orange hover:text-white hover:shadow-sm'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {placementReadiness !== undefined && (
          <div className="mb-4 rounded-lg  mt-34 px-3 py-2 text-center text-xs font-semibold text-primary-orange">
            Placement Readiness: {placementReadiness}%
          </div>
        )}

        <div className="flex flex-col bottom-0 gap-1  h-64 w-58 bg-white border-slate-100 p-t-10 mt-4">
          <button
            type="button"
            onClick={handleHelp}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help Center</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
