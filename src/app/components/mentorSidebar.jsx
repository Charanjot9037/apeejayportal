"use client";

import SidebarItem from "./sidebarItem";
import SidebarOverlay from "./sidebarOverlay";

export default function MentorSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarData,
}) {
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

  <div className="flex shrink-0 items-center gap-2 border-b px-6 py-5">
    <span className="text-lg font-bold text-orange-500">
      {sidebarData.title}
    </span>
  </div>

  <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
    {sidebarData.navItems.map((item) => (
      <SidebarItem key={item.label} {...item} />
    ))}
  </nav>

  {sidebarData.customComponent}

  <div className="shrink-0 border-t px-3 py-4">
    <p className="mb-4 text-sm">
      Placement Readiness
      <span className="ml-2 font-bold text-orange-500">
        {sidebarData.footer.readiness}%
      </span>
    </p>

    {sidebarData.footer.items.map((item) => (
      <SidebarItem key={item.label} {...item} />
    ))}
  </div>
</aside>
    </>
  );
}
