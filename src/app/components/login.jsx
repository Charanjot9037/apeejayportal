"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input, Label, Button } from "@/components/ui";
import { useFormik } from "formik";
import { loginSchema } from "@/validations/loginSchema";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";

import { DashboardHeader } from "./elements";
import { setStudentProfile } from "@/redux/studentSlice";
import { setMentorProfile } from "@/redux/mentorSlice";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema,

    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        console.log("data", data);

        if (!response.ok) {
          throw new Error(data.message);
        }

        dispatch(
          loginSuccess({
            user: data.user,
            name: data.name,
            email: data.email,
            role: data.role,
          }),
        );

        // dispatch(
        //   setStudentProfile({
        //     department: data.user?.department,
        //     program: data.user?.program,
        //     academicBatch: data?.user?.academicBatch,
        //     profileImage: data?.user?.profileImage,
        //   }),
        // );
        if (data?.user?.role === "student") {
          dispatch(
            setStudentProfile({
              department: data.user?.department,
              program: data.user?.program,
              academicBatch: data.user?.academicBatch,
              profileImage: data.user?.profileImage,
            }),
          );
        }

        // ==========================================
        // MENTOR REDUX
        // ==========================================

        if (data?.user?.role === "mentor") {
          dispatch(
            setMentorProfile({
              id: data.user?.id,
              name: data.user?.name,
              email: data.user?.email,
              department: data.user?.mentorDepartment,
              designation: data.user?.designation,
            }),
          );
        }
        const role = data?.user?.role;
        const designation = data?.user?.designation;
        console.log("designation: ", designation);

        switch (role) {
          case "student":
            if (data?.user?.studentId) {
              router.push("/student");
            } else {
              router.push("/create-profile");
            }
            break;

          case "mentor":
            switch (designation?.toLowerCase()) {
              case "engineer":
                router.push("/admin-dashboard");
                break;

              case "hod":
                router.push("/hod-dashboard");
                break;
              case "assistant professor":
              case "associate professor":
              case "professor":
                router.push("/mentor-dashboard");
                break;

              default:
                router.push("/mentor-dashboard");
                break;
            }
            break;

          default:
            router.push("/login");
            break;
        }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md">
      {/* Login Card */}{" "}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 md:p-8">
        {/* Header */}{" "}
        <div className="flex justify-center items-center md:hidden">
          <Image
            src="/logo.png"
            alt="Apeejay Logo"
            width={90}
            height={90}
            className="  rounded-full my-2"
          />
        </div>
        <div className="py-2">
          <DashboardHeader
            title="Welcome Back"
            description=" Login to access your dashboard."
          />
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              required
              className="text-sm font-medium text-gray-800"
            >
              Email
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-10 w-full text-sm md:text-md bg-white text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 sm:h-11"
              required
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              required
              className="text-sm font-medium text-gray-800"
            >
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-10 w-full text-sm md:text-md bg-white pr-10 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 sm:h-11"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="h-10 w-full cursor-pointer bg-orange-500 text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:h-11"
          >
            {formik.isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          {/* Divider */}
        </form>
      </div>
    </div>
  );
};

export default Login;
