"use client";

import { useRef } from "react";
import { Pencil } from "lucide-react";

export default function ProfileHeader({
  name = "Alex Johnson",
  subtitle = "Computer Science Student | Class of 2025",
  image = "",
  completion = 85,
  editable = true,
  onImageChange,
}) {
  const fileInputRef = useRef(null);

  const safeCompletion = Math.min(
    100,
    Math.max(0, completion)
  );

  const handleImageClick = () => {
    if (!editable) return;

    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Optional: send file to parent
    if (onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-4">
        {/* =========================================
            LEFT SIDE
        ========================================== */}

        <div className="flex min-w-0 items-center gap-3.5">
          {/* =======================================
              PROFILE IMAGE
          ======================================== */}

          <div className="relative shrink-0">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-100 sm:h-15 sm:w-15">
              {image ? (
                <img
                  src={image}
                  alt={`${name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-400">
                  {getInitials(name)}
                </div>
              )}
            </div>

            {/* =====================================
                IMAGE EDIT PEN
            ====================================== */}

            {editable && (
              <>
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow-sm transition hover:bg-orange-600"
                  aria-label="Change profile image"
                >
                  <Pencil size={10} strokeWidth={2.5} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* =======================================
              NAME + SUBTITLE
          ======================================== */}

          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="truncate text-xl font-semibold leading-6 text-blue-900 sm:text-2xl">
              {name || "Your Name"}
            </h2>

            <p className="truncate text-xs text-gray-500 sm:text-sm">
              {subtitle || "Complete your profile"}
            </p>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE
            ONLY PROFILE COMPLETION
        ========================================== */}

        <div className="hidden w-48 shrink-0 sm:block">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs text-gray-700">
              Profile Completion
            </span>

            <span className="text-sm font-medium text-orange-500">
              {safeCompletion}%
            </span>
          </div>

          {/* PROGRESS BACKGROUND */}

          <div className="h-1 w-full overflow-hidden rounded-full bg-[#e8e8e8]">
            {/* PROGRESS */}

            <div
              className="h-full rounded-full bg-[#ff8b24] transition-all duration-500"
              style={{
                width: `${safeCompletion}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE COMPLETION
      ========================================== */}

      <div className="mt-3 block sm:hidden">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-gray-700">
            Profile Completion
          </span>

          <span className="text-sm font-medium text-orange-500">
            {safeCompletion}%
          </span>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-full bg-[#e8e8e8]">
          <div
            className="h-full rounded-full bg-[#ff8b24] transition-all duration-500"
            style={{
              width: `${safeCompletion}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* =================================================
   GET INITIALS
================================================= */

function getInitials(name) {
  if (!name) return "U";

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}