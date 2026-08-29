"use client";

import Image from "next/image";
import Link from "next/link";
import { HelpCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import SidebarOverlay from "@/app/components/elements/sidebarOverlay";

export default function Sidebar({ sidebarData, sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const student = useSelector((state) => state.student);
  const profileUrl = student?.profileImage;
  const handleLogout = async () => {
    try {
      alert("going to log out");

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      dispatch(logout());

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  function handleHelp() {
  router.push("/help");
  }

  const { title, subtitle, role, navItems = [] } = sidebarData;

  const showProfilePicture = role === "student" && profileUrl;

  return (
    <>
      <SidebarOverlay
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col overflow-hidden bg-primary-orange p-5 text-white transition-transform duration-200
          lg:static lg:h-screen lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col items-center gap-2 border-b py-5">
          <div className="flex h-[68px] w-[67px] items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
            {showProfilePicture ? (
              <Image
                src={profileUrl}
                alt={`${title} profile`}
                width={67}
                height={68}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100">
                <span className="text-2xl font-bold text-primary-orange">
                  {title?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm font-bold text-white">{title}</p>
            {auth?.user?.name && (
              <>
                <p className="text-sm font-bold text-white">
                  Hi,{auth?.user?.name}
                </p>
              </>
            )}

            <p className="text-sm font-bold text-white">{subtitle}</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 py-4">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-primary-orange shadow-sm"
                    : "text-white hover:bg-white hover:text-primary hover:shadow-sm"
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
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-primary"
          >
            <HelpCircle className="h-4 w-4" />

            <span>Help Center</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-primary"
          >
            <LogOut className="h-4 w-4" />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
