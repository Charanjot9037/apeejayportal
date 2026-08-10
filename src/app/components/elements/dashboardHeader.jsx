'use client';

export default function DashboardHeader({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#1c3a5e]">{title}</h1>

        <div className="mt-1 h-1 w-10 bg-primary-orange" />

        <p className="mt-3 text-sm text-slate-500">{description}</p>
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-2 rounded-lg bg-primary-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#e8641a]"
        >
          {ActionIcon && <ActionIcon className="h-4 w-4" />}

          {actionLabel}
        </button>
      )}
    </div>
  );
}
