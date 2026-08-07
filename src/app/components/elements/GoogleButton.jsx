"use client";

import { signIn } from "next-auth/react";

export default function GoogleButton() {
  return (
    <button
      type="button"
      onClick={() =>
        signIn("google", {
          callbackUrl: "/",
        })
      }
      className="w-full border rounded-lg p-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
      />

      Continue with Google
    </button>
  );
}