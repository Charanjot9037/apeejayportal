"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/redux/authSlice";

export default function Navbar() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = !!auth?.user;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      dispatch(logout());

      await signOut({
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDashboard = () => {
    const role = auth?.user?.role;
    const designation = auth?.user?.designation;

    // Student
    if (role === "student") {
      router.push("/student");
      return;
    }

    // Mentor
    if (role === "mentor") {
      router.push("/mentor-dashboard");
      return;
    }

    // Admin based on designation
    if (role === "admin" || designation === "Engineer") {
      router.push("/admin-dashboard");
      return;
    }

       if (role === "admin" || designation === "hod") {
         router.push("/hod-dashboard");
         return;
       }
    router.push("/dashboard");
  };

  // Hide authentication section on these pages
  const hideAuthSection = pathname === "/" || pathname === "/studentSearch";

  return (
    <nav className="flex flex-col items-center justify-between border px-2 py-4 md:flex-row md:px-8">
      {/* Left Side */}
      <div className="flex gap-7">
        <Image
          src="/logo.png"
          alt="Apeejay Logo"
          width={50}
          height={50}
          className="h-10 w-10 rounded-full lg:h-12 lg:w-12"
        />

        <div>
          <p className="text-md font-bold text-secondary md:text-xl">
            Apeejay Institute of Management & Engineering
          </p>

          <span className="hidden text-sm leading-relaxed md:flex">
            Technical campus Affiliated to I.K Gujral Punjab Technical
            University, Kapurthala
          </span>
        </div>
      </div>

      {/* Right Side */}
    
        <div className="mt-4 flex items-center gap-3 md:mt-0">
          {!isLoggedIn ? (
            /* Not Logged In */
            <button
              onClick={() => router.push("/login")}
              className="cursor-pointer rounded-md bg-secondary px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Login
            </button>
          ) : (
            /* Logged In */
            <>
              <button
                onClick={handleDashboard}
                className="cursor-pointer rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Dashboard
              </button>

              
            </>
          )}
        </div>
    
    </nav>
  );
}
