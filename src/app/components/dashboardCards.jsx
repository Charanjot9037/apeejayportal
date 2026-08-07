'use client';

import { cards } from './../../constants/mentorData';

export default function DashboardCards() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-xl border ${card.border} bg-white p-5 shadow-sm`}
          >
            <div className="mb-3 flex items-center gap-2">
              <Icon size={18} className={card.iconColor} />

              <span className={`text-sm font-medium ${card.textColor}`}>
                {card.title}
              </span>
            </div>

            <p className="text-3xl font-semibold text-gray-900">{card.value}</p>

            <p className={`mt-1 text-xs ${card.textColor}`}>{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
