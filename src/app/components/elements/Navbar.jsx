"use client";

import Image from "next/image";
import {  signOut } from "next-auth/react";
import { useSelector } from "react-redux";
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
    <nav className="flex flex-col  md:flex-row items-center border justify-between px-2 md:px-8 py-4 ">
    <div className="flex gap-7">
    <Image
          src="/logo.png"
          alt="Apeejay Logo"
          width={50}
          height={550}
          className="rounded-full h-10 w-10 lg:h-12 lg:w-12"
        />  
        <div>
        <p className="text-primary font-bold text-md md:text-xl">Apeejay Institute of Management & Engineering </p>
        <span className="leading-relaxed  hidden md:flex text-sm">Technical campus Affiliated to  I.K Gujral Punjab Technical University , Kapurthala</span>
        </div>
    </div>

<div >
         {/* Right Side */}
      {!auth?.user?.name ? (
        <button
          onClick={() => {
            router.push("/login");
          }}
          className="rounded-md hidden lg:flex bg-primary  cursor-pointer px-4 py-2 text-white hover:bg-orange-600"
        >
          Login
        </button>
      ) : (
        <div>
            <p className="px-5 bg-primary cursor-pointer  text-white rounded-sm"> HI,{auth?.user?.name}</p>

  <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-primary/10 hover:bg-gray-100"
              >
                Logout
              </button>
          
        </div>
      )}
</div>
 
    </nav>
  );
}