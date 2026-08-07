import { Button } from "@/components/ui/button";

function CircularProgress({ value = 85, size = 72, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 absolute"
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

      <span className="text-sm font-semibold text-slate-800">
        {value}%
      </span>
    </div>
  );
}

export default function StudentProfileCard({ strength }) {
  return (
    <div className="mx-3 mb-4 rounded-xl border bg-orange-50 p-4">
      <h3 className="text-sm font-semibold text-slate-800">
        Profile Strength
      </h3>

      <div className="my-4 flex justify-center">
        <CircularProgress value={strength} />
      </div>

      <p className="text-center text-xs text-slate-500">
        Complete your profile to improve placement visibility.
      </p>

      <Button
        size="sm"
        className="mt-4 w-full bg-orange-500 hover:bg-orange-600"
      >
        Complete Profile
      </Button>
    </div>
  );
}