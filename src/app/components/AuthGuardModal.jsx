"use client";

import { ShieldAlert, LogIn, X, ArrowLeft } from "lucide-react";

export default function AuthGuardModal({
  open,
  type = "unauthorized",
  message,
  onClose,
  onLogin,
  onBack,
}) {
  if (!open) return null;

  const isAuthError = type === "authentication";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isAuthError ? "bg-orange-100" : "bg-red-100"
            }`}
          >
            {isAuthError ? (
              <LogIn className="text-orange-500" size={24} />
            ) : (
              <ShieldAlert className="text-red-500" size={24} />
            )}
          </div>

          <button
            type="button"
            // onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          {isAuthError ? "Authentication Required" : "Access Denied"}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {message ||
            (isAuthError
              ? "Your session has expired. Please login again."
              : "You are not authorized to access this resource.")}
        </p>

        <div className="mt-5 flex justify-end gap-2">
          {isAuthError ? (
            <button
              type="button"
              onClick={onLogin}
              className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              <LogIn size={16} />
              Login
            </button>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
