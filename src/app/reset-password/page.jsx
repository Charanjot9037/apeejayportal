
"use client";

import React, { useState } from "react";
import { Input, Label, Button } from "@/components/ui";
import { Eye, EyeOff, Check, X } from "lucide-react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

/*
 * Password validation schema
 */
const passwordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(
      8,
      "Password must be at least 8 characters",
    )
    .max(
      64,
      "Password must not exceed 64 characters",
    )
    
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf(
      [Yup.ref("password")],
      "Passwords do not match",
    ),
});

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [serverError, setServerError] =
    useState("");

  /*
   * Formik
   */
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    passwordSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setMessage("");
      setServerError("");

      /*
       * Check reset token
       */
      if (!token) {
        setServerError(
          "Invalid password reset link.",
        );
        setSubmitting(false);
        return;
      }

      try {
        const response = await fetch(
          "/api/auth/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
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

        /*
         * Redirect to login after 2 seconds
         */
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

  /*
   * Password rules
   */
  const password =
    formik.values.password;

  const passwordRules = {
    minLength: password.length >= 8,

    maxLength:
      password.length > 0 &&
      password.length <= 64,

    uppercase: /[A-Z]/.test(password),

    lowercase: /[a-z]/.test(password),

    number: /[0-9]/.test(password),

    special: /[^A-Za-z0-9]/.test(password),
  };

  /*
   * Password requirement component
   */
  const PasswordRequirement = ({
    valid,
    children,
  }) => {
    return (
      <div className="flex items-center gap-2 text-sm">
        {valid ? (
          <Check
            size={16}
            className="text-green-600"
          />
        ) : (
          <X
            size={16}
            className="text-gray-400"
          />
        )}

        <span
          className={
            valid
              ? "text-green-600"
              : "text-gray-500"
          }
        >
          {children}
        </span>
      </div>
    );
  };

  /*
   * Password match status
   */
  const passwordsMatch =
    password.length > 0 &&
    formik.values.confirmPassword.length > 0 &&
    password ===
      formik.values.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 shadow-xl shadow-blue-300/40 p-8">

        {/* Header */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">
            Reset Password
          </h1>

          <p className="mt-2 text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {/* Invalid Token */}

        {!token ? (
          <p className="text-red-500">
            Invalid password reset link.
          </p>
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-5"
          >

            {/* Password */}

            <div className="space-y-2">
              <Label
                htmlFor="password"
                required
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
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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

              {/* Password requirements */}

              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-1.5">

                <p className="text-sm font-medium text-gray-700 mb-2">
                  Password must contain:
                </p>

                <PasswordRequirement
                  valid={
                    passwordRules.minLength
                  }
                >
                  At least 8 characters
                </PasswordRequirement>

                <PasswordRequirement
                  valid={
                    passwordRules.maxLength
                  }
                >
                  Maximum 64 characters
                </PasswordRequirement>

                <PasswordRequirement
                  valid={
                    passwordRules.uppercase
                  }
                >
                  At least one uppercase letter
                </PasswordRequirement>

                <PasswordRequirement
                  valid={
                    passwordRules.lowercase
                  }
                >
                  At least one lowercase letter
                </PasswordRequirement>

                <PasswordRequirement
                  valid={
                    passwordRules.number
                  }
                >
                  At least one number
                </PasswordRequirement>

                <PasswordRequirement
                  valid={
                    passwordRules.special
                  }
                >
                  At least one special character
                </PasswordRequirement>

              </div>

              {/* Formik password error */}

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
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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

              {/* Password match indicator */}

              {formik.values
                .confirmPassword.length >
                0 && (
                <div className="flex items-center gap-2 text-sm">
                  {passwordsMatch ? (
                    <>
                      <Check
                        size={16}
                        className="text-green-600"
                      />

                      <span className="text-green-600">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <X
                        size={16}
                        className="text-red-500"
                      />

                      <span className="text-red-500">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Formik confirm password error */}

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
              <p className="text-red-500 text-sm">
                {serverError}
              </p>
            )}

            {/* Success Message */}

            {message && (
              <p className="text-green-600 text-sm">
                {message}
              </p>
            )}

            {/* Submit Button */}

            <Button
              type="submit"
              disabled={
                formik.isSubmitting ||
                !formik.isValid
              }
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting
                ? "Updating..."
                : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;