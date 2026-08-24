export default function ImportSteps({ step }) {
  return (
    <div className="mb-8 flex bg-white items-center">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
          step >= 1
            ? 'bg-primary-orange text-white'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        1
      </div>

      <div className="mx-3 h-px flex-1 bg-slate-200" />

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
          step >= 2
            ? 'bg-primary-orange text-white'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        2
      </div>

      <div className="mx-3 h-px flex-1 bg-slate-200" />

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
          step >= 3
            ? 'bg-primary-orange text-white'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        3
      </div>
    </div>
  );
}
