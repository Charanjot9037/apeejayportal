import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-lg text-center">
        {/* 404 */}
        <h1 className="text-8xl font-extrabold tracking-tight text-orange-500 sm:text-9xl">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
          Sorry, the page you are looking for doesn&apos;t exist or may have
          been moved.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="mt-7 inline-flex items-center justify-center rounded-md bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
