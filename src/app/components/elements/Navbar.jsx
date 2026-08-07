"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {logout} from "@/redux/authSlice";
export default function Navbar() {

const auth = useSelector((state) => state.auth);
const dispatch = useDispatch();


const router=useRouter();
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
  return (
    <nav className="flex flex-col md:flex-row items-center border justify-between px-2 md:px-8 py-4   shadow">
    <div className="flex">
    <Image
          src="/logo.png"
          alt="Apeejay Logo"
          width={50}
          height={550}
          className="rounded-full"
        />  <p className="text-orange-500 text-md md:text-lg">Apeejay institute of management and engineering technical campus,jalandhar </p>
    </div>

<div className="">
         {/* Right Side */}
      {!auth?.user?.name ? (
        <button
          onClick={() => {
            router.push("/login");
          }}
          className="rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          Login
        </button>
      ) : (
        <div>
            <p className="px-5 bg-orange-500 text-white rounded-sm"> HI,{auth?.user?.name}</p>

  <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
          
        </div>
      )}
</div>
 
    </nav>
  );
}