
import Image from "next/image";
import Login from "../components/login";

export default function Page() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/landing-page/image.png')",
      }}
    >
      {/* Background overlay + blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Main container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 shadow-2xl grid grid-cols-1 lg:grid-cols-2">

          {/* ========================================= */}
          {/* LEFT SIDE */}
          {/* Hidden on mobile */}
          {/* ========================================= */}

          <section className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-primary px-8 py-10 xl:px-12">

            {/* Subtle decorative background */}
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-orange-500/10 blur-2xl" />

            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl" />

            <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">

              {/* Logo */}
            
                <Image
                  src="/logo.png"
                  alt="Apeejay Logo"
                  width={80}
                  height={80}
                  className="h-32 w-32  rounded-full my-2"
                />
        

              {/* Institute name */}
              <h1 className="text-xl font-bold leading-7 py-3 text-white sm:text-2xl">
                Apeejay Institute of Management &
                Engineering Technical Campus
              </h1>

              <p className="mt-1 text-sm text-blue-100">
                Jalandhar, Punjab
              </p>

              {/* Divider */}
              <div className="my-6 h-px w-20 bg-orange-400/70" />

              {/* Description */}
              <p className="max-w-sm text-sm leading-7 text-blue-100 sm:text-base">
                Join our community of innovators and leaders.
                Start your academic journey and build your
                future with Apeejay.
              </p>

              {/* Small highlight */}
              <div className="mt-7 rounded-lg border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-xs font-medium tracking-wide text-white">
                  Learn • Lead • Innovate
                </p>
              </div>

            </div>
          </section>

          {/* ========================================= */}
          {/* RIGHT SIDE - LOGIN */}
          {/* ========================================= */}

          <section className="flex items-center justify-center bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-10">

            <Login />

          </section>

        </div>
      </div>
    </main>
  );
}