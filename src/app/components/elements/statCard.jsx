'use client';

export default function StatCards({ cards = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;

        return (
          <div
            key={card.id || card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>

              {card.icon && (
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    card.iconBg || 'bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${card.iconColor || 'text-slate-600'}`}
                    strokeWidth={2.25}
                  />
                </div>
              )}
            </div>

            {/* Value */}
            {card.value !== undefined && (
              <p className="mt-2 text-3xl font-bold text-[#1c3a5e]">
                {card.value}
              </p>
            )}

            {/* Trend / Description */}
            {card.description && (
              <p
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                  card.descriptionColor || 'text-slate-400'
                }`}
              >
                {TrendIcon && (
                  <TrendIcon className="h-3.5 w-3.5" strokeWidth={2} />
                )}

                {card.description}
              </p>
            )}

            {/* Progress Card */}
            {card.progress !== undefined && (
              <>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      card.progressColor || 'bg-[#f2792a]'
                    }`}
                    style={{
                      width: `${card.progress}%`,
                    }}
                  />
                </div>

                {card.target && (
                  <p className="mt-2 text-right text-xs text-slate-400">
                    {card.target}
                  </p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
