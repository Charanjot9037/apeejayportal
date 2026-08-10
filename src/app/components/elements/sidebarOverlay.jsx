export default function SidebarOverlay({ sidebarOpen, setSidebarOpen }) {
  if (!sidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30 bg-black/30 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  );
}
