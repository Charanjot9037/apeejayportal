"use client";
import { useState } from "react";
import React from "react";
import { Input,Label,Button } from "@/components/ui";




const Login =() => {

    const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

const[formData,setFormData]=useState({
  email:"",
  password:"",
});
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      console.log("User:", data.user);
      console.log("Token:", data.accessToken);

      // Store access token (optional)//harhsal remove krdae
      localStorage.setItem(
        "accessToken",
        data.accessToken
      );

      // Redirect after login
      // window.location.href = "/dashboard";

    } else {
      alert(data.message || "Login failed");
    }

  } catch (error) {
    console.log("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
};
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

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              value={formData.email}
             onChange={handleChange}
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right">
            <a
              href="/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-orange-500 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;