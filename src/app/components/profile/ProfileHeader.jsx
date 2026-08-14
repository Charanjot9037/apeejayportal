"use client";

import { useRef } from "react";
import { Pencil } from "lucide-react";

export default function ProfileHeader({
  name = "Alex Johnson",
  subtitle = "Computer Science Student | Class of 2025",
  image = "",
  completion,
  editable = true,
  onImageChange,
  imageLoading = false,
}) {
  const fileInputRef = useRef(null);

  const safeCompletion = Math.min(100, Math.max(0, Number(completion) || 0));

  const handleImageClick = () => {
    if (!editable || imageLoading) return;

    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (onImageChange) {
      onImageChange(file);
    }

    // Allow selecting the same image again
    event.target.value = "";
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-4">
        {/* LEFT SIDE */}
        <div className="flex min-w-0 items-center gap-3.5">
          {/* PROFILE IMAGE */}
          <div className="relative shrink-0">
            <div className="relative h-16 w-16 shrink-0">
              <div className="h-full w-full overflow-hidden rounded-full bg-gray-100">
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
            </div>

            {/* IMAGE EDIT BUTTON */}
            {editable && (
              <>
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={imageLoading}
                  className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                  aria-label="Change profile image"
                >
                  {imageLoading ? (
                    <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Pencil size={10} strokeWidth={2.5} />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  disabled={imageLoading}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* NAME + SUBTITLE */}
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="truncate text-xl font-semibold leading-6 text-blue-900 sm:text-2xl">
              {name || "Your Name"}
            </h2>

            <p className="truncate text-xs text-gray-500 sm:text-sm">
              {subtitle || "Complete your profile"}
            </p>
          </div>
        </div>

        {/* PROFILE COMPLETION */}
        <div className="hidden w-48 shrink-0 sm:block">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs text-gray-700">Profile Completion</span>

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

      {/* MOBILE COMPLETION */}
      <div className="mt-3 block sm:hidden">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-gray-700">Profile Completion</span>

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
