
"use client";

import React, { useState } from "react";
import { Input, Label, Button } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { passwordSchema } from "@/validations/passwordSchema";


const ResetPassword = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [serverError, setServerError] =
    useState("");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: passwordSchema,

 onSubmit: async (
  values,
  { setSubmitting, resetForm },
) => {
  setMessage("");
  setServerError("");

  try {
    const response = await fetch(
      "/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.password,
          confirmPassword:
            values.confirmPassword,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to reset password.",
      );
    }

    setMessage(data.message);

    resetForm();

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    setServerError(
      error.message ||
        "Something went wrong. Please try again.",
    );
  } finally {
    setSubmitting(false);
  }
},
  });

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('/landing-page/image.png')",
      }}
    >
      {/* Background overlay + blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      {/* Reset password card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/40 bg-white p-8">
          {/* Header */}

          <div className="mb-7">
            <h1 className="text-3xl font-bold text-gray-900">
              Reset Password
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-5"
          >
            {/* Password */}

            <div className="space-y-2">
              <Label
                htmlFor="password"
                required
                className="text-gray-800"
              >
                New Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  value={
                    formik.values.password
                  }
                  maxLength={64}
                  onChange={
                    formik.handleChange
                  }
                  onBlur={
                    formik.handleBlur
                  }
                  className="pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {formik.touched.password &&
                formik.errors.password && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.password}
                  </p>
                )}
            </div>

            {/* Confirm Password */}

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                required
                className="text-gray-800"
              >
                Confirm Password
              </Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm new password"
                  value={
                    formik.values
                      .confirmPassword
                  }
                  maxLength={64}
                  onChange={
                    formik.handleChange
                  }
                  onBlur={
                    formik.handleBlur
                  }
                  className="pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {formik.touched
                .confirmPassword &&
                formik.errors
                  .confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {
                      formik.errors
                        .confirmPassword
                    }
                  </p>
                )}
            </div>

            {/* Server Error */}

            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-red-600 text-sm">
                  {serverError}
                </p>
              </div>
            )}

            {/* Success Message */}

            {message && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-green-600 text-sm">
                  {message}
                </p>
              </div>
            )}

            {/* Submit Button */}

            <Button
              type="submit"
              disabled={
                formik.isSubmitting ||
                !formik.isValid
              }
              className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting
                ? "Updating..."
                : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;