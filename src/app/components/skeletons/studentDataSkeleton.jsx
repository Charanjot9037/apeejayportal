export default function StudentDataSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-[#f4f7fa]">
      {/* Header Skeleton */}
      <section className="mx-5 mt-5 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:mx-8 lg:mx-16 xl:mx-24">
        <div className="h-2 bg-slate-200" />

        <div className="px-5 py-7 sm:px-7 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center">
            {/* Profile Image */}
            <div className="mx-auto h-28 w-28 shrink-0 rounded-full bg-slate-200 sm:h-32 sm:w-32 lg:mx-0" />

            {/* Student Info */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="mx-auto h-9 w-64 rounded-lg bg-slate-200 lg:mx-0" />

              <div className="mx-auto h-4 w-40 rounded bg-slate-200 lg:mx-0" />

              <div className="mx-auto h-3 w-72 rounded bg-slate-200 lg:mx-0" />

              <div className="flex justify-center gap-2 lg:justify-start">
                <div className="h-9 w-32 rounded-lg bg-slate-200" />
                <div className="h-9 w-28 rounded-lg bg-slate-200" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid w-full grid-cols-2 gap-3 sm:w-[230px]">
              <div className="h-20 rounded-xl bg-slate-200" />
              <div className="h-20 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-9">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-5">
            {/* About */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-200" />
                <div className="h-4 w-20 rounded bg-slate-200" />
              </div>

              <div className="mt-5 space-y-2">
                <div className="h-3 w-full rounded bg-slate-200" />
                <div className="h-3 w-5/6 rounded bg-slate-200" />
                <div className="h-3 w-3/4 rounded bg-slate-200" />
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-200" />
                <div className="h-4 w-36 rounded bg-slate-200" />
              </div>

              <div className="mt-5">
                <div className="mb-3 h-3 w-28 rounded bg-slate-200" />

                <div className="flex flex-wrap gap-2">
                  <div className="h-7 w-16 rounded-lg bg-slate-200" />
                  <div className="h-7 w-20 rounded-lg bg-slate-200" />
                  <div className="h-7 w-14 rounded-lg bg-slate-200" />
                  <div className="h-7 w-24 rounded-lg bg-slate-200" />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 h-3 w-20 rounded bg-slate-200" />

                <div className="flex flex-wrap gap-2">
                  <div className="h-7 w-20 rounded-lg bg-slate-200" />
                  <div className="h-7 w-16 rounded-lg bg-slate-200" />
                </div>
              </div>
            </div>

            {/* Academic */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-200" />
                <div className="h-4 w-40 rounded bg-slate-200" />
              </div>

              <div className="mt-3 space-y-1">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between border-b border-slate-100 py-3"
                  >
                    <div className="h-2.5 w-20 rounded bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Online Presence */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-200" />
                <div className="h-4 w-32 rounded bg-slate-200" />
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="h-14 rounded-xl bg-slate-200" />
                <div className="h-14 rounded-xl bg-slate-200" />
                <div className="h-14 rounded-xl bg-slate-200" />
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <section className="min-w-0">
            {/* Project Overview */}
            <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-200" />
                <div className="h-4 w-32 rounded bg-slate-200" />
              </div>

              <div className="mt-5 space-y-3">
                <div className="h-16 rounded-xl bg-slate-200" />
                <div className="h-16 rounded-xl bg-slate-200" />
                <div className="h-16 rounded-xl bg-slate-200" />
              </div>
            </div>

            {/* Portfolio */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-7 w-48 rounded bg-slate-200" />
                  <div className="h-3 w-64 rounded bg-slate-200" />
                </div>

                <div className="h-14 w-20 rounded-xl bg-slate-200" />
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      {/* Project Image */}
                      <div className="h-[190px] bg-slate-200" />

                      {/* Project Content */}
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <div className="h-5 w-40 rounded bg-slate-200" />
                            <div className="h-3 w-28 rounded bg-slate-200" />
                          </div>

                          <div className="h-8 w-14 rounded-lg bg-slate-200" />
                        </div>

                        <div className="space-y-2">
                          <div className="h-3 w-full rounded bg-slate-200" />
                          <div className="h-3 w-5/6 rounded bg-slate-200" />
                          <div className="h-3 w-3/4 rounded bg-slate-200" />
                        </div>

                        <div className="flex gap-2">
                          <div className="h-6 w-14 rounded-md bg-slate-200" />
                          <div className="h-6 w-20 rounded-md bg-slate-200" />
                          <div className="h-6 w-16 rounded-md bg-slate-200" />
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                          <div className="space-y-2">
                            <div className="h-2.5 w-20 rounded bg-slate-200" />
                            <div className="h-3 w-16 rounded bg-slate-200" />
                          </div>

                          <div className="h-9 w-28 rounded-lg bg-slate-200" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
