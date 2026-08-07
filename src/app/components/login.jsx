"use client";

import React from "react";
import { Input, Label, Button } from "@/components/ui";
import { useFormik } from "formik";
import {loginSchema} from "@/validations/loginSchema";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import GoogleButton from "./elements/GoogleButton";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema,

    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        alert(data.message);
       dispatch(loginSuccess({
          user: data.user,
          name: data.name,
          email: data.email,
          profileImage: data.profileImage,
       }));
        console.log("User:", data.profileImage);

  

      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 shadow-xl shadow-blue-300/40 p-8">

        <div className="flex flex-col items-start gap-2 mb-6">
          <h1 className="text-3xl font-bold text-black">
            Welcome Back
          </h1>

          <p className="text-gray-600">
            Login to access your dashboard.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div className="space-y-2">

            <Label htmlFor="email" required>Email </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />

            {formik.touched.email &&
              formik.errors.email && (
                <p className="text-red-500 text-sm">
                  {formik.errors.email}
                </p>
              )}

          </div>

          {/* Password */}
<div className="space-y-2">

  <Label htmlFor="password" required> Password 
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
      className="pr-10"
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(!showPassword)
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
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
          {/* Forgot Password */}

          <div className="text-right">
            <a
              href="/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >Forgot Password?</a>
          </div>

          {/* Login Button */}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          > Login
          </Button>
          <div className="relative my-5">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>

  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-white px-2 text-gray-500"> OR </span>
  </div>
</div>
<GoogleButton />

        </form>

        <p className="mt-6 text-center text-gray-700">Don't have an account?{" "}
         <a
            href="/signup"
            className="font-semibold text-orange-500 hover:underline">Sign Up
          </a>

        </p>

      </div>
    </div>
  );
};

export default Login;