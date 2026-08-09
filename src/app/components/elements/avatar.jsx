export const AVATAR_PALETTE = [
  'bg-rose-100 text-rose-600',
  'bg-blue-100 text-blue-600',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-600',
  'bg-violet-100 text-violet-600',
];

function hashName(name) {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

export default function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const palette = AVATAR_PALETTE[hashName(name) % AVATAR_PALETTE.length];

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${palette}`}
    >
      {initials}
    </div>
  );
}
