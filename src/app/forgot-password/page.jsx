
"use client";

import React, { useState } from "react";
import { Input, Label, Button } from "@/components/ui";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
      setEmail("");
    } catch (error) {
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">

      {/* Background Image */}
      <div
        className="
          absolute
          inset-0
          bg-[url('/landing-page/image.png')]
          bg-cover
          bg-center
          scale-105
          blur-md
        "
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Optional soft blue overlay */}
      <div className="absolute inset-0 bg-blue-950/20" />

      {/* Forgot Password Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/40
          bg-white
          backdrop-blur-xl
          p-8
          shadow-2xl
          shadow-black/30
        "
      >
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-blue-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5M6 10.5h12a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 0118 20.5H6A1.5 1.5 0 014.5 19v-7A1.5 1.5 0 016 10.5z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Enter your registered email and we'll
            send you a secure password reset link.
          </p>
        </div>
<form onSubmit={handleSubmit} className="space-y-5">
  {!message && (
    <div className="space-y-2">
      <Label htmlFor="email" required>
        Email Address
      </Label>

      <Input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="
          h-12
          border-gray-300
          bg-white/80
          px-4
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
        "
      />
    </div>
  )}

  {/* Success Message */}
  {message && (
    <div className="rounded-xl border-2 border-orange-500 bg-orange-500 px-4 py-3">
      <p className="text-sm font-medium text-white">
        {message}
      </p>
    </div>
  )}

  {/* Error Message */}
  {error && (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm font-medium text-red-600">
        {error}
      </p>
    </div>
  )}

  {/* Submit Button */}
  {!message && (
    <Button
      type="submit"
      disabled={loading}
      className="
        h-12
        w-full
        rounded-sm
        bg-orange-500
        text-white
        font-semibold
        shadow-lg
        shadow-orange-500/25
        transition-all
        cursor-pointer
        duration-200
        hover:bg-orange-600
        hover:shadow-orange-500/40
        hover:-translate-y-0.5
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {loading ? "Sending..." : "Send Reset Link"}
    </Button>
  )}
</form>

        {/* Back to Login */}
        <div className="mt-7 text-center">
          <Link
            href="/login"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-700
              transition
              hover:text-blue-900
            "
          >
            <span>←</span>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;