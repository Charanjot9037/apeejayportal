// "use client";

// import {
//   GraduationCap,
//   UserRound,
//   CalendarClock,
//   ArrowUpRight,
//   CheckCircle,
//   Eye,
//   FolderKanban,
//   FileSearch,
//   Clock3,
//   CircleCheck,
// } from "lucide-react";

// const iconMap = {
//   GraduationCap,
//   UserRound,
//   CalendarClock,
//   Eye,
//   CheckCircle,
//   FolderKanban,
//   FileSearch,
//   Clock3,
//   CircleCheck,
// };

// export default function StatCards({ cards = [] }) {
//   return (
//     <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
//       {cards.map((card) => {
//         const Icon = iconMap[card.icon];

//         return (
//           <div
//             key={card.id}
//             className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
//           >
//             {/* Header */}
//             <div className="flex items-start justify-between">
//               <p className="text-sm font-medium text-primary-orange">
//                 {card.title}
//               </p>

//               {Icon && (
//                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
//                   <Icon className="h-4 w-4 text-black" strokeWidth={2.25} />
//                 </div>
//               )}
//             </div>

//             {/* Value */}
//             <p className="mt-2 text-3xl font-bold text-[#1c3a5e]">
//               {card.value}
//             </p>

//             {/* Description */}
//             {card.description && (
//               <p className="mt-2 flex items-center gap-1 text-xs font-medium text-black">
//                 <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />

//                 {card.description}
//               </p>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";

import {
  GraduationCap,
  UserRound,
  CalendarClock,
  ArrowUpRight,
  CheckCircle,
  Eye,
  FolderKanban,
  FileSearch,
  Clock3,
  CircleCheck,
} from "lucide-react";

const iconMap = {
  GraduationCap,
  UserRound,
  CalendarClock,
  Eye,
  CheckCircle,
  FolderKanban,
  FileSearch,
  Clock3,
  CircleCheck,
};

export default function StatCards({ cards = [] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconMap[card.icon];

        return (
          <div
            key={card.id}
            onClick={() => card.href && router.push(card.href)}
            className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ${
              card.href
                ? "cursor-pointer hover:-translate-y-1 hover:shadow-md"
                : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-primary-orange">
                {card.title}
              </p>

              {Icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                  <Icon className="h-4 w-4 text-black" strokeWidth={2.25} />
                </div>
              )}
            </div>

            {/* Value */}
            <p className="mt-2 text-3xl font-bold text-[#1c3a5e]">
              {card.value}
            </p>

            {/* Description */}
            {card.description && (
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-black">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />

                {card.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
