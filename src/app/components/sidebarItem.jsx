import Link from 'next/link';

export default function SidebarItem({
  href,
  icon: Icon,
  label,
  active = false,
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-orange-500 text-white'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}
