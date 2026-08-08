"use client";

import SidebarItem from "./sidebarItem";
import SidebarOverlay from "./sidebarOverlay";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {logout} from "@/redux/authSlice";
import{  LogOut} from 'lucide-react';
export default function MentorSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarData,
}) {
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
    <>
      <SidebarOverlay
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

<aside
  className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 transform flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:h-full lg:translate-x-0 lg:top-0 lg:translate-x-0 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>

  <div className="flex shrink-0 justify-center  py-5 items-center ">
    <Image src="/profile.png" height={100} width={100} alt="img" className="rounded-full "/>
    {/* <span className="text-lg font-bold text-orange-500">
      {sidebarData.title}
    </span> */}
  </div>

  <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
    {sidebarData.navItems.map((item) => (
      <SidebarItem key={item.label} {...item} />
    ))}
      {sidebarData.customComponent}
  </nav>



  <div className="shrink-0 border-t px-3 py-4">

    {sidebarData.footer.items.map((item) => (
      <SidebarItem key={item.label} {...item} onClick={item.label === "Logout" ? handleLogout : handleLogout} />
    ))}
    <button onClick={handleLogout}>
    <p         
          className={`flex text-gray-600 hover:bg-gray-50 hover:text-gray-900 items-center  gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors `}
        >
          <LogOut size={18} />
          logout
        </p>
    </button>
 
  </div>
</aside>
    </>
  );
}
