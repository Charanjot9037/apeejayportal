import { Button } from "@/components/ui/button";

function CircularProgress({ value = 85, size = 52, stroke = 5 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FDE7D3"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F2903F"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <span className="text-xs font-semibold text-slate-800">
        {value}%
      </span>
    </div>
  );
}

export default function StudentProfileCard({ strength }) {
  return (
    <div className="mx-3 mb-3 rounded-lg border bg-orange-50 p-3">
      <div className="flex items-center gap-3">
        <CircularProgress value={strength} />

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-800">
            Profile Strength
          </h3>

          <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
            Complete your profile to improve placement visibility.
          </p>
        </div>
      </div>

      <Button
        size="sm"
        className="mt-3 h-8 w-full bg-orange-500 text-xs hover:bg-orange-600"
      >
        Complete Profile
      </Button>
    </div>
  );
}