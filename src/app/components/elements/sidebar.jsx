'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HelpCircle, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/redux/authSlice';
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
    console.log('Help clicked');
  }
  const { title, subtitle, profileUrl, navItems = [] } = sidebarData;

  return (
    <>
      <SidebarOverlay
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <aside
  className={`fixed inset-y-0 left-0 z-40 flex h-screen overflow-hidden w-64 shrink-0 flex-col bg-primary-orange p-5 text-white transition-transform duration-200
    lg:static lg:h-screen lg:translate-x-0
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
>
        <div className=" py-5 flex flex-col gap-2 items-center border-b">
          <div className=" flex  items-center  justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
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

          <div className="text-center flex flex-col gap-2">
            <p className="text-sm font-bold text-white">{title}</p>

            <p className="text-sm font-bold text-white">{subtitle}</p>
          </div>
        </div>

        <nav className="flex py-4 flex-1 flex-col gap-1">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white   text-primary-orange shadow-sm'
                    : 'text-white hover:text-primary hover:bg-white hover:shadow-sm'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-white/20 pt-4">
          <button
            type="button"
            onClick={handleHelp}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium  transition-colors hover:text-primary hover:bg-white"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help Center</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white hover:text-primary hover:bg-white transition-colors hover:bg-white-50 "
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
