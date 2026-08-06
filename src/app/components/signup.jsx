"use client";

import React from "react";
import { Input, Label, Button } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import {signupSchema} from "@/validations/signUpSchema";

import { classes, categories } from "../../constants/gloabl";

const Signup = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      className: "",
      category: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: signupSchema,

    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...payload } = values;

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        console.log(response.status);
        console.log(data);

        if (!response.ok) {
          throw new Error(data.message);
        }

        alert("Signup Successful");

        router.push("/login");
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 shadow-xl p-4">

        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="text-gray-600">
            Register to access your dashboard.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4 mt-5"
        >

          {/* Name + Email */}

          <div className="flex gap-2">

            <div className="w-1/2">

              <Label htmlFor="name">
                Full Name
              </Label>

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.name &&
                formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </p>
                )}

            </div>

            <div className="w-1/2">

              <Label htmlFor="email">
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
              />

              {formik.touched.email &&
                formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}

            </div>

          </div>

          {/* Mobile */}

          <div>

            <Label htmlFor="mobile">
              Mobile Number
            </Label>

            <Input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.mobile &&
              formik.errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.mobile}
                </p>
              )}

          </div>

          {/* Class + Category */}

          <div className="flex gap-2">

            <div className="w-1/2">

              <Label>
                Select Class
              </Label>

              <Select
                value={formik.values.className}
                onValueChange={(value) =>
                  formik.setFieldValue(
                    "className",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>

                <SelectContent>

                  {classes.map((item) => (

                    <SelectItem
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

              {formik.touched.className &&
                formik.errors.className && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.className}
                  </p>
                )}

            </div>

            <div className="w-1/2">

              <Label>
                Category
              </Label>

              <Select
                value={formik.values.category}
                onValueChange={(value) =>
                  formik.setFieldValue(
                    "category",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>

                  {categories.map((item) => (

                    <SelectItem
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

              {formik.touched.category &&
                formik.errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.category}
                  </p>
                )}

            </div>

          </div>

          {/* Password */}

          <div>

            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.password &&
              formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}

          </div>

          {/* Confirm Password */}

          <div>

            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}

          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Sign Up
          </Button>

        </form>

        <p className="mt-6 text-center text-gray-700">

          Already have an account?{" "}

          <a
            href="/login"
            className="font-semibold text-orange-500 hover:underline"
          >
            Login
          </a>

        </p>

      </div>
    </div>
  );
};

export default Signup;